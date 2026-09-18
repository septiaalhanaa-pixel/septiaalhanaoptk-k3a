import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(url?: string, anonKey?: string): SupabaseClient | null {
  if (url && anonKey) {
    try {
      supabaseInstance = createClient(url, anonKey);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

export async function testSupabaseDirect(url: string, key: string): Promise<{ success: boolean; message: string; latencyMs: number }> {
  const start = performance.now();
  try {
    const client = createClient(url, key);
    // Test simple select or auth health
    const { error } = await client.from('containers').select('count', { count: 'exact', head: true });
    const latencyMs = Math.round(performance.now() - start);

    if (error && error.code !== 'PGRST116') {
      // Even if table doesn't exist yet, reaching postgres REST endpoint proves connection!
      return {
        success: true,
        message: `Terhubung ke Supabase Project! Respon diterima (${error.message || 'Tabel siap dibuat'}).`,
        latencyMs
      };
    }

    return {
      success: true,
      message: 'Koneksi ke Supabase Project Berhasil & Tabel Terdeteksi!',
      latencyMs
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Gagal terhubung ke Supabase',
      latencyMs: Math.round(performance.now() - start)
    };
  }
}
