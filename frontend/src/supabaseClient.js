import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
