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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTables();
    const { id } = await params;
    const track = await db.track.findUnique({
      where: { id, isActive: true },
      select: { audioData: true, audioMimeType: true, fileName: true },
    });
    if (!track || !track.audioData) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }
    const audioBuffer = Buffer.from(track.audioData, 'base64');
    const fileSize = audioBuffer.length;
    const contentType = track.audioMimeType || 'audio/mpeg';
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;
        const chunkSize = end - start + 1;
        return new NextResponse(audioBuffer.slice(start, end + 1), {
          status: 206,
          headers: { 'Content-Type': contentType, 'Content-Length': chunkSize.toString(), 'Content-Range': `bytes ${start}-${end}/${fileSize}`, 'Accept-Ranges': 'bytes', 'Cache-Control': 'public, max-age=86400' },
        });
      }
    }
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: { 'Content-Type': contentType, 'Content-Length': fileSize.toString(), 'Accept-Ranges': 'bytes', 'Cache-Control': 'public, max-age=86400' },
    });
  } catch (error) {
    console.error('Music serve error:', error);
    return NextResponse.json({ error: 'Failed to serve audio' }, { status: 500 });
  }
}
