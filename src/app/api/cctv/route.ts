import { NextRequest, NextResponse } from 'next/server';
import { addCctvRequest, getCctvRequests, updateCctvStatus } from '@/lib/store';

export async function GET() {
  const requests = getCctvRequests();
  return NextResponse.json(requests);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { unitNumber, phone, date, timeRange, location, reason } = body;

    if (!unitNumber || !phone || !date || !timeRange || !reason) {
      return NextResponse.json(
        { error: 'Тоот, утас, огноо, цаг болон шалтгааныг заавал бөглөнө үү' },
        { status: 400 }
      );
    }

    const created = addCctvRequest({
      unitNumber: unitNumber.trim(),
      phone: phone.trim(),
      date,
      timeRange: timeRange.trim(),
      location: location || 'Зогсоол / Нийтийн талбай',
      reason: reason.trim(),
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminNote } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID болон төлөв шаардлагатай' }, { status: 400 });
    }

    const updated = updateCctvStatus(id, status, adminNote);
    if (!updated) {
      return NextResponse.json({ error: 'Хүсэлт олдсонгүй' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
