import { put } from '@vercel/blob';

export const runtime = 'edge';

export async function POST(request: Request) {
  const filename = request.headers.get('x-vercel-filename') || 'audio.mp3';
  const contentType = request.headers.get('content-type') || 'application/octet-stream';
  const blob = await put(filename, request.body, { access: 'public', type: contentType });
  return Response.json(blob);
}
