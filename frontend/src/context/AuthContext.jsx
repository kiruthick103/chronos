import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

/**
 * Determines admin status without querying the profiles table.
 * Uses email allowlist and user_metadata to avoid RLS recursion issues.
 */
async function fetchProfile(user) {
  if (!user) return null;

  // 1. Check admin email allowlist directly
  if (user.email === "kiruthick3238q@gmail.com") return { is_admin: true };

  // 2. Check user_metadata set at sign-up time
  if (user?.user_metadata?.is_admin === true) return { is_admin: true };
  if (user?.user_metadata?.role === "admin") return { is_admin: true };

  // 3. Try profiles table as last resort (wrapped safely)
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (!error && data) return data;
  } catch {
    // Silently ignore — fall through to default
  }

  return { is_admin: false };
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const resolveUser = useCallback(async (sessionUser) => {
    if (!sessionUser) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setUser(sessionUser);
    const profile = await fetchProfile(sessionUser);
    setIsAdmin(profile?.is_admin === true);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Resolve existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      resolveUser(session?.user ?? null);
    }).catch((error) => {
      console.warn("Failed to get session:", error);
      setLoading(false);
    });

    // Real-time auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        resolveUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [resolveUser]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn("Sign out error:", error);
    } finally {
      setUser(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
