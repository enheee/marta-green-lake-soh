import { NextRequest, NextResponse } from 'next/server';
import { addDelivery, getDeliveries, getDeliveriesByUnit, markDeliveryPickedUp } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unit = searchParams.get('unit');

  if (unit) {
    const items = getDeliveriesByUnit(unit);
    return NextResponse.json(items);
  }

  const items = getDeliveries();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { unitNumber, courierCompany, itemDescription, photoUrl } = body;

    if (!unitNumber || !itemDescription) {
      return NextResponse.json(
        { error: 'Тоот болон илгээмжийн тайлбар шаардлагатай' },
        { status: 400 }
      );
    }

    const created = addDelivery({
      unitNumber: unitNumber.trim(),
      courierCompany: courierCompany || 'Хүргэлт',
      itemDescription: itemDescription.trim(),
      photoUrl,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID шаардлагатай' }, { status: 400 });
    }

    const updated = markDeliveryPickedUp(id);
    if (!updated) {
      return NextResponse.json({ error: 'Илгээмж олдсонгүй' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
