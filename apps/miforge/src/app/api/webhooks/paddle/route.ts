import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("[Paddle Webhook]", body.event_type || "unknown event");
  // In production: verify signature, process payment events
  return NextResponse.json({ received: true });
}
