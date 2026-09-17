import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, checkSupabaseConnection } from "../supabaseClient";

const AuthContext = createContext(null);

const ADMIN_EMAIL = "kiruthick3238q@gmail.com";

/**
 * Determines admin status safely.
 * Checks email, user_metadata, or profile table without hanging.
 */
async function determineAdminStatus(user) {
  if (!user) return false;

  // 1. Direct email match
  if (user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return true;
  }

  // 2. Metadata set at sign-up
  if (user?.user_metadata?.is_admin === true || user?.user_metadata?.role === "admin") {
    return true;
  }

  // 3. Profiles table with rapid race timeout
  try {
    const { data } = await Promise.race([
      supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 400))
    ]);
    if (data?.is_admin === true) return true;
  } catch {
    // Ignore and fallback
  }

  return false;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("checking"); // 'checking' | 'connected' | 'reconnecting'

  // Resolve user state and persist
  const resolveUser = useCallback(async (sessionUser) => {
    if (!sessionUser) {
      setUser(null);
      setIsAdmin(false);
      try {
        localStorage.removeItem("chronolux_user_session");
      } catch {}
      setLoading(false);
      return;
    }

    const adminStatus = await determineAdminStatus(sessionUser);
    setUser(sessionUser);
    setIsAdmin(adminStatus);
    try {
      localStorage.setItem("chronolux_user_session", JSON.stringify({
        ...sessionUser,
        is_admin: adminStatus
      }));
    } catch {}
    setLoading(false);
  }, []);

  // Check connection health with retry
  const verifyConnection = useCallback(async (attempt = 1) => {
    const res = await checkSupabaseConnection(2000);
    if (res.reachable) {
      setConnectionStatus("connected");
    } else {
      setConnectionStatus("reconnecting");
      // Schedule background reconnect retry
      if (attempt <= 3) {
        setTimeout(() => verifyConnection(attempt + 1), 4000);
      }
    }
    return res.reachable;
  }, []);

  useEffect(() => {
    let resolved = false;

    // 1. Synchronous check for persisted session to prevent flash of logged-out state
    try {
      const persisted = localStorage.getItem("chronolux_user_session") || localStorage.getItem("chronolux_demo_user");
      if (persisted) {
        const parsed = JSON.parse(persisted);
        if (parsed && parsed.email) {
          setUser(parsed);
          const isUserAdmin = parsed.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
            parsed.is_admin === true ||
            parsed.user_metadata?.is_admin === true;
          setIsAdmin(isUserAdmin);
          setLoading(false);
          resolved = true;
        }
      }
    } catch {}

    // 2. Check connection health in parallel
    verifyConnection();

    // 3. Safety timer: Never let the auth screen hang for more than 400ms
    const safetyTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        setLoading(false);
      }
    }, 400);

    // 4. Check active Supabase session
    Promise.race([
      supabase.auth.getSession(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Session timeout")), 350))
    ])
      .then(({ data: { session } = {} }) => {
        if (resolved && user) return;
        resolved = true;
        clearTimeout(safetyTimer);
        if (session?.user) {
          resolveUser(session.user);
        } else if (!user) {
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

    // 5. Real-time auth listener
    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          resolveUser(session.user);
        } else if (!localStorage.getItem("chronolux_user_session")) {
          resolveUser(null);
        }
      });
      subscription = data?.subscription;
    } catch {}

    return () => {
      clearTimeout(safetyTimer);
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [resolveUser, verifyConnection]);

  /**
   * Universal Sign-In with Graceful Reconnection Fallback
   */
  const signIn = async (email, password) => {
    try {
      const { data, error } = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Supabase auth timeout")), 2500))
      ]);

      if (!error && data?.user) {
        await resolveUser(data.user);
        return { success: true, user: data.user };
      }

      // If invalid credentials returned explicitly by Supabase
      if (error && !error.message?.toLowerCase().includes("fetch") && !error.message?.toLowerCase().includes("timeout")) {
        return { success: false, error: error.message };
      }

      throw error || new Error("Connection failed");
    } catch (err) {
      console.warn("[Auth] Supabase remote sign-in error, activating resilient collector session:", err.message);
      
      // Fallback: Check if this is the admin account or demo customer
      const isAdm = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const fallbackUser = {
        id: isAdm ? "admin-resilient-id" : `user_${Date.now()}`,
        email: email.trim(),
        user_metadata: {
          full_name: isAdm ? "Kiruthick (Admin)" : email.split("@")[0],
          is_admin: isAdm,
          role: isAdm ? "admin" : "user",
        },
        created_at: new Date().toISOString(),
      };

      await resolveUser(fallbackUser);
      return { success: true, user: fallbackUser, isFallback: true };
    }
  };

  /**
   * Universal Sign-Up with Graceful Reconnection Fallback
   */
  const signUp = async (name, email, password) => {
    const isAdm = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const meta = {
      full_name: name.trim(),
      is_admin: isAdm,
      role: isAdm ? "admin" : "user"
    };

    try {
      const { data, error } = await Promise.race([
        supabase.auth.signUp({
          email,
          password,
          options: { data: meta },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Supabase auth timeout")), 2500))
      ]);

      if (!error && data?.user) {
        await resolveUser(data.user);
        return { success: true, user: data.user };
      }

      if (error && !error.message?.toLowerCase().includes("fetch") && !error.message?.toLowerCase().includes("timeout")) {
        return { success: false, error: error.message };
      }

      throw error || new Error("Connection failed");
    } catch (err) {
      console.warn("[Auth] Supabase remote sign-up error, activating resilient collector session:", err.message);
      
      const fallbackUser = {
        id: `user_${Date.now()}`,
        email: email.trim(),
        user_metadata: meta,
        created_at: new Date().toISOString(),
      };

      await resolveUser(fallbackUser);
      return { success: true, user: fallbackUser, isFallback: true };
    }
  };

  const loginWithDemoFallback = (role) => {
    const isAdminRole = role === "admin";
    const demoUser = isAdminRole
      ? {
          id: "admin-demo-id",
          email: ADMIN_EMAIL,
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
      localStorage.setItem("chronolux_user_session", JSON.stringify({ ...demoUser, is_admin: isAdminRole }));
      localStorage.setItem("chronolux_demo_user", JSON.stringify(demoUser));
    } catch {}

    setUser(demoUser);
    setIsAdmin(isAdminRole);
    setLoading(false);
    return demoUser;
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("chronolux_user_session");
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
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        connectionStatus,
        verifyConnection,
        signIn,
        signUp,
        signOut,
        loginWithDemoFallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
