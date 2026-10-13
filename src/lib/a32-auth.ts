import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';

export const A32_COOKIE = 'soh_a32_session';
export const SESSION_SECONDS = 30 * 60;

function authConfig() {
  const password = process.env.A32_ADMIN_PASSWORD || '';
  const secret = process.env.A32_SESSION_SECRET || '';
  if (password.length < 12 || secret.length < 32) return null;
  return { password, secret };
}

export function authConfigured() { return Boolean(authConfig()); }

function digest(value: string) { return createHash('sha256').update(value).digest(); }
export function passwordMatches(password: unknown) {
  const config = authConfig();
  return Boolean(config && typeof password === 'string' && password.length <= 256 && timingSafeEqual(digest(password), digest(config.password)));
}

function sign(payload: string) {
  const config = authConfig();
  if (!config) throw new Error('A32 authentication not configured');
  return createHmac('sha256', config.secret).update(digest(config.password)).update(payload).digest('base64url');
}

export function createSession(now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(now / 1000) + SESSION_SECONDS, nonce: randomBytes(16).toString('hex') })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function validSession(token?: string, now = Date.now()) {
  if (!authConfigured() || !token || token.length > 512) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 2 || !timingSafeEqual(digest(parts[1]), digest(sign(parts[0])))) return false;
    const data = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    const seconds = Math.floor(now / 1000);
    return Number.isInteger(data.exp) && data.exp > seconds && data.exp <= seconds + SESSION_SECONDS;
  } catch { return false; }
}

export function authenticated(request: NextRequest) {
  return validSession(request.cookies.get(A32_COOKIE)?.value);
}

export function sameOrigin(request: NextRequest) {
  return request.headers.get('origin') === request.nextUrl.origin;
}

// Warm-instance limit is supplementary; deploy with a strong random password
// and an upstream rate-limit policy rather than treating this Map as global.
const attempts = new Map<string, { count: number; until: number }>();
export function allowLogin(key: string, now = Date.now()) {
  attempts.forEach((value, id) => { if (value.until <= now) attempts.delete(id); });
  if (attempts.size >= 1000 && !attempts.has(key)) return false;
  const entry = attempts.get(key) || { count: 0, until: now + 15 * 60 * 1000 };
  if (entry.count >= 10) return false;
  entry.count += 1;
  attempts.set(key, entry);
  return true;
}

export function clearAttempts(key: string) { attempts.delete(key); }
