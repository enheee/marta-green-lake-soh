import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/store';

export async function GET() {
  const settings = getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = updateSettings(body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
