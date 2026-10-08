import { NextRequest, NextResponse } from 'next/server';
import { getBillByUnit, getBills, updateBill, updateMultipleBills } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unit = searchParams.get('unit');

  if (unit) {
    const bill = getBillByUnit(unit);
    if (!bill) {
      return NextResponse.json({ error: 'Тоот олдсонгүй' }, { status: 404 });
    }
    return NextResponse.json(bill);
  }

  const bills = getBills();
  return NextResponse.json(bills);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID шаардлагатай' }, { status: 400 });
    }

    const updated = updateBill(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Тоот олдсонгүй' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (Array.isArray(body)) {
      // Bulk update/replace
      updateMultipleBills(body);
      return NextResponse.json({ success: true, count: body.length });
    }
    return NextResponse.json({ error: 'Буруу формат' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
