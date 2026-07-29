import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  console.log("[Activation] Create:", data.factory_id);
  return NextResponse.json({ success: true, activation_id: `act-${Date.now()}` });
}
