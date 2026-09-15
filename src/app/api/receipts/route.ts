import { NextRequest, NextResponse } from 'next/server';
import { approveReceipt, createReceipt, getReceipts, rejectReceipt } from '@/lib/store';

export async function GET() {
  const receipts = getReceipts();
  return NextResponse.json(receipts);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { unitNumber, amount, bankName, transactionNo, receiptImage, note } = body;

    if (!unitNumber || !amount) {
      return NextResponse.json(
        { error: 'Тоот болон шилжүүлсэн дүн шаардлагатай' },
        { status: 400 }
      );
    }

    const created = createReceipt({
      unitNumber,
      amount: Number(amount) || 0,
      bankName: bankName || 'Хаан Банк',
      transactionNo: transactionNo || `TXN-${Date.now().toString().slice(-6)}`,
      receiptImage,
      note,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { receiptId, action } = body;

    if (!receiptId) {
      return NextResponse.json({ error: 'Receipt ID шаардлагатай' }, { status: 400 });
    }

    if (action === 'approve') {
      const result = approveReceipt(receiptId);
      if (!result.success) {
        return NextResponse.json({ error: 'Баримт олдсонгүй' }, { status: 404 });
      }
      return NextResponse.json(result);
    }

    if (action === 'reject') {
      const success = rejectReceipt(receiptId);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Буруу үйлдэл' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
