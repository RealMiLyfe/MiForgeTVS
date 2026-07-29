import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  // In placeholder mode, return mock session data
  // In production: fetch from discovery_sessions table
  console.log(`[Concierge Session] Fetching session: ${token}`);

  return NextResponse.json({
    id: token,
    session_token: token,
    status: "active",
    messages: [],
    extracted_intent: {},
    intent_confidence: 0,
    created_at: new Date().toISOString(),
    last_message_at: new Date().toISOString(),
  });
}
