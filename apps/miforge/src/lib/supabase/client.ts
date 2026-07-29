import { isPlaceholderMode } from "@/lib/env";
import { mockQuery } from "./mocks";

// Placeholder-aware Supabase browser client
// When real credentials exist, uses @supabase/ssr; otherwise returns mock data

interface QueryBuilder {
  select: (columns?: string) => QueryBuilder;
  insert: (data: unknown) => QueryBuilder;
  update: (data: unknown) => QueryBuilder;
  delete: () => QueryBuilder;
  eq: (column: string, value: unknown) => QueryBuilder;
  neq: (column: string, value: unknown) => QueryBuilder;
  in: (column: string, values: unknown[]) => QueryBuilder;
  order: (column: string, options?: { ascending?: boolean }) => QueryBuilder;
  limit: (count: number) => QueryBuilder;
  single: () => Promise<{ data: unknown; error: null }>;
  then: (resolve: (value: { data: unknown[]; error: null }) => void) => void;
  maybeSingle: () => Promise<{ data: unknown | null; error: null }>;
}

function createMockQueryBuilder(table: string): QueryBuilder {
  const filters: Record<string, unknown> = {};

  const builder: QueryBuilder = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: (column: string, value: unknown) => {
      filters[column] = value;
      return builder;
    },
    neq: () => builder,
    in: () => builder,
    order: () => builder,
    limit: () => builder,
    single: async () => {
      const data = mockQuery(table, filters);
      return { data: Array.isArray(data) ? data[0] || null : data, error: null };
    },
    maybeSingle: async () => {
      const data = mockQuery(table, filters);
      return { data: Array.isArray(data) ? data[0] || null : data, error: null };
    },
    then: (resolve) => {
      const data = mockQuery(table, filters);
      resolve({ data: Array.isArray(data) ? data : [data], error: null });
    },
  };

  return builder;
}

export function createBrowserClient() {
  if (isPlaceholderMode("supabase")) {
    console.warn("[Supabase Placeholder Mode] Using mock data for browser client");
    return {
      from: (table: string) => createMockQueryBuilder(table),
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithOtp: async () => ({ data: {}, error: null }),
        signInWithPassword: async () => ({ data: {}, error: null }),
        signUp: async () => ({ data: {}, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    };
  }

  // Real Supabase client (lazy loaded when credentials are real)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createBrowserClient: createClient } = require("@supabase/ssr");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
