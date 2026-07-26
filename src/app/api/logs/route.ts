import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { buildLogs, phases, tasks } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");

    const logs = await db
      .select({
        id: buildLogs.id,
        phaseId: buildLogs.phaseId,
        taskId: buildLogs.taskId,
        severity: buildLogs.severity,
        message: buildLogs.message,
        details: buildLogs.details,
        source: buildLogs.source,
        createdAt: buildLogs.createdAt,
      })
      .from(buildLogs)
      .orderBy(desc(buildLogs.createdAt))
      .limit(limit);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const [inserted] = await db.insert(buildLogs).values({
      phaseId: body.phaseId || null,
      taskId: body.taskId || null,
      severity: body.severity || "info",
      message: body.message,
      details: body.details || null,
      source: body.source || "manual",
    }).returning();

    return NextResponse.json({ log: inserted });
  } catch (error) {
    console.error("Error creating log:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
