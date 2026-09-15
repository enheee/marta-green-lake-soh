import { NextRequest, NextResponse } from 'next/server';
import { closePoll, createPoll, deletePoll, getPolls, votePoll } from '@/lib/store';

export async function GET() {
  const polls = getPolls();
  return NextResponse.json(polls);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // If vote action
    if (body.action === 'vote') {
      const { pollId, unitNumber, optionId } = body;
      if (!pollId || !unitNumber || !optionId) {
        return NextResponse.json({ error: 'Тоот болон сонголт шаардлагатай' }, { status: 400 });
      }
      const result = votePoll(pollId, unitNumber, optionId);
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }
      return NextResponse.json(result);
    }

    // Admin create poll
    const { title, description, options, endDate } = body;
    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: 'Гарчиг болон дор хаяж 2 сонголт шаардлагатай' },
        { status: 400 }
      );
    }

    const created = createPoll({
      title,
      description: description || '',
      options,
      endDate: endDate || '2026-10-01',
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { pollId, action } = body;

    if (action === 'close') {
      const success = closePoll(pollId);
      if (!success) {
        return NextResponse.json({ error: 'Санал асуулга олдсонгүй' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Буруу үйлдэл' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID шаардлагатай' }, { status: 400 });

    const success = deletePoll(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
