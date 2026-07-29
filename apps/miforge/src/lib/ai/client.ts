import { isPlaceholderMode } from "@/lib/env";
import { getAgentRouting } from "./routing";
import { trackAIUsage } from "./cost-tracker";
import { getMockResponse, streamMockResponse } from "./mock-responses";
import type { GenerateOptions, ChatMessage } from "./types";

export async function generateAgentResponse(options: GenerateOptions): Promise<{
  text: string;
  stream?: AsyncGenerator<string>;
}> {
  const { agentSlug, systemPrompt, messages, stream = false, factoryId } = options;
  const routing = getAgentRouting(agentSlug);

  // Placeholder mode — return mocked streaming response
  if (isPlaceholderMode("ai")) {
    console.log(`[AI Placeholder Mode] Simulating response for agent: ${agentSlug}`);
    const lastMessage = messages[messages.length - 1]?.content || "";
    const responseText = getMockResponse(agentSlug, lastMessage);

    if (stream) {
      return {
        text: responseText,
        stream: streamMockResponse(responseText),
      };
    }

    // Simulate latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    await trackAIUsage({
      factory_id: factoryId,
      catalog_slug: agentSlug,
      provider: "mock",
      model: "placeholder",
      input_tokens: lastMessage.length * 1.3,
      output_tokens: responseText.length * 1.3,
      estimated_cost_usd: 0,
      latency_ms: 500,
      status: "success",
    });

    return { text: responseText };
  }

  // Real mode — attempt primary, fallback on failure
  const startTime = Date.now();

  try {
    const result = await callProvider(routing.primary.provider, routing.primary.model, systemPrompt, messages, routing);

    await trackAIUsage({
      factory_id: factoryId,
      catalog_slug: agentSlug,
      provider: routing.primary.provider,
      model: routing.primary.model,
      input_tokens: result.inputTokens || 0,
      output_tokens: result.outputTokens || 0,
      estimated_cost_usd: 0,
      latency_ms: Date.now() - startTime,
      status: "success",
    });

    return { text: result.text };
  } catch (primaryError) {
    console.warn(`[AI] Primary provider failed for ${agentSlug}:`, primaryError);

    try {
      const fallbackResult = await callProvider(routing.fallback.provider, routing.fallback.model, systemPrompt, messages, routing);

      await trackAIUsage({
        factory_id: factoryId,
        catalog_slug: agentSlug,
        provider: routing.fallback.provider,
        model: routing.fallback.model,
        input_tokens: fallbackResult.inputTokens || 0,
        output_tokens: fallbackResult.outputTokens || 0,
        estimated_cost_usd: 0,
        latency_ms: Date.now() - startTime,
        status: "fallback_used",
      });

      return { text: fallbackResult.text };
    } catch (fallbackError) {
      console.error(`[AI] Fallback also failed for ${agentSlug}:`, fallbackError);

      await trackAIUsage({
        factory_id: factoryId,
        catalog_slug: agentSlug,
        provider: routing.fallback.provider,
        model: routing.fallback.model,
        input_tokens: 0,
        output_tokens: 0,
        estimated_cost_usd: 0,
        latency_ms: Date.now() - startTime,
        status: "failed",
      });

      throw new Error("All AI providers failed");
    }
  }
}

async function callProvider(
  _provider: string,
  _model: string,
  _systemPrompt: string,
  _messages: ChatMessage[],
  _routing: { temperature: number; max_tokens: number }
): Promise<{ text: string; inputTokens?: number; outputTokens?: number }> {
  // This would use the Vercel AI SDK or provider SDKs in production
  // For now, throw to trigger fallback testing
  throw new Error("Real providers not configured");
}

export async function generateStructuredOutput<T>(
  agentSlug: string,
  systemPrompt: string,
  messages: ChatMessage[],
  _schema: unknown
): Promise<T> {
  const { text } = await generateAgentResponse({
    agentSlug,
    systemPrompt,
    messages,
    stream: false,
  });

  try {
    return JSON.parse(text) as T;
  } catch {
    return { raw: text } as T;
  }
}

export async function generateEmbedding(_text: string): Promise<number[]> {
  // Stub for future semantic search
  console.log("[AI] Embedding generation is stubbed for now");
  return Array(1536).fill(0).map(() => Math.random());
}
