import { handleUpload } from '@vercel/blob/client';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const blob = await handleUpload({ body, request });
    return Response.json(blob);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return Response.json({ error: message }, { status: 400 });
  }
}
