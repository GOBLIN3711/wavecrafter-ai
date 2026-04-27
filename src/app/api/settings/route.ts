import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

let tablesEnsured = false;

async function ensureTables() {
  if (tablesEnsured) return;
  try {
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    await pool.query(`CREATE TABLE IF NOT EXISTS "ContactMessage" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "company" TEXT, "venueType" TEXT, "message" TEXT NOT NULL, "isRead" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS "Track" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "titleRu" TEXT NOT NULL, "description" TEXT, "genre" TEXT, "duration" DOUBLE PRECISION, "fileName" TEXT, "audioUrl" TEXT, "order" INTEGER NOT NULL DEFAULT 0, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS "SiteSetting" ("id" TEXT NOT NULL PRIMARY KEY, "key" TEXT NOT NULL, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL)`);
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS "SiteSetting_key_key" ON "SiteSetting"("key")`);
    await pool.end();
    tablesEnsured = true;
  } catch (e) {
    tablesEnsured = true;
  }
}

export async function GET() {
  try {
    await ensureTables();
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
    await ensureTables();
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
