export function bridgeConfig() {
  const token = process.env.A32_BRIDGE_TOKEN || '';
  if (!process.env.A32_BRIDGE_URL || token.length < 32) throw new Error('A32 холболтын URL болон token тохируулаагүй байна.');
  const url = new URL(process.env.A32_BRIDGE_URL);
  const localDev = process.env.NODE_ENV !== 'production' && !process.env.VERCEL && process.env.A32_ALLOW_LOCAL_BRIDGE === '1' && url.protocol === 'http:' && url.hostname === '127.0.0.1';
  if ((!localDev && url.protocol !== 'https:') || url.username || url.password || url.search || url.hash) throw new Error('A32 холболтын хаяг HTTPS байх ёстой.');
  return { url: url.toString().replace(/\/$/, ''), token };
}

export function validCommand(resource: string, body: unknown): body is Record<string, unknown> {
  if (!body || typeof body !== 'object') return false;
  const data = body as Record<string, unknown>;
  if (typeof data.requestId !== 'string' || !/^[a-f0-9-]{36}$/i.test(data.requestId)) return false;
  if (resource === 'relay') return Number.isInteger(data.relay) && Number(data.relay) >= 1 && Number(data.relay) <= 32 && (data.state === 'ON' || data.state === 'OFF');
  if (resource === 'scene') return typeof data.id === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(data.id);
  return false;
}
