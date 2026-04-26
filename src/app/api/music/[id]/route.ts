import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const track = await db.track.findUnique({
      where: { id, isActive: true },
      select: {
        audioData: true,
        audioMimeType: true,
        fileName: true,
      },
    });

    if (!track || !track.audioData) {
      return NextResponse.json({ error: 'Track not found or has no audio' }, { status: 404 });
    }

    const audioBuffer = Buffer.from(track.audioData, 'base64');
    const fileSize = audioBuffer.length;
    const contentType = track.audioMimeType || 'audio/mpeg';

    // Handle Range requests for seeking
    const rangeHeader = request.headers.get('range');

    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        return new NextResponse(audioBuffer.slice(start, end + 1), {
          status: 206,
          headers: {
            'Content-Type': contentType,
            'Content-Length': chunkSize.toString(),
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'public, max-age=86400',
          },
        });
      }
    }

    // Full file response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileSize.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Music serve error:', error);
    return NextResponse.json({ error: 'Failed to serve audio' }, { status: 500 });
  }
}
