import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/mp4',
  'audio/x-m4a',
  'audio/webm',
  'audio/mp3',
];

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|aac|m4a|webm)$/i)) {
      return NextResponse.json(
        { error: 'Invalid file type. Accepted: mp3, wav, ogg, aac, m4a, webm' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: 'File is empty' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const audioData = buffer.toString('base64');

    // Determine MIME type
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.aac': 'audio/aac',
      '.m4a': 'audio/mp4',
      '.webm': 'audio/webm',
    };
    const mimeType = file.type && file.type !== 'audio/mp3' ? file.type : (mimeMap[ext] || 'audio/mpeg');

    return NextResponse.json({
      audioData,
      audioMimeType: mimeType,
      originalName: file.name,
      size: file.size,
    }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
