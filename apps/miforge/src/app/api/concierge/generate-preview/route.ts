import { NextResponse } from "next/server";
import { extractIntentFromConversation } from "@/lib/agents/concierge/intent-extraction";
import { generateFactoryFromIntent } from "@/lib/agents/concierge/factory-generation";
import { loadConciergeMessages } from "@/lib/concierge/session-manager";

export async function POST(request: Request) {
  const { session_token } = await request.json();

  if (!session_token) {
    return NextResponse.json({ error: "Session token required" }, { status: 400 });
  }

  console.log(`[Concierge Preview] Generating preview factory for session: ${session_token}`);

  // Extract intent from conversation
  const messages = loadConciergeMessages();
  const intent = extractIntentFromConversation(messages);

  // Generate factory configuration from intent
  const conversationText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" ");

  const config = generateFactoryFromIntent(intent, conversationText);

  // In production: create real factory record in Supabase
  // In placeholder mode: return mock data
  const previewSlug = `preview-${Date.now().toString(36)}`;

  console.log(
    `[Concierge Preview] Generated: ${config.business_name}, ${config.recommended_agents.length} agents, tier: ${config.recommended_tier}`
  );

  return NextResponse.json({
    success: true,
    factory_slug: previewSlug,
    business_name: config.business_name,
    agent_count: config.recommended_agents.length,
    tier: config.recommended_tier,
    agents: config.recommended_agents,
    activation_weeks: config.estimated_activation_weeks,
    personalization_notes: config.personalization_notes,
  });
}
