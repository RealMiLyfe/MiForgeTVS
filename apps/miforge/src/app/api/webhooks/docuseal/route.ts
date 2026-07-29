import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("[DocuSeal Webhook]", body.event_type || "unknown event");
  return NextResponse.json({ received: true });
}
