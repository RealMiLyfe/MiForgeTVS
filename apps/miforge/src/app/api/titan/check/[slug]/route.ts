import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const titanUrl = process.env.TITAN_BRIDGE_URL || "http://localhost:8099";
  const token = process.env.TITAN_BRIDGE_TOKEN;

  if (!token) {
    return NextResponse.json({ titanBacked: false, reason: "no_bridge_token" });
  }

  try {
    const res = await fetch(`${titanUrl}/clients/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    });
    return NextResponse.json({ titanBacked: res.ok, slug });
  } catch {
    return NextResponse.json({ titanBacked: false, reason: "titan_unreachable" });
  }
}
