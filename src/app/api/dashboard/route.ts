import { NextResponse } from "next/server";
import { db } from "@/db";
import { phases, tasks, healthChecks, agents, workflows, services, buildLogs } from "@/db/schema";
import { count, eq, sql, desc } from "drizzle-orm";

export async function GET() {
  try {
    // Phase stats
    const phaseStats = await db
      .select({
        status: phases.status,
        count: count(),
      })
      .from(phases)
      .groupBy(phases.status);

    // Task stats
    const taskStats = await db
      .select({
        status: tasks.status,
        count: count(),
      })
      .from(tasks)
      .groupBy(tasks.status);

    // Health check stats
    const healthStats = await db
      .select({
        status: healthChecks.status,
        count: count(),
      })
      .from(healthChecks)
      .groupBy(healthChecks.status);

    // Agent stats
    const agentStats = await db
      .select({
        status: agents.status,
        count: count(),
      })
      .from(agents)
      .groupBy(agents.status);

    // Workflow stats
    const workflowStats = await db
      .select({
        isActive: workflows.isActive,
        count: count(),
      })
      .from(workflows)
      .groupBy(workflows.isActive);

    // Service stats
    const serviceStats = await db
      .select({
        status: services.status,
        count: count(),
      })
      .from(services)
      .groupBy(services.status);

    // Recent logs
    const recentLogs = await db
      .select()
      .from(buildLogs)
      .orderBy(desc(buildLogs.createdAt))
      .limit(10);

    // Total counts
    const totalPhases = await db.select({ count: count() }).from(phases);
    const totalTasks = await db.select({ count: count() }).from(tasks);
    const totalAgents = await db.select({ count: count() }).from(agents);
    const totalWorkflows = await db.select({ count: count() }).from(workflows);
    const totalServices = await db.select({ count: count() }).from(services);

    // Calculate overall progress
    const completedPhases = phaseStats.find(p => p.status === "completed")?.count || 0;
    const completedTasks = taskStats.find(t => t.status === "completed")?.count || 0;
    const healthyChecks = healthStats.find(h => h.status === "healthy")?.count || 0;
    const onlineAgents = agentStats.find(a => a.status === "online")?.count || 0;
    const activeWorkflows = workflowStats.find(w => w.isActive === true)?.count || 0;
    const healthyServices = serviceStats.find(s => s.status === "healthy")?.count || 0;

    return NextResponse.json({
      overview: {
        phases: {
          total: totalPhases[0]?.count || 0,
          completed: completedPhases,
          progress: totalPhases[0]?.count ? Math.round((completedPhases / totalPhases[0].count) * 100) : 0,
        },
        tasks: {
          total: totalTasks[0]?.count || 0,
          completed: completedTasks,
          progress: totalTasks[0]?.count ? Math.round((completedTasks / totalTasks[0].count) * 100) : 0,
        },
        agents: {
          total: totalAgents[0]?.count || 0,
          online: onlineAgents,
        },
        workflows: {
          total: totalWorkflows[0]?.count || 0,
          active: activeWorkflows,
        },
        services: {
          total: totalServices[0]?.count || 0,
          healthy: healthyServices,
        },
      },
      phaseStats: phaseStats.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      taskStats: taskStats.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      healthStats: healthStats.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      agentStats: agentStats.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      recentLogs,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
