import type { AgentRouting } from "./types";

// Agent slug → preferred provider + model + fallback chain
const routingConfig: Record<string, AgentRouting> = {
  forge_concierge: {
    primary: { provider: "anthropic", model: "claude-3-5-sonnet-latest" },
    fallback: { provider: "anthropic", model: "claude-3-5-haiku-latest" },
    temperature: 0.7,
    max_tokens: 1500,
  },
  customer_service: {
    primary: { provider: "anthropic", model: "claude-3-5-haiku-latest" },
    fallback: { provider: "nvidia", model: "meta/llama-3.3-70b-instruct" },
    temperature: 0.7,
    max_tokens: 1024,
  },
  email_reactivation: {
    primary: { provider: "anthropic", model: "claude-3-5-haiku-latest" },
    fallback: { provider: "nvidia", model: "nvidia/llama-3.1-nemotron-70b-instruct" },
    temperature: 0.8,
    max_tokens: 2048,
  },
  social_content: {
    primary: { provider: "nvidia", model: "nvidia/llama-3.1-nemotron-70b-instruct" },
    fallback: { provider: "anthropic", model: "claude-3-5-haiku-latest" },
    temperature: 0.9,
    max_tokens: 1536,
  },
  seo_refresh: {
    primary: { provider: "anthropic", model: "claude-3-5-haiku-latest" },
    fallback: { provider: "nvidia", model: "meta/llama-3.3-70b-instruct" },
    temperature: 0.6,
    max_tokens: 2048,
  },
  fulfillment_monitor: {
    primary: { provider: "nvidia", model: "meta/llama-3.3-70b-instruct" },
    fallback: { provider: "openai", model: "gpt-4o-mini" },
    temperature: 0.4,
    max_tokens: 1024,
  },
  ops_reporting: {
    primary: { provider: "anthropic", model: "claude-3-5-haiku-latest" },
    fallback: { provider: "nvidia", model: "meta/llama-3.3-70b-instruct" },
    temperature: 0.5,
    max_tokens: 2048,
  },
  bespoke_scoping: {
    primary: { provider: "nvidia", model: "nvidia/llama-3.1-nemotron-70b-instruct" },
    fallback: { provider: "anthropic", model: "claude-3-5-haiku-latest" },
    temperature: 0.7,
    max_tokens: 3000,
  },
  activity_feed: {
    primary: { provider: "nvidia", model: "meta/llama-3.3-70b-instruct" },
    fallback: { provider: "groq", model: "llama-3.1-8b-instant" },
    temperature: 0.8,
    max_tokens: 512,
  },
};

// Default routing for any agent not explicitly configured
const defaultRouting: AgentRouting = {
  primary: { provider: "nvidia", model: "meta/llama-3.3-70b-instruct" },
  fallback: { provider: "openai", model: "gpt-4o-mini" },
  temperature: 0.7,
  max_tokens: 1024,
};

export function getAgentRouting(agentSlug: string): AgentRouting {
  return routingConfig[agentSlug] || defaultRouting;
}

// Cost per 1M tokens (USD)
export const PROVIDER_COSTS: Record<string, { input: number; output: number }> = {
  "claude-3-5-haiku-latest": { input: 0.80, output: 4.00 },
  "gpt-4o-mini": { input: 0.15, output: 0.60 },
  "nvidia/llama-3.1-nemotron-70b-instruct": { input: 0, output: 0 },
  "meta/llama-3.3-70b-instruct": { input: 0, output: 0 },
  "llama-3.1-8b-instant": { input: 0.05, output: 0.10 },
};

export function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const costs = PROVIDER_COSTS[model] || { input: 0, output: 0 };
  return (inputTokens * costs.input + outputTokens * costs.output) / 1_000_000;
}
