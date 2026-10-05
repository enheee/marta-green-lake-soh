import { NextRequest, NextResponse } from 'next/server';
import { checkQPayInvoiceStatus } from '@/lib/qpay';
import { updateBill, getBills } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, billId, simulateSuccess } = body;

    if (!billId) {
      return NextResponse.json({ error: 'billId шаардлагатай' }, { status: 400 });
    }

    const bill = getBills().find((b) => b.id === billId);
    if (!bill) {
      return NextResponse.json({ error: 'Төлбөрийн баримт олдсонгүй' }, { status: 404 });
    }

    let isPaid = false;
    let paymentDate = new Date().toISOString().slice(0, 10);

    // If testing or simulated completion
    if (simulateSuccess) {
      isPaid = true;
    } else if (invoiceId) {
      const statusResult = await checkQPayInvoiceStatus(invoiceId);
      isPaid = statusResult.paid;
      if (statusResult.paidDate) {
        paymentDate = statusResult.paidDate.slice(0, 10);
      }
    }

    if (isPaid) {
      const updated = updateBill(bill.id, {
        status: 'Төлсөн',
        totalDue: 0,
        paidDate: paymentDate,
      });

      return NextResponse.json({
        success: true,
        paid: true,
        message: 'Төлбөр амжилттай баталгаажлаа',
        bill: updated,
      });
    }

    return NextResponse.json({
      success: true,
      paid: false,
      message: 'Төлбөр хүлээгдэж байна',
    });
  } catch (error) {
    console.error('QPay check error:', error);
    return NextResponse.json({ error: 'Шалгахад алдаа гарлаа' }, { status: 500 });
  }
}
