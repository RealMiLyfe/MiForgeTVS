import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { phases } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "in_progress" && !body.startedAt) {
        updateData.startedAt = new Date();
      }
      if (body.status === "completed" && !body.completedAt) {
        updateData.completedAt = new Date();
        updateData.healthCheckPassed = true;
      }
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }
    if (body.healthCheckPassed !== undefined) {
      updateData.healthCheckPassed = body.healthCheckPassed;
    }
    if (body.errorCount !== undefined) {
      updateData.errorCount = body.errorCount;
    }
    if (body.retryCount !== undefined) {
      updateData.retryCount = body.retryCount;
    }

    const [updated] = await db
      .update(phases)
      .set(updateData)
      .where(eq(phases.id, parseInt(id)))
      .returning();

    return NextResponse.json({ phase: updated });
  } catch (error) {
    console.error("Error updating phase:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
