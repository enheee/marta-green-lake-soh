import { NextRequest, NextResponse } from 'next/server';
import {
  addAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from '@/lib/store';

export async function GET() {
  const announcements = getAnnouncements();
  return NextResponse.json(announcements);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, isImportant, date, author } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Гарчиг болон агуулга шаардлагатай' }, { status: 400 });
    }

    const created = addAnnouncement({
      title,
      content,
      category: category || 'Бусад',
      isImportant: Boolean(isImportant),
      date: date || new Date().toISOString().slice(0, 10),
      author: author || 'СӨХ-ийн Удирдах зөвлөл',
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID шаардлагатай' }, { status: 400 });
    }

    const updated = updateAnnouncement(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Зарлал олдсонгүй' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID шаардлагатай' }, { status: 400 });
    }

    const deleted = deleteAnnouncement(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Зарлал олдсонгүй' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
