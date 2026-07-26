import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { healthChecks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: Record<string, unknown> = {
      lastChecked: new Date(),
    };

    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    if (body.message !== undefined) {
      updateData.message = body.message;
    }

    const [updated] = await db
      .update(healthChecks)
      .set(updateData)
      .where(eq(healthChecks.id, parseInt(id)))
      .returning();

    return NextResponse.json({ healthCheck: updated });
  } catch (error) {
    console.error("Error updating health check:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
