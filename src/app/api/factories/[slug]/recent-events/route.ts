import { NextResponse } from "next/server";
import { mockActivityEvents } from "@/lib/supabase/mocks";
import { mockFactories } from "@/lib/supabase/mocks";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const factory = mockFactories.find(f => f.slug === params.slug);
  if (!factory) return NextResponse.json({ events: [] });
  const events = mockActivityEvents.filter(e => e.factory_id === factory.id).slice(0, 5);
  return NextResponse.json({ events });
}
