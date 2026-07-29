export type AIProvider = "anthropic" | "openai" | "nvidia" | "groq";

export interface ModelConfig {
  provider: AIProvider;
  model: string;
}

export interface AgentRouting {
  primary: ModelConfig;
  fallback: ModelConfig;
  temperature: number;
  max_tokens: number;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GenerateOptions {
  agentSlug: string;
  systemPrompt: string;
  messages: ChatMessage[];
  stream?: boolean;
  factoryId?: string;
}

export interface AIUsageEntry {
  factory_id?: string;
  catalog_slug?: string;
  provider: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost_usd: number;
  latency_ms: number;
  status: "success" | "fallback_used" | "failed";
}
