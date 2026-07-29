import type { AIUsageEntry } from "./types";
import { estimateCost } from "./routing";

// Logs AI usage for cost tracking
// In placeholder mode, logs to console
// In production, writes to ai_usage_logs table

export async function trackAIUsage(entry: AIUsageEntry): Promise<void> {
  const cost = estimateCost(entry.model, entry.input_tokens, entry.output_tokens);

  const logEntry = {
    ...entry,
    estimated_cost_usd: cost,
    timestamp: new Date().toISOString(),
  };

  // Always log to console in development
  console.log(
    `[AI Usage] ${entry.provider}/${entry.model} | ` +
    `${entry.input_tokens}in/${entry.output_tokens}out | ` +
    `$${cost.toFixed(6)} | ${entry.latency_ms}ms | ${entry.status}`
  );

  // In production, would write to Supabase
  // const { createAdminClient } = await import("@/lib/supabase/admin");
  // const supabase = createAdminClient();
  // await supabase.from("ai_usage_logs").insert(logEntry);

  return void logEntry;
}
