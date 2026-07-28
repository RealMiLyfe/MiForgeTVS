import { isPlaceholderMode } from "@/lib/env";

// Service role client for server-only admin operations
// Never expose this to the browser

export function createAdminClient() {
  if (isPlaceholderMode("supabase")) {
    console.warn("[Supabase Placeholder Mode] Admin client using mock data");
    return {
      from: () => ({
        select: () => ({ then: (r: (v: unknown) => void) => r({ data: [], error: null }) }),
        insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ then: (r: (v: unknown) => void) => r({ data: null, error: null }) }) }),
        delete: () => ({ eq: () => ({ then: (r: (v: unknown) => void) => r({ data: null, error: null }) }) }),
      }),
      auth: {
        admin: {
          listUsers: async () => ({ data: { users: [] }, error: null }),
          getUserById: async () => ({ data: { user: null }, error: null }),
          updateUserById: async () => ({ data: { user: null }, error: null }),
        },
      },
    };
  }

  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
