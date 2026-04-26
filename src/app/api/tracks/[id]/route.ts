import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET single track (for admin panel details)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const track = await db.track.findUnique({
      where: { id },
    });

    if (!track) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(track);
  } catch (error) {
    console.error('Track fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Update track details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, titleRu, description, genre, duration, fileName, order, isActive } = body;

    const existing = await db.track.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (titleRu !== undefined) updateData.titleRu = titleRu;
    if (description !== undefined) updateData.description = description;
    if (genre !== undefined) updateData.genre = genre;
    if (duration !== undefined) updateData.duration = duration;
    if (fileName !== undefined) updateData.fileName = fileName;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const track = await db.track.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(track);
  } catch (error) {
    console.error('Track update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Soft-delete (set isActive = false)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.track.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    // Soft delete
    const track = await db.track.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json(track);
  } catch (error) {
    console.error('Track delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
