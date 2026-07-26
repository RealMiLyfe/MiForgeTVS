import { NextResponse } from "next/server";
import { db } from "@/db";
import { phases, tasks, healthChecks, agents, workflows, services, channels, buildLogs } from "@/db/schema";
import { phasesData, agentsData, workflowsData, servicesData, channelsData } from "@/lib/milyfe-data";
import { sql } from "drizzle-orm";

export async function POST() {
  try {
    // Clear existing data
    await db.execute(sql`TRUNCATE TABLE build_logs, health_checks, tasks, workflows, agents, services, channels, phases RESTART IDENTITY CASCADE`);

    // Insert phases with tasks and health checks
    for (const phaseData of phasesData) {
      const [insertedPhase] = await db.insert(phases).values({
        phaseNumber: phaseData.phaseNumber,
        name: phaseData.name,
        target: phaseData.target,
        status: "pending",
      }).returning();

      // Insert tasks
      for (const taskData of phaseData.tasks) {
        await db.insert(tasks).values({
          phaseId: insertedPhase.id,
          taskNumber: taskData.taskNumber,
          description: taskData.description,
          status: "pending",
        });
      }

      // Insert health checks
      for (const checkData of phaseData.healthChecks) {
        await db.insert(healthChecks).values({
          phaseId: insertedPhase.id,
          checkName: checkData.checkName,
          description: checkData.description,
          status: "unknown",
        });
      }
    }

    // Insert agents
    for (const agentData of agentsData) {
      await db.insert(agents).values({
        agentNumber: agentData.agentNumber,
        name: agentData.name,
        codeName: agentData.codeName,
        role: agentData.role,
        model: agentData.model,
        mattermostBot: agentData.mattermostBot,
        tools: agentData.tools,
        hardRules: agentData.hardRules,
        status: "offline",
      });
    }

    // Insert workflows
    for (const workflowData of workflowsData) {
      await db.insert(workflows).values({
        workflowNumber: workflowData.workflowNumber,
        name: workflowData.name,
        description: workflowData.description,
        trigger: workflowData.trigger,
        status: "pending",
        isActive: false,
      });
    }

    // Insert services
    for (const serviceData of servicesData) {
      await db.insert(services).values({
        name: serviceData.name,
        port: serviceData.port,
        category: serviceData.category,
        description: serviceData.description,
        status: "unknown",
      });
    }

    // Insert channels
    for (const channelData of channelsData) {
      await db.insert(channels).values({
        name: channelData.name,
        description: channelData.description,
        category: channelData.category,
        isCreated: false,
      });
    }

    // Add initial build log
    await db.insert(buildLogs).values({
      severity: "info",
      message: "MiLyfe: Venture Titan Studio build initialized",
      source: "system",
    });

    return NextResponse.json({ success: true, message: "Database seeded with MiLyfe build specification" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
