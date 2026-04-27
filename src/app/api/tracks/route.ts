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

// GET — return list of tracks
export async function GET() {
  try {
    await ensureTables();
    const tracks = await db.track.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true, title: true, titleRu: true, description: true,
        genre: true, duration: true, fileName: true, audioUrl: true,
        order: true, isActive: true, createdAt: true, updatedAt: true,
      },
    });
    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Tracks fetch error:', error);
    return NextResponse.json([]);
  }
}

// POST — create track (accepts FormData with optional file)
export async function POST(request: NextRequest) {
  try {
    await ensureTables();
    const contentType = request.headers.get('content-type') || '';

    let title = '';
    let titleRu = '';
    let genre = '';
    let description = '';
    let fileName = '';
    let audioUrl = '';

    if (contentType.includes('multipart/form-data')) {
      // FormData upload (file + metadata)
      const formData = await request.formData();
      title = (formData.get('title') as string) || '';
      titleRu = (formData.get('titleRu') as string) || '';
      genre = (formData.get('genre') as string) || '';
      description = (formData.get('description') as string) || '';
      const file = formData.get('file') as File | null;

      if (file && file.size > 0) {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          return NextResponse.json({ error: 'Blob store not connected. Check Vercel > Storage > Blob.' }, { status: 500 });
        }
        const { put } = await import('@vercel/blob');
        const blob = await put(file.name, file, { access: 'public' });
        audioUrl = blob.url;
        fileName = file.name;
      }
    } else {
      // JSON upload (metadata only, no file)
      const body = await request.json();
      title = body.title || '';
      titleRu = body.titleRu || '';
      genre = body.genre || '';
      description = body.description || '';
      fileName = body.fileName || '';
      audioUrl = body.audioUrl || '';
    }

    if (!title.trim() || !titleRu.trim()) {
      return NextResponse.json({ error: 'Title and titleRu are required' }, { status: 400 });
    }

    const maxOrder = await db.track.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const trackOrder = (maxOrder?.order ?? -1) + 1;

    const track = await db.track.create({
      data: {
        title: title.trim(),
        titleRu: titleRu.trim(),
        genre: genre?.trim() || null,
        description: description?.trim() || null,
        fileName: fileName || null,
        audioUrl: audioUrl || null,
        order: trackOrder,
      },
    });

    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    console.error('Track creation error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create track';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
