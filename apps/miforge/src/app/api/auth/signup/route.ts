import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 });
  }

  // Placeholder mode - always succeed
  return NextResponse.json({
    success: true,
    user: {
      email,
      full_name: name || email.split("@")[0],
      role: email === "miforge@milyfe.fun" ? "admin" : "client",
    },
  });
}
