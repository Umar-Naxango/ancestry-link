import { supabase } from '@/lib/supabase';

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET || 'family-media';

function fileExt(name: string) {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'jpg';
}

export async function compressImage(file: File, maxWidth = 1200, quality = 0.78): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to process image.');
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/jpeg', quality)
  );

  if (!blob) {
    throw new Error('Unable to compress image.');
  }

  return blob;
}

export async function uploadCompressedImage(
  file: File,
  ownerId: string,
  folder: 'members' | 'profiles' | 'stories' = 'members'
): Promise<string> {
  const compressed = await compressImage(file);
  const ext = fileExt(file.name);
  const path = `${ownerId}/${folder}/${Date.now()}-${crypto.randomUUID()}.${ext === 'png' ? 'jpg' : ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, compressed, {
      cacheControl: '31536000',
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

