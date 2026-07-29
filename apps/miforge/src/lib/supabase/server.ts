import { isPlaceholderMode } from "@/lib/env";
import { mockQuery } from "./mocks";

// Server-side Supabase client with SSR-safe cookie handling
// Placeholder mode returns mock data

export function createServerClient() {
  if (isPlaceholderMode("supabase")) {
    console.warn("[Supabase Placeholder Mode] Using mock data for server client");
    return createMockServerClient();
  }

  // In real mode, dynamically import and use SSR client
  // This would use cookies() from next/headers
  const { createServerClient: createClient } = require("@supabase/ssr");
  const { cookies } = require("next/headers");

  const cookieStore = cookies();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

function createMockServerClient() {
  return {
    from: (table: string) => ({
      select: () => ({
        eq: (col: string, val: unknown) => ({
          single: async () => ({ data: mockQuery(table, { [col]: val })?.[0] ?? null, error: null }),
          then: (resolve: (v: unknown) => void) => resolve({ data: mockQuery(table, { [col]: val }), error: null }),
          order: () => ({
            limit: () => ({
              then: (resolve: (v: unknown) => void) => resolve({ data: mockQuery(table, { [col]: val }), error: null }),
            }),
            then: (resolve: (v: unknown) => void) => resolve({ data: mockQuery(table, { [col]: val }), error: null }),
          }),
        }),
        order: () => ({
          limit: (n: number) => ({
            then: (resolve: (v: unknown) => void) => resolve({ data: mockQuery(table, {}).slice(0, n), error: null }),
          }),
          then: (resolve: (v: unknown) => void) => resolve({ data: mockQuery(table, {}), error: null }),
        }),
        then: (resolve: (v: unknown) => void) => resolve({ data: mockQuery(table, {}), error: null }),
      }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ then: (resolve: (v: unknown) => void) => resolve({ data: null, error: null }) }) }),
      delete: () => ({ eq: () => ({ then: (resolve: (v: unknown) => void) => resolve({ data: null, error: null }) }) }),
    }),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
  };
}
