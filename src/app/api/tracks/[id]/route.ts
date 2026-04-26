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
    const track = await db.track.findUnique({
      where: { id },
    });
    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }
    return NextResponse.json(track);
  } catch (error) {
    console.error('Track fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTables();
    const { id } = await params;
    const body = await request.json();
    const { title, titleRu, description, genre, duration, fileName, order, isActive } = body;
    const existing = await db.track.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (titleRu !== undefined) updateData.titleRu = titleRu;
    if (description !== undefined) updateData.description = description;
    if (genre !== undefined) updateData.genre = genre;
    if (duration !== undefined) updateData.duration = duration;
    if (fileName !== undefined) updateData.fileName = fileName;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;
    const track = await db.track.update({ where: { id }, data: updateData });
    return NextResponse.json(track);
  } catch (error) {
    console.error('Track update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTables();
    const { id } = await params;
    const existing = await db.track.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    const track = await db.track.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json(track);
  } catch (error) {
    console.error('Track delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
