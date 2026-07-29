import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const { event_type } = await request.json();
  console.log(`[Track] Factory: ${params.slug}, Event: ${event_type}`);
  // Would call increment_prospect_engagement in production
  return NextResponse.json({ success: true });
}
