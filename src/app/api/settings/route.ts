import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod/v4';

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

const settingsArraySchema = z.array(settingSchema);

// GET: Return all settings as a flat key-value object
export async function GET() {
  try {
    const allSettings = await db.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of allSettings) {
      settingsMap[s.key] = s.value;
    }
    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update settings (accept array of {key, value} objects)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = settingsArraySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid settings format', details: result.error.issues },
        { status: 400 }
      );
    }

    // Use upsert to create or update each setting
    await Promise.all(
      result.data.map(({ key, value }) =>
        db.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
