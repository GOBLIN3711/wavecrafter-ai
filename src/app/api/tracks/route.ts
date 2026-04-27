
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const tracks = await db.track.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true, title: true, titleRu: true, description: true,
        genre: true, duration: true, fileName: true, audioUrl: true,
        order: true, isActive: true, createdAt: true, updatedAt: true,
      },
    });
    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Tracks fetch error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = (formData.get('title') as string) || '';
    const titleRu = (formData.get('titleRu') as string) || '';
    const genre = (formData.get('genre') as string) || '';
    const description = (formData.get('description') as string) || '';
    const file = formData.get('file') as File | null;

    let fileName = '';
    let audioUrl = '';

    if (file && file.size > 0) {
      const { put } = await import('@vercel/blob');
      const blob = await put(file.name, file, { access: 'public' });
      audioUrl = blob.url;
      fileName = file.name;
    }

    if (!title.trim() || !titleRu.trim()) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 });
    }

    const maxOrder = await db.track.findFirst({ orderBy: { order: 'desc' }, select: { order: true } });
    const track = await db.track.create({
      data: {
        title: title.trim(), titleRu: titleRu.trim(),
        genre: genre?.trim() || null, description: description?.trim() || null,
        fileName: fileName || null, audioUrl: audioUrl || null,
        order: (maxOrder?.order ?? -1) + 1,
      },
    });
    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    console.error('Track creation error:', error);
    const msg = error instanceof Error ? error.message : 'Failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
