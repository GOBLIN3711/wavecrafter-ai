import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

let tablesEnsured = false;

async function ensureTables() {
  if (tablesEnsured) return;
  try {
    // Use raw pg to create tables (Prisma needs tables to exist)
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    await pool.query(`CREATE TABLE IF NOT EXISTS "ContactMessage" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "company" TEXT, "venueType" TEXT, "message" TEXT NOT NULL, "isRead" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS "Track" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "titleRu" TEXT NOT NULL, "description" TEXT, "genre" TEXT, "duration" DOUBLE PRECISION, "fileName" TEXT, "audioData" TEXT, "audioMimeType" TEXT, "order" INTEGER NOT NULL DEFAULT 0, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS "SiteSetting" ("id" TEXT NOT NULL PRIMARY KEY, "key" TEXT NOT NULL, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL)`);
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS "SiteSetting_key_key" ON "SiteSetting"("key")`);
    
    await pool.end();
    tablesEnsured = true;
  } catch (e) {
    tablesEnsured = true; // don't retry
  }
}

export async function GET() {
  try {
    await ensureTables();
    const tracks = await db.track.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        titleRu: true,
        description: true,
        genre: true,
        duration: true,
        fileName: true,
        audioMimeType: true,
        order: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Tracks fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTables();
    const contentType = request.headers.get('content-type') || '';

    let title: string;
    let titleRu: string;
    let description: string | null = null;
    let genre: string | null = null;
    let duration: number | null = null;
    let fileName: string | null = null;
    let audioData: string | null = null;
    let audioMimeType: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = (formData.get('title') as string) || '';
      titleRu = (formData.get('titleRu') as string) || '';
      description = (formData.get('description') as string) || null;
      genre = (formData.get('genre') as string) || null;
      const durationStr = (formData.get('duration') as string) || '';
      duration = durationStr ? parseFloat(durationStr) : null;
      fileName = (formData.get('fileName') as string) || null;

      const file = formData.get('file') as File | null;
      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        audioData = buffer.toString('base64');
        fileName = file.name;

        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        const mimeMap: Record<string, string> = {
          '.mp3': 'audio/mpeg',
          '.wav': 'audio/wav',
          '.ogg': 'audio/ogg',
          '.aac': 'audio/aac',
          '.m4a': 'audio/mp4',
          '.webm': 'audio/webm',
        };
        audioMimeType = file.type && file.type !== 'audio/mp3' ? file.type : (mimeMap[ext] || 'audio/mpeg');
      }

      const preEncoded = formData.get('audioData') as string | null;
      if (preEncoded && !audioData) {
        audioData = preEncoded;
        audioMimeType = (formData.get('audioMimeType') as string) || null;
      }
    } else {
      const body = await request.json();
      title = body.title || '';
      titleRu = body.titleRu || '';
      description = body.description || null;
      genre = body.genre || null;
      duration = body.duration || null;
      fileName = body.fileName || null;
      audioData = body.audioData || null;
      audioMimeType = body.audioMimeType || null;
    }

    if (!title.trim() || !titleRu.trim()) {
      return NextResponse.json(
        { error: 'Title and titleRu are required' },
        { status: 400 }
      );
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
        description,
        genre,
        duration,
        fileName,
        audioData,
        audioMimeType,
        order: trackOrder,
      },
    });

    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    console.error('Track creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
