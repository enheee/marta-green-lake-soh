import { NextRequest, NextResponse } from 'next/server';
import { addRequest, getRequests, updateRequestStatus } from '@/lib/store';

export async function GET() {
  const requests = getRequests();
  return NextResponse.json(requests);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { unitNumber, residentName, phone, category, title, description } = body;

    if (!unitNumber || !phone || !description) {
      return NextResponse.json({ error: 'Тоот, утасны дугаар, тайлбар шаардлагатай' }, { status: 400 });
    }

    const created = addRequest({
      unitNumber,
      residentName: residentName || `${unitNumber}-р тоот`,
      phone,
      category: category || 'Бусад',
      title: title || `${category || 'Санал хүсэлт'} - ${unitNumber}-р тоот`,
      description,
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

    const updated = updateRequestStatus(id, status, adminNote);
    if (!updated) {
      return NextResponse.json({ error: 'Хүсэлт олдсонгүй' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
