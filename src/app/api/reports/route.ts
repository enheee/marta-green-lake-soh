import { NextRequest, NextResponse } from 'next/server';
import { addReport, getReports } from '@/lib/store';

export async function GET() {
  const reports = getReports();
  return NextResponse.json(reports);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, period, income, expense, balance } = body;

    if (!title || !period) {
      return NextResponse.json({ error: 'Тайлангийн нэр болон хамрах хугацаа шаардлагатай' }, { status: 400 });
    }

    const created = addReport({
      title,
      period,
      income: Number(income) || 0,
      expense: Number(expense) || 0,
      balance: Number(balance) || (Number(income) || 0) - (Number(expense) || 0),
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
