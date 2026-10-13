import { NextRequest, NextResponse } from 'next/server';
import { authenticated, sameOrigin } from '@/lib/a32-auth';
import { bridgeConfig, validCommand } from '@/lib/a32-bridge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;
type Context = { params: { resource: string } };
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

async function forward(request: NextRequest, resource: string, body?: Record<string, unknown>) {
  if (!authenticated(request)) return reply({ error: 'Төхөөрөмжийн хэсэгт дахин нэвтэрнэ үү.' }, 401);
  let config;
  try { config = bridgeConfig(); } catch (error) { return reply({ error: (error as Error).message }, 503); }
  try {
    const response = await fetch(`${config.url}/${resource}`, {
      method: body ? 'POST' : 'GET', cache: 'no-store', redirect: 'error',
      headers: { Authorization: `Bearer ${config.token}`, ...(body ? { 'Content-Type': 'application/json', 'X-A32-Command-ID': String(body.requestId) } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(body ? 25000 : 8000),
    });
    if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Unexpected bridge response');
    const result = await response.json();
    if (!result || typeof result !== 'object' || typeof result.ok !== 'boolean') throw new Error('Unexpected bridge data');
    // The bridge only returns device data and command results, never credentials.
    return reply(result, response.status);
  } catch {
    return reply({ error: body ? 'Командын үр дүн баталгаажаагүй. Самбарын төлөвийг шинэчилж шалгана уу; команд автоматаар дахин илгээгдэхгүй.' : 'СӨХ-ийн PC сервертэй холбогдохгүй байна. Тэжээл, сервер болон HTTPS холбоосыг шалгана уу.' }, 502);
  }
}

export async function GET(request: NextRequest, { params }: Context) {
  if (!['status', 'automation'].includes(params.resource)) return reply({ error: 'Хаяг олдсонгүй.' }, 404);
  return forward(request, params.resource);
}

export async function POST(request: NextRequest, { params }: Context) {
  if (!sameOrigin(request)) return reply({ error: 'Хүсэлтийн эх сурвалж зөвшөөрөгдөөгүй.' }, 403);
  if (!authenticated(request)) return reply({ error: 'Төхөөрөмжийн хэсэгт нэвтэрнэ үү.' }, 401);
  try {
    const text = await request.text();
    if (text.length > 4096) return reply({ error: 'Хүсэлт хэт урт байна.' }, 413);
    const body = JSON.parse(text);
    if (!validCommand(params.resource, body)) return reply({ error: 'Реле эсвэл горимын команд буруу байна.' }, 400);
    return forward(request, params.resource, body);
  } catch { return reply({ error: 'Хүсэлт буруу байна.' }, 400); }
}
