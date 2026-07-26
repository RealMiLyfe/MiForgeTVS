import { NextResponse } from "next/server";
import { db } from "@/db";
import { phases, tasks, healthChecks } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const allPhases = await db
      .select()
      .from(phases)
      .orderBy(asc(phases.phaseNumber));

    const phasesWithDetails = await Promise.all(
      allPhases.map(async (phase) => {
        const phaseTasks = await db
          .select()
          .from(tasks)
          .where(eq(tasks.phaseId, phase.id))
          .orderBy(asc(tasks.taskNumber));

        const phaseHealthChecks = await db
          .select()
          .from(healthChecks)
          .where(eq(healthChecks.phaseId, phase.id));

        const completedTasks = phaseTasks.filter((t) => t.status === "completed").length;
        const passedChecks = phaseHealthChecks.filter((h) => h.status === "healthy").length;

        return {
          ...phase,
          tasks: phaseTasks,
          healthChecks: phaseHealthChecks,
          progress: {
            tasks: { completed: completedTasks, total: phaseTasks.length },
            healthChecks: { passed: passedChecks, total: phaseHealthChecks.length },
          },
        };
      })
    );

    return NextResponse.json({ phases: phasesWithDetails });
  } catch (error) {
    console.error("Error fetching phases:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
