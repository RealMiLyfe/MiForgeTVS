// Mock authentication for placeholder mode
// Uses localStorage to simulate Supabase Auth

import type { User } from "@/lib/supabase/types";

const STORAGE_KEY = "milyfe_mock_session";

export interface MockSession {
  user: User;
  access_token: string;
  expires_at: number;
}

export function getMockSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const session = JSON.parse(stored) as MockSession;
    if (session.expires_at < Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setMockSession(user: User): MockSession {
  const session: MockSession = {
    user,
    access_token: `mock_token_${Date.now()}`,
    expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  return session;
}

export function clearMockSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function createMockUser(
  email: string,
  name?: string
): User {
  const isAdmin = email === "miforge@milyfe.fun";
  return {
    id: `mock-${Date.now()}`,
    email,
    full_name: name || email.split("@")[0],
    avatar_url: null,
    role: isAdmin ? "admin" : "client",
    created_at: new Date().toISOString(),
  };
}
