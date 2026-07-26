import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
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
    if (body.url !== undefined) {
      updateData.url = body.url;
    }

    const [updated] = await db
      .update(services)
      .set(updateData)
      .where(eq(services.id, parseInt(id)))
      .returning();

    return NextResponse.json({ service: updated });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
