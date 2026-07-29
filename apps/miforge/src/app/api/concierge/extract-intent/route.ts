import { NextResponse } from "next/server";
import { extractIntentFromConversation } from "@/lib/agents/concierge/intent-extraction";
import { loadConciergeMessages } from "@/lib/concierge/session-manager";

export async function POST(request: Request) {
  const { session_token } = await request.json();

  if (!session_token) {
    return NextResponse.json({ error: "Session token required" }, { status: 400 });
  }

  // In placeholder mode, extract intent from localStorage messages
  // In production, this would fetch from discovery_sessions table
  const messages = loadConciergeMessages();

  if (messages.length === 0) {
    return NextResponse.json({
      confidence: 0,
      business_stage: null,
      primary_pain: null,
      secondary_pains: [],
      operational_bottlenecks: [],
      desired_outcomes: [],
      time_horizon: null,
      budget_signal: null,
      emotional_state: null,
      business_type: null,
      business_scale: null,
      existing_infrastructure: [],
    });
  }

  const intent = extractIntentFromConversation(messages);

  console.log(
    `[Concierge Intent] Session: ${session_token}, Confidence: ${intent.confidence.toFixed(2)}, Pain: ${intent.primary_pain || "unknown"}`
  );

  return NextResponse.json(intent);
}
