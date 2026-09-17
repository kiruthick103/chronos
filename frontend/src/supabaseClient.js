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
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
} catch (err) {
  console.error("Failed to initialize Supabase client:", err.message);
  supabaseInstance = createClient("https://placeholder-project.supabase.co", "placeholder-anon-key");
}

/**
 * Gracefully checks if Supabase is reachable.
 * Returns { reachable: boolean, status: string } without throwing errors.
 */
export async function checkSupabaseConnection(timeoutMs = 1500) {
  if (!supabaseUrl || supabaseUrl.includes("placeholder-project")) {
    return { reachable: false, status: "unconfigured" };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: "GET",
      headers: {
        apikey: supabaseAnonKey,
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok || res.status === 200 || res.status === 401) {
      return { reachable: true, status: "online" };
    }
    return { reachable: false, status: `http_${res.status}` };
  } catch (err) {
    return { reachable: false, status: err.name === "AbortError" ? "timeout" : "network_error" };
  }
}

export const supabase = supabaseInstance;
