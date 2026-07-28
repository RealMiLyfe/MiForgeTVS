import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("[GoCardless Webhook]", body.events?.[0]?.action || "unknown event");
  return NextResponse.json({ received: true });
}
