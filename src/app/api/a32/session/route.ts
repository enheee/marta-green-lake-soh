import { NextRequest, NextResponse } from 'next/server';
import { A32_COOKIE, SESSION_SECONDS, allowLogin, authenticated, authConfigured, clearAttempts, createSession, passwordMatches, sameOrigin } from '@/lib/a32-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(request: NextRequest) {
  return reply({ configured: authConfigured(), authenticated: authenticated(request), bridgeConfigured: Boolean(process.env.A32_BRIDGE_URL && process.env.A32_BRIDGE_TOKEN) });
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return reply({ error: 'Хүсэлтийн эх сурвалж зөвшөөрөгдөөгүй.' }, 403);
  if (!authConfigured()) return reply({ error: 'Төхөөрөмжийн нэвтрэх тохиргоог сервер дээр хийнэ үү.' }, 503);
  const key = (request.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  if (!allowLogin(key)) return reply({ error: 'Олон оролдлого хийсэн байна. 15 минутын дараа дахин оролдоно уу.' }, 429);
  try {
    const text = await request.text();
    if (text.length > 4096) return reply({ error: 'Хүсэлт хэт урт байна.' }, 413);
    const body = JSON.parse(text);
    if (!passwordMatches(body?.password)) return reply({ error: 'Нэвтрэх нууц үг буруу байна.' }, 401);
    clearAttempts(key);
    const response = reply({ authenticated: true });
    response.cookies.set(A32_COOKIE, createSession(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/a32', maxAge: SESSION_SECONDS });
    return response;
  } catch { return reply({ error: 'Хүсэлт буруу байна.' }, 400); }
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return reply({ error: 'Хүсэлтийн эх сурвалж зөвшөөрөгдөөгүй.' }, 403);
  const response = reply({ authenticated: false });
  response.cookies.set(A32_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/a32', maxAge: 0 });
  return response;
}
