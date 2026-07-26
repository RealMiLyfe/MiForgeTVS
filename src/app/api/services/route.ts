import { NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allServices = await db
      .select()
      .from(services)
      .orderBy(asc(services.port));

    return NextResponse.json({ services: allServices });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
