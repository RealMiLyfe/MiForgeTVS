import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
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
      if (body.status === "in_progress" && !body.startedAt) {
        updateData.startedAt = new Date();
      }
      if (body.status === "completed" && !body.completedAt) {
        updateData.completedAt = new Date();
      }
    }
    if (body.output !== undefined) {
      updateData.output = body.output;
    }
    if (body.errorMessage !== undefined) {
      updateData.errorMessage = body.errorMessage;
    }

    const [updated] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, parseInt(id)))
      .returning();

    return NextResponse.json({ task: updated });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
