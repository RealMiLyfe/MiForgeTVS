import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? "/dashboard";

  // In placeholder mode, just redirect to dashboard
  return NextResponse.redirect(new URL(next, request.url));
}
