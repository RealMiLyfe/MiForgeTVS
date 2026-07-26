import { NextResponse } from "next/server";
import { db } from "@/db";
import { workflows } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allWorkflows = await db
      .select()
      .from(workflows)
      .orderBy(asc(workflows.workflowNumber));

    return NextResponse.json({ workflows: allWorkflows });
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
