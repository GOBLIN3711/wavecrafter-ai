import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const allSettings = await db.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const s of allSettings) { settingsMap[s.key] = s.value; }
    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    await Promise.all(
      body.map(({ key, value }: { key: string; value: string }) =>
        db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
