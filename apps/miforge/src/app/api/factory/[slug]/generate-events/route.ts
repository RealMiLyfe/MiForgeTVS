import { NextResponse } from "next/server";

export async function POST(_request: Request, { params }: { params: { slug: string } }) {
  // Operator-only batch generation endpoint
  console.log(`[Generate Events] Batch generation triggered for factory: ${params.slug}`);
  // In production: would call AI to generate 40-60 events and persist to DB
  return NextResponse.json({ success: true, message: "Event generation queued", count: 50 });
}
