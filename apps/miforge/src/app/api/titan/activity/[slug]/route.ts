import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const titanUrl = process.env.TITAN_BRIDGE_URL || "http://localhost:8099";
  const token = process.env.TITAN_BRIDGE_TOKEN;

  if (!token) {
    return NextResponse.json({ messages: [], source: "fallback" });
  }

  try {
    const res = await fetch(`${titanUrl}/clients/${slug}/mattermost/messages?limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const messages = await res.json();
      return NextResponse.json({ messages, source: "titan" });
    }
  } catch { /* fall through */ }

  return NextResponse.json({ messages: [], source: "fallback" });
}
