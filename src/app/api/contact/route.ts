import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, venueType, message } = body;
    await db.contactMessage.create({
      data: { name, email, company: company || null, venueType: venueType || null, message },
    });
    return NextResponse.json({ success: true, message: 'Message received successfully' }, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
