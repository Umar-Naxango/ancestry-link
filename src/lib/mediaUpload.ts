import { supabase } from '@/lib/supabase';

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET || 'family-media';

function fileExt(name: string) {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'jpg';
}

/**
 * Robustly load an image from a File or Blob
 */
function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image.'));
    img.src = URL.createObjectURL(file);
  });
}

export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  try {
    const img = await loadImage(file);
    const scale = Math.min(1, maxWidth / img.width);
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available.');
    }

    // Clear background for transparent PNGs
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    ctx.drawImage(img, 0, 0, width, height);
    
    // Cleanup the object URL
    URL.revokeObjectURL(img.src);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality)
    );

    if (!blob) {
      throw new Error('Image compression failed.');
    }

    return blob;
  } catch (err) {
    console.error('Compression error:', err);
    throw err instanceof Error ? err : new Error('Unable to process image.');
  }
}

export async function uploadCompressedImage(
  file: File,
  ownerId: string,
  folder: 'members' | 'profiles' | 'stories' = 'members'
): Promise<string> {
  // 1. Compress
  const compressed = await compressImage(file);
  
  // 2. Generate Path
  const ext = 'jpg'; // We always output jpeg from canvas.toBlob
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const path = `${ownerId}/${folder}/${fileName}`;

  // 3. Upload
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, compressed, {
      cacheControl: '3600',
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (uploadError) {
    console.error('Supabase upload error:', uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  // 4. Get URL
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  
  if (!data?.publicUrl) {
    throw new Error('Failed to retrieve public URL after upload.');
  }

  return data.publicUrl;
}

