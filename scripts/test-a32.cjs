const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { NextRequest } = require('next/server');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(relative) {
  const file = path.join(root, relative);
  if (cache.has(file)) return cache.get(file).exports;
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const mod = new Module(file, module);
  mod.filename = file; mod.paths = Module._nodeModulePaths(path.dirname(file));
  const original = mod.require.bind(mod);
  mod.require = id => id.startsWith('@/') ? load('src/'+id.slice(2)+'.ts') : original(id);
  cache.set(file, mod); mod._compile(code, file);
  return mod.exports;
}
Object.assign(process.env, { NODE_ENV: 'test', A32_ADMIN_PASSWORD: 'fixture-password-123456', A32_SESSION_SECRET: 'fixture-session-secret-123456789012345678', A32_BRIDGE_TOKEN: 'fixture-bridge-token-12345678901234567890', A32_BRIDGE_URL: 'http://127.0.0.1:8767', A32_ALLOW_LOCAL_BRIDGE: '1' });
delete process.env.VERCEL;
const auth = load('src/lib/a32-auth.ts');
const bridge = load('src/lib/a32-bridge.ts');
const session = load('src/app/api/a32/session/route.ts');
const proxy = load('src/app/api/a32/[resource]/route.ts');
function request(resource, { method = 'GET', body, cookie, origin } = {}) {
  return new NextRequest('http://localhost:3000/api/a32/'+resource, { method, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: `${auth.A32_COOKIE}=${cookie}` } : {}), ...(origin ? { Origin: origin } : {}) }, body: body ? JSON.stringify(body) : undefined });
}

test('server sessions reject tampering, expiry and password rotation', () => {
  const now = Date.now(); const token = auth.createSession(now);
  assert.equal(auth.validSession(token, now), true);
  assert.equal(auth.validSession(token+'x', now), false);
  assert.equal(auth.validSession(token, now+auth.SESSION_SECONDS*1000), false);
  const original = process.env.A32_ADMIN_PASSWORD;
  process.env.A32_ADMIN_PASSWORD = 'new-fixture-password-12345';
  assert.equal(auth.validSession(token, now), false);
  process.env.A32_ADMIN_PASSWORD = original;
});

test('login has no default password and issues HttpOnly strict cookies', async () => {
  const wrong = await session.POST(request('session', { method: 'POST', origin: 'http://localhost:3000', body: { password: 'admin123' } }));
  assert.equal(wrong.status, 401);
  const ok = await session.POST(request('session', { method: 'POST', origin: 'http://localhost:3000', body: { password: process.env.A32_ADMIN_PASSWORD } }));
  assert.equal(ok.status, 200);
  assert.match(ok.headers.get('set-cookie'), /httponly/i);
  assert.match(ok.headers.get('set-cookie'), /samesite=strict/i);
  assert.equal((await ok.json()).authenticated, true);
});

test('foreign origins cannot log in or command a relay', async () => {
  const login = await session.POST(request('session', { method: 'POST', origin: 'https://evil.example', body: { password: process.env.A32_ADMIN_PASSWORD } }));
  assert.equal(login.status, 403);
  const command = await proxy.POST(request('relay', { method: 'POST', cookie: auth.createSession(), origin: 'https://evil.example', body: { relay: 1, state: 'ON', requestId: '12345678-1234-1234-1234-123456789012' } }), { params: { resource: 'relay' } });
  assert.equal(command.status, 403);
});

test('unauthenticated status and commands never reach the bridge', async () => {
  const original = global.fetch; global.fetch = () => { throw new Error('Must not forward'); };
  try {
    assert.equal((await proxy.GET(request('status'), { params: { resource: 'status' } })).status, 401);
    assert.equal((await proxy.POST(request('relay', { method: 'POST', origin: 'http://localhost:3000', body: { relay: 1, state: 'ON' } }), { params: { resource: 'relay' } })).status, 401);
  } finally { global.fetch = original; }
});

test('validated commands forward server token and stable request ID only to the bridge', async () => {
  const original = global.fetch;
  const requestId = '12345678-1234-1234-1234-123456789012';
  global.fetch = async (url, options) => {
    assert.equal(url, 'http://127.0.0.1:8767/relay');
    assert.equal(options.headers.Authorization, 'Bearer '+process.env.A32_BRIDGE_TOKEN);
    assert.equal(options.headers['X-A32-Command-ID'], requestId);
    assert.equal(options.redirect, 'error');
    return Response.json({ ok: true, requestId });
  };
  try {
    const result = await proxy.POST(request('relay', { method: 'POST', origin: 'http://localhost:3000', cookie: auth.createSession(), body: { relay: 1, state: 'ON', requestId } }), { params: { resource: 'relay' } });
    assert.equal(result.status, 200);
    const text = await result.text();
    assert.equal(text.includes(process.env.A32_BRIDGE_TOKEN), false);
    assert.equal(text.includes(process.env.A32_ADMIN_PASSWORD), false);
  } finally { global.fetch = original; }
});

test('invalid channel and missing command ID fail before forwarding', () => {
  assert.equal(bridge.validCommand('relay', { relay: 33, state: 'ON', requestId: '12345678-1234-1234-1234-123456789012' }), false);
  assert.equal(bridge.validCommand('relay', { relay: 1, state: 'ON' }), false);
  assert.equal(bridge.validCommand('scene', { id: '../secret', requestId: '12345678-1234-1234-1234-123456789012' }), false);
});

test('production rejects HTTP even when the local development flag is set', () => {
  process.env.NODE_ENV = 'production';
  assert.throws(() => bridge.bridgeConfig(), /HTTPS/);
  process.env.NODE_ENV = 'test';
  assert.equal(bridge.bridgeConfig().url, 'http://127.0.0.1:8767');
});

test('login attempt limit expires without a global unlimited Map', () => {
  for (let i=0;i<10;i++) assert.equal(auth.allowLogin('test-ip', 0), true);
  assert.equal(auth.allowLogin('test-ip', 0), false);
  assert.equal(auth.allowLogin('test-ip', 16*60*1000), true);
});
