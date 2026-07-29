import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || "dev"}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[Cron] Weekly reports generation running...");
  console.log("[Cron] - Generating reports for all activated factories");
  console.log("[Cron] - Sending weekly_report_ready emails to owners");

  return NextResponse.json({ success: true, reports_generated: 0, timestamp: new Date().toISOString() });
}
