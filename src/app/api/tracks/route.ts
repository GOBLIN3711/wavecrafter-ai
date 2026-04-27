import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
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

const ALLOWED_TYPES = [
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac',
  'audio/mp4', 'audio/x-m4a', 'audio/webm', 'audio/mp3',
];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB — Blob supports this

export async function POST(request: NextRequest) {
  try {
    await ensureTables();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const titleRu = (formData.get('titleRu') as string) || '';
    const genre = (formData.get('genre') as string) || '';
    const description = (formData.get('description') as string) || '';

    if (!title.trim() || !titleRu.trim()) {
      return NextResponse.json({ error: 'Title and titleRu are required' }, { status: 400 });
    }

    let audioUrl: string | null = null;
    let fileName: string | null = null;

    if (file && file.size > 0) {
      if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|aac|m4a|webm)$/i)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
      }

      // Upload to Vercel Blob
      const blob = await put(`music/${Date.now()}_${file.name}`, file, {
        access: 'public',
        addRandomSuffix: true,
      });
      audioUrl = blob.url;
      fileName = file.name;
    }

    // Get max order
    const maxOrder = await db.track.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const trackOrder = (maxOrder?.order ?? -1) + 1;

    const track = await db.track.create({
      data: {
        title: title.trim(),
        titleRu: titleRu.trim(),
        genre: genre.trim() || null,
        description: description.trim() || null,
        fileName,
        audioUrl,
        order: trackOrder,
      },
    });

    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    console.error('Track upload error:', error);
    return NextResponse.json({ error: 'Failed to upload track' }, { status: 500 });
  }
}
