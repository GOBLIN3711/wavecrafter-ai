import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod/v4';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  company: z.string().optional(),
  venueType: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, company, venueType, message } = result.data;

    await db.contactMessage.create({
      data: {
        name,
        email,
        company: company || null,
        venueType: venueType || null,
        message,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Message received successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
