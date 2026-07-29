import { isPlaceholderMode } from "@/lib/env";
import type { User } from "@/lib/supabase/types";

// Server-side session retrieval
export async function getSession() {
  if (isPlaceholderMode("supabase")) {
    // In placeholder mode, sessions are client-side only (localStorage)
    return null;
  }

  const { createServerClient } = await import("@/lib/supabase/server");
  const supabase = createServerClient();
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}

// Server-side user retrieval with role from users table
export async function getUser(): Promise<User | null> {
  if (isPlaceholderMode("supabase")) {
    return null;
  }

  const { createServerClient } = await import("@/lib/supabase/server");
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get full user record with role
  const { data: profile } = await supabase
    .from("users")
    .select()
    .eq("id", user.id)
    .single();

  return profile as User | null;
}
