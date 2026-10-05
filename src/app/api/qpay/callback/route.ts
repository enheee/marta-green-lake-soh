import { NextRequest, NextResponse } from 'next/server';
import { updateBill, getBills } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const billId = searchParams.get('billId');

  if (billId) {
    const bill = getBills().find((b) => b.id === billId);
    if (bill) {
      updateBill(bill.id, {
        status: 'Төлсөн',
        totalDue: 0,
        paidDate: new Date().toISOString().slice(0, 10),
      });
    }
  }

  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const billId = searchParams.get('billId');
    const body = await request.json().catch(() => ({}));

    if (billId) {
      const bill = getBills().find((b) => b.id === billId);
      if (bill) {
        updateBill(bill.id, {
          status: 'Төлсөн',
          totalDue: 0,
          paidDate: new Date().toISOString().slice(0, 10),
        });
      }
    }

    return NextResponse.json({ success: true, received: body });
  } catch (error) {
    return NextResponse.json({ error: 'Callback processing error' }, { status: 500 });
  }
}
