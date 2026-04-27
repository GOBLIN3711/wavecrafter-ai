import { put } from '@vercel/blob';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'File not found' }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return Response.json({ error: 'Blob store not connected. Go to Vercel > Settings > Blob.' }, { status: 500 });
    }

    const blob = await put(file.name, file, { access: 'public' });
    return Response.json(blob);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
