import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
  }

  // Placeholder mode - always succeed
  return NextResponse.json({ success: true, message: "Password reset link sent" });
}
