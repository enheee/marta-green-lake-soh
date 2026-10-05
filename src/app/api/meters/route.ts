import { NextRequest, NextResponse } from 'next/server';
import { addMeterReading, getMeters, getMetersByUnit, updateMeterStatus } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unit = searchParams.get('unit');

  if (unit) {
    const readings = getMetersByUnit(unit);
    return NextResponse.json(readings);
  }

  const allMeters = getMeters();
  return NextResponse.json(allMeters);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { unitNumber, residentName, period, coldWater, hotWater, electricity, photoUrl } = body;

    if (!unitNumber || coldWater === undefined || hotWater === undefined) {
      return NextResponse.json(
        { error: 'Тоот болон хүйтэн, халуун усны заалт шаардлагатай' },
        { status: 400 }
      );
    }

    const created = addMeterReading({
      unitNumber: unitNumber.trim(),
      residentName: residentName || `${unitNumber}-р тоот`,
      period: period || `${new Date().getFullYear()} оны ${new Date().getMonth() + 1}-р сар`,
      coldWater: Number(coldWater) || 0,
      hotWater: Number(hotWater) || 0,
      electricity: electricity !== undefined ? Number(electricity) : undefined,
      photoUrl,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID болон төлөв шаардлагатай' }, { status: 400 });
    }

    const updated = updateMeterStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Заалт олдсонгүй' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
