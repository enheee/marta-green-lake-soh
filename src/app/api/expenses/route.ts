import { NextRequest, NextResponse } from 'next/server';
import { addExpense, deleteExpense, getExpenses } from '@/lib/store';

export async function GET() {
  const expenses = getExpenses();
  return NextResponse.json(expenses);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, amount, date, storeName, photoUrl } = body;

    if (!title || !amount) {
      return NextResponse.json(
        { error: 'Баримтын нэр болон мөнгөн дүн шаардлагатай' },
        { status: 400 }
      );
    }

    const created = addExpense({
      title: title.trim(),
      category: category || 'Бусад',
      amount: Number(amount) || 0,
      date: date || new Date().toISOString().slice(0, 10),
      storeName: storeName || 'Дэлгүүр/Зах',
      photoUrl,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/expenses:', error);
    return NextResponse.json({ error: 'Алдаа гарлаа', details: error?.message || String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID шаардлагатай' }, { status: 400 });

    const success = deleteExpense(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
