// Session-based rate limiter for AI chat endpoints

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (replace with Redis/Upstash in production)
const store = new Map<string, RateLimitEntry>();

const LIMITS = {
  anonymous: 30,  // 30 messages per hour
  authenticated: 100,  // 100 messages per hour
  operator: Infinity,  // unlimited
};

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function checkRateLimit(
  identifier: string,
  role: "anonymous" | "authenticated" | "operator"
): { allowed: boolean; remaining: number; resetIn: number } {
  const limit = LIMITS[role];
  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, resetIn: 0 };
  }

  const now = Date.now();
  const key = `${role}:${identifier}`;
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: limit - 1, resetIn: WINDOW_MS };
  }

  if (entry.count >= limit) {
    const resetIn = entry.resetAt - now;
    return { allowed: false, remaining: 0, resetIn };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetIn: entry.resetAt - now };
}

export function getRateLimitMessage(resetIn: number): string {
  const minutes = Math.ceil(resetIn / 60000);
  return `You've been busy. Take a breath — the agent will be here in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}
