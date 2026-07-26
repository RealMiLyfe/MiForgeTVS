import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { workflows } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: Record<string, unknown> = {};

    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }
    if (body.lastRun !== undefined) {
      updateData.lastRun = body.lastRun;
    }
    if (body.nextRun !== undefined) {
      updateData.nextRun = body.nextRun;
    }
    if (body.runCount !== undefined) {
      updateData.runCount = body.runCount;
    }
    if (body.errorCount !== undefined) {
      updateData.errorCount = body.errorCount;
    }

    const [updated] = await db
      .update(workflows)
      .set(updateData)
      .where(eq(workflows.id, parseInt(id)))
      .returning();

    return NextResponse.json({ workflow: updated });
  } catch (error) {
    console.error("Error updating workflow:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
