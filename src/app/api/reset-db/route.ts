import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    await pool.query(`DROP TABLE IF EXISTS "SiteSetting" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "Track" CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS "ContactMessage" CASCADE`);

    await pool.query(`CREATE TABLE IF NOT EXISTS "ContactMessage" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "company" TEXT, "venueType" TEXT, "message" TEXT NOT NULL, "isRead" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS "Track" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "titleRu" TEXT NOT NULL, "description" TEXT, "genre" TEXT, "duration" DOUBLE PRECISION, "fileName" TEXT, "audioUrl" TEXT, "order" INTEGER NOT NULL DEFAULT 0, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS "SiteSetting" ("id" TEXT NOT NULL PRIMARY KEY, "key" TEXT NOT NULL, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL)`);
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS "SiteSetting_key_key" ON "SiteSetting"("key")`);

    await pool.end();

    return NextResponse.json({ success: true, message: 'Database reset complete' });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
