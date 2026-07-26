import { NextResponse } from "next/server";
import { db } from "@/db";
import { channels } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allChannels = await db
      .select()
      .from(channels)
      .orderBy(asc(channels.name));

    return NextResponse.json({ channels: allChannels });
  } catch (error) {
    console.error("Error fetching channels:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
