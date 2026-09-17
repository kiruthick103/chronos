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

  // 3. Try profiles table as last resort (wrapped safely with rapid timeout)
  try {
    const profilePromise = supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    const { data, error } = await Promise.race([
      profilePromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 500))
    ]);

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
    const isAdminUser = profile?.is_admin === true;
    console.log(`[Auth] Resolved User: ${sessionUser.email} | Is Admin: ${isAdminUser}`);
    setIsAdmin(isAdminUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    let resolved = false;

    // Fast synchronous check for demo session
    try {
      const stored = localStorage.getItem("chronolux_demo_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsAdmin(parsed.email === "kiruthick3238q@gmail.com" || parsed.user_metadata?.is_admin === true);
        setLoading(false);
        resolved = true;
      }
    } catch {}

    // Rapid safety timer: Never let the auth screen hang for more than 400ms
    const safetyTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        setLoading(false);
      }
    }, 400);

    // Resolve existing session with timeout race
    Promise.race([
      supabase.auth.getSession(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Session timeout")), 350))
    ])
      .then(({ data: { session } = {} }) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(safetyTimer);
        if (session?.user) {
          resolveUser(session.user);
        } else {
          resolveUser(null);
        }
      })
      .catch((error) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(safetyTimer);
        console.warn("[Auth] Rapid session check fallback:", error?.message);
        setLoading(false);
      });

    // Real-time auth state listener
    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          resolveUser(session.user);
        }
      });
      subscription = data?.subscription;
    } catch {}

    return () => {
      clearTimeout(safetyTimer);
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [resolveUser]);

  const loginWithDemoFallback = (role) => {
    const isAdminRole = role === "admin";
    const demoUser = isAdminRole
      ? {
          id: "admin-demo-id",
          email: "kiruthick3238q@gmail.com",
          user_metadata: { full_name: "Admin Kiruthick", is_admin: true, role: "admin" },
          created_at: new Date().toISOString()
        }
      : {
          id: "user-demo-id",
          email: "userdemo@gmail.com",
          user_metadata: { full_name: "Demo Customer", is_admin: false },
          created_at: new Date().toISOString()
        };

    try {
      localStorage.setItem("chronolux_demo_user", JSON.stringify(demoUser));
    } catch {}

    setUser(demoUser);
    setIsAdmin(isAdminRole);
    setLoading(false);
    return demoUser;
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("chronolux_demo_user");
      await supabase.auth.signOut();
    } catch (error) {
      console.warn("Sign out error:", error);
    } finally {
      setUser(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut, loginWithDemoFallback }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
