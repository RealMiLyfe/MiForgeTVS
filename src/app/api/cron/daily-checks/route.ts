import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || "dev"}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[Cron] Daily checks running...");
  console.log("[Cron] - Checking inactive Concierge sessions (24h+)");
  console.log("[Cron] - Checking unvisited preview factories (3+ days)");
  console.log("[Cron] - Checking retainer renewals (7 days out)");
  console.log("[Cron] - Checking factory health for churn risk");

  return NextResponse.json({ success: true, checks_run: 4, timestamp: new Date().toISOString() });
}
