import { handleUpload } from '@vercel/blob/client';

export const runtime = 'edge';

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: 'BLOB_READ_WRITE_TOKEN not found' },
      { status: 500 }
    );
  }
  try {
    const blob = await handleUpload({ request });
    return Response.json(blob);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return Response.json({ error: message }, { status: 400 });
  }
}
