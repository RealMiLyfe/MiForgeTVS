import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { description } = await request.json();

  // Mock AI-generated preview
  const capabilities = [
    "Monitor and respond to inbound messages in real-time",
    "Qualify leads based on conversation signals and criteria you define",
    "Schedule meetings and follow up on no-shows automatically",
    "Generate weekly performance reports with engagement metrics",
    "Escalate complex requests to human operators",
  ].slice(0, 3 + Math.floor(Math.random() * 3));

  const integrations = description.toLowerCase().includes("shopify")
    ? ["Shopify", "Klaviyo", "Slack"]
    : description.toLowerCase().includes("instagram")
    ? ["Instagram", "Calendly", "Slack"]
    : ["Email", "Slack", "Custom API"];

  const preview = {
    agent_name: `Custom ${description.split(" ").slice(0, 3).join(" ")} Agent`,
    capabilities,
    integrations,
    timeline_weeks: "2-4 weeks",
    recommended_tier: description.length > 100 ? "Standard" : "Specimen",
    estimated_forge_fee_low: 6000 + Math.floor(Math.random() * 4000),
    estimated_forge_fee_high: 12000 + Math.floor(Math.random() * 6000),
  };

  // Simulate AI latency
  await new Promise((r) => setTimeout(r, 800));

  return NextResponse.json(preview);
}
