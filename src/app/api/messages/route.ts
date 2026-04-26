import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

let tablesEnsured = false;

async function ensureTables() {
  if (tablesEnsured) return;
  try {
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    await pool.query(`CREATE TABLE IF NOT EXISTS "ContactMessage" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "company" TEXT, "venueType" TEXT, "message" TEXT NOT NULL, "isRead" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS "Track" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "titleRu" TEXT NOT NULL, "description" TEXT, "genre" TEXT, "duration" DOUBLE PRECISION, "fileName" TEXT, "audioData" TEXT, "audioMimeType" TEXT, "order" INTEGER NOT NULL DEFAULT 0, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL)`);
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
    const [messages, unreadCount] = await Promise.all([
      db.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
      db.contactMessage.count({ where: { isRead: false } }),
    ]);
    return NextResponse.json({ messages, unreadCount });
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureTables();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Message delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await ensureTables();
    const body = await request.json();
    const { id, isRead } = body;
    if (!id) return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    const message = await db.contactMessage.update({ where: { id }, data: { isRead: isRead !== undefined ? isRead : true } });
    return NextResponse.json(message);
  } catch (error) {
    console.error('Message update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
