
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// GET — return list of tracks
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

// POST — create track record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, titleRu, genre, description, fileName, audioUrl } = body;

    if (!title.trim() || !titleRu.trim()) {
      return NextResponse.json({ error: 'Title and titleRu are required' }, { status: 400 });
    }

    const maxOrder = await db.track.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const trackOrder = (maxOrder?.order ?? -1) + 1;

    const track = await db.track.create({
      data: {
        title: title.trim(),
        titleRu: titleRu.trim(),
        genre: genre?.trim() || null,
        description: description?.trim() || null,
        fileName: fileName || null,
        audioUrl: audioUrl || null,
        order: trackOrder,
      },
    });

    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    console.error('Track creation error:', error);
    return NextResponse.json({ error: 'Failed to create track' }, { status: 500 });
  }
}
