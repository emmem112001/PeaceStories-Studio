import { supabase } from './supabase';

export async function uploadToSupabaseStorage(
  bucket: string,
  path: string,
  file: Buffer | Blob,
  contentType: string
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: false,
      });

    if (error) throw error;

    return data.path;
  } catch (error: any) {
    console.error('Upload error:', error.message);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

export async function getPublicURL(
  bucket: string,
  path: string
): Promise<string> {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function deleteFromSupabaseStorage(
  bucket: string,
  path: string
) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error: any) {
    console.error('Delete error:', error.message);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}
