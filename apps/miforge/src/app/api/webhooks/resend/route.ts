import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("[Resend Webhook]", body.type || "unknown");
  // Handle: email.delivered, email.opened, email.clicked, email.bounced
  return NextResponse.json({ received: true });
}
