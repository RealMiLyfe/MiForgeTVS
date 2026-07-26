import { NextResponse } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allAgents = await db
      .select()
      .from(agents)
      .orderBy(asc(agents.agentNumber));

    return NextResponse.json({ agents: allAgents });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
