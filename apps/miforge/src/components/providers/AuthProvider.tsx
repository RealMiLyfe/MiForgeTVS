"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/supabase/types";
import {
  getMockSession,
  setMockSession,
  clearMockSession,
  createMockUser,
} from "@/lib/auth/mock-auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean }>;
  sendMagicLink: (email: string) => Promise<{ success: boolean }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  resetPassword: async () => ({ success: false }),
  sendMagicLink: async () => ({ success: false }),
});

export function useSession() {
  const { user, loading } = useContext(AuthContext);
  return { session: user ? { user } : null, loading };
}

export function useUser() {
  const { user, loading } = useContext(AuthContext);
  return { user, loading };
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = getMockSession();
    if (session) {
      setUser(session.user);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, _password?: string) => {
    try {
      const mockUser = createMockUser(email);
      setMockSession(mockUser);
      setUser(mockUser);
      return { success: true };
    } catch {
      return { success: false, error: "Sign in failed" };
    }
  };

  const signUp = async (email: string, _password: string, name?: string) => {
    try {
      const mockUser = createMockUser(email, name);
      setMockSession(mockUser);
      setUser(mockUser);
      return { success: true };
    } catch {
      return { success: false, error: "Sign up failed" };
    }
  };

  const signOut = async () => {
    clearMockSession();
    setUser(null);
  };

  const resetPassword = async (_email: string) => {
    return { success: true };
  };

  const sendMagicLink = async (_email: string) => {
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, resetPassword, sendMagicLink }}
    >
      {children}
    </AuthContext.Provider>
  );
}
