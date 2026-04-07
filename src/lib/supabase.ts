import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseHost = (() => {
  try {
    return new URL(supabaseUrl).host;
  } catch {
    return supabaseUrl;
  }
})();

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFile(bucket: string, file: File, path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    const message =
      error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    if (message.includes('aborted') || message.includes('signal is aborted')) {
      throw new Error(
        'Upload request timed out before Supabase responded. Please retry with a smaller image or check network stability.',
      );
    }
    if (message.includes('failed to fetch') || message.includes('network')) {
      throw new Error(
        `Unable to reach Supabase Storage at ${supabaseHost}. Check VITE_SUPABASE_URL and your DNS/network connection.`,
      );
    }
    throw error;
  }
}

export async function deleteFile(bucket: string, path: string) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}
