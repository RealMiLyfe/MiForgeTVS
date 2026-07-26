import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
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
      if (body.status === "online") {
        updateData.lastActive = new Date();
      }
    }
    if (body.memoryNamespace !== undefined) {
      updateData.memoryNamespace = body.memoryNamespace;
    }
    if (body.taskCount !== undefined) {
      updateData.taskCount = body.taskCount;
    }
    if (body.errorCount !== undefined) {
      updateData.errorCount = body.errorCount;
    }

    const [updated] = await db
      .update(agents)
      .set(updateData)
      .where(eq(agents.id, parseInt(id)))
      .returning();

    return NextResponse.json({ agent: updated });
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
