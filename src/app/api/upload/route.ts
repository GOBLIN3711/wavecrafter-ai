import { put } from '@vercel/blob';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const filename = request.headers.get('x-filename') || 'audio.mp3';
    const contentType = request.headers.get('content-type') || 'application/octet-stream';
    const body = await request.arrayBuffer();
    const blob = await put(filename, body, { access: 'public', type: contentType });
    return Response.json(blob);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return Response.json({ error: message }, { status: 400 });
  }
}
