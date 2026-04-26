import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Return all contact messages (newest first), include count of unread
export async function GET() {
  try {
    const [messages, unreadCount] = await Promise.all([
      db.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      db.contactMessage.count({
        where: { isRead: false },
      }),
    ]);

    return NextResponse.json({ messages, unreadCount });
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a message by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    await db.contactMessage.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Message delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Mark a message as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isRead } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    const message = await db.contactMessage.update({
      where: { id },
      data: { isRead: isRead !== undefined ? isRead : true },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Message update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
