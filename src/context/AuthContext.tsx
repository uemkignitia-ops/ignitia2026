import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";

interface AuthContextType {
  currentUser: { email: string | null; uid: string } | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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

    if (!isSupabaseEnabled || !supabase) {
      throw new Error("Supabase is not initialized. Cannot perform admin login.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      setCurrentUser({ email: data.user.email ?? null, uid: data.user.id });
    }
  };

  const logout = async () => {
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

  const value = {
    currentUser,
    loading,
    login,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
