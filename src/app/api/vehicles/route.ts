import { NextRequest, NextResponse } from 'next/server';
import { deleteVehicle, getVehicles, registerVehicle, searchVehicle } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (q) {
    const results = searchVehicle(q);
    return NextResponse.json(results);
  }

  const vehicles = getVehicles();
  return NextResponse.json(vehicles);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plateNumber, unitNumber, carModel, ownerName, ownerPhone } = body;

    if (!plateNumber || !unitNumber || !ownerPhone) {
      return NextResponse.json(
        { error: 'Улсын дугаар, тоот, холбогдох утас шаардлагатай' },
        { status: 400 }
      );
    }

    const created = registerVehicle({
      plateNumber: plateNumber.toUpperCase().trim(),
      unitNumber: unitNumber.trim(),
      carModel: carModel || 'Тодорхойгүй',
      ownerName: ownerName || `${unitNumber}-р тоот`,
      ownerPhone: ownerPhone.trim(),
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID шаардлагатай' }, { status: 400 });

    const success = deleteVehicle(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
