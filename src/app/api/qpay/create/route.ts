import { NextRequest, NextResponse } from 'next/server';
import { getBillByUnit, getBills } from '@/lib/store';
import { createQPayInvoice } from '@/lib/qpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { billId, unitNumber } = body;

    let targetBill = null;
    if (billId) {
      targetBill = getBills().find((b) => b.id === billId);
    }
    if (!targetBill && unitNumber) {
      targetBill = getBillByUnit(unitNumber);
    }

    if (!targetBill) {
      return NextResponse.json({ error: 'Төлбөрийн мэдээлэл олдсонгүй' }, { status: 404 });
    }

    const dueAmount = targetBill.totalDue > 0 ? targetBill.totalDue : targetBill.amount;

    const invoice = await createQPayInvoice({
      billId: targetBill.id,
      unitNumber: targetBill.unitNumber,
      amount: dueAmount,
      month: targetBill.month,
    });

    return NextResponse.json({ success: true, data: invoice, bill: targetBill });
  } catch (error) {
    console.error('QPay create error:', error);
    return NextResponse.json({ error: 'QPay нэхэмжлэх үүсгэхэд алдаа гарлаа' }, { status: 500 });
  }
}
