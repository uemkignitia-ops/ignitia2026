import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";

interface AuthContextType {
  currentUser: { email: string | null; uid: string } | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  registerAdmin: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<{ email: string | null; uid: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Check persistent session on mount
  useEffect(() => {
    // Check local storage session first (for offline/initial credential sessions)
    const isMockSession = localStorage.getItem("ignitia_admin_session") === "true";
    if (isMockSession) {
      setCurrentUser({ email: "uemk.ignitia@gmail.com", uid: "admin-fallback" });
      setLoading(false);
      return;
    }

    if (!isSupabaseEnabled || !supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user && session.user.email === "uemk.ignitia@gmail.com") {
        setCurrentUser({ email: session.user.email ?? null, uid: session.user.id });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user && session.user.email === "uemk.ignitia@gmail.com") {
        setCurrentUser({ email: session.user.email ?? null, uid: session.user.id });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    // Restrict access ONLY to the admin email address
    if (email !== "uemk.ignitia@gmail.com") {
      throw new Error("Access Denied: Only the official admin email can access this dashboard.");
    }

    // For local testing: force mock login without attempting to hit Supabase.
    if (pass === "WueN69emGDPhu.Q") {
      localStorage.setItem("ignitia_admin_session", "true");
      setCurrentUser({ email, uid: "admin-fallback" });
    } else {
      throw new Error("Invalid admin password.");
    }
  };

  const logout = async () => {
    localStorage.removeItem("ignitia_admin_session");
    if (isSupabaseEnabled && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseEnabled && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } else {
      throw new Error("Supabase authentication is not enabled. Cannot send reset email.");
    }
  };

  const registerAdmin = async (email: string, pass: string) => {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
      });
      if (error) throw error;
      if (data.user) {
        setCurrentUser({ email: data.user.email ?? email, uid: data.user.id });
      }
    } else {
      throw new Error("Supabase is not initialized. Cannot register new admins.");
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    resetPassword,
    registerAdmin,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
