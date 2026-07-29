import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  console.log("[Contact] New submission:", data.email, data.reason);
  return NextResponse.json({ success: true });
}
