import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';
const supabaseAnonKey = typeof rawKey === 'string' ? rawKey.trim() : '';

let supabaseInstance;
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Running in local-fallback mode.");
    supabaseInstance = createClient(
      supabaseUrl || "https://placeholder-project.supabase.co",
      supabaseAnonKey || "placeholder-anon-key"
    );
  } else {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (err) {
  console.error("Failed to initialize Supabase client:", err.message);
  supabaseInstance = createClient("https://placeholder-project.supabase.co", "placeholder-anon-key");
}

export const supabase = supabaseInstance;
