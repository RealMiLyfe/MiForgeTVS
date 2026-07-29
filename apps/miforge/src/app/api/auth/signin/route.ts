import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, method } = await request.json();

  // Placeholder mode - always succeed
  if (method === "magic-link") {
    return NextResponse.json({ success: true, message: "Magic link sent" });
  }

  if (!email || !password) {
    return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 });
  }

  // In placeholder mode, always succeed
  return NextResponse.json({ success: true, user: { email, role: email === "miforge@milyfe.fun" ? "admin" : "client" } });
}
