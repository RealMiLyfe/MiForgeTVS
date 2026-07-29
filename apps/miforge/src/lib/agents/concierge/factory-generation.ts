// Personalized factory generation from discovery intent
// In production: calls AI with structured output prompt
// In placeholder mode: generates based on intent patterns

import type { IntentProfile } from "./intent-extraction";
import { mockAgentCatalog } from "@/lib/supabase/mocks";

export interface GeneratedFactoryConfig {
  business_name: string;
  contact_name: string;
  niche: string;
  recommended_agents: string[];
  recommended_tier: "specimen" | "standard" | "sovereign";
  estimated_activation_weeks: number;
  personalization_notes: string;
  activity_event_seed_context: string;
}

export function generateFactoryFromIntent(intent: IntentProfile, conversationHint?: string): GeneratedFactoryConfig {
  const agents = selectAgentsForIntent(intent);
  const tier = determineTier(intent, agents.length);

  return {
    business_name: inferBusinessName(intent, conversationHint),
    contact_name: "Preview Operator",
    niche: intent.business_type || "General Business",
    recommended_agents: agents,
    recommended_tier: tier,
    estimated_activation_weeks: tier === "specimen" ? 4 : tier === "standard" ? 9 : 12,
    personalization_notes: generatePersonalizationNotes(intent, agents),
    activity_event_seed_context: `${intent.business_type || "Business"} focused on ${intent.primary_pain || "operational efficiency"}. ${intent.desired_outcomes?.join(", ") || "Growth and time reclamation"}.`,
  };
}

function selectAgentsForIntent(intent: IntentProfile): string[] {
  const selected: string[] = [];
  const catalogSlugs = mockAgentCatalog
    .filter((a) => a.status === "available" && a.category !== "platform")
    .map((a) => a.slug);

  // Always include ops_reporting for visibility
  if (catalogSlugs.includes("ops_reporting")) selected.push("ops_reporting");

  // Map pain points to agents
  const painText = [intent.primary_pain, ...(intent.secondary_pains || [])].join(" ").toLowerCase();
  const bottleneckText = (intent.operational_bottlenecks || []).join(" ").toLowerCase();
  const combined = painText + " " + bottleneckText;

  if (combined.includes("customer") || combined.includes("support") || combined.includes("ticket")) {
    selected.push("customer_service");
  }
  if (combined.includes("email") || combined.includes("churn") || combined.includes("retention") || combined.includes("reactivat")) {
    selected.push("email_reactivation");
  }
  if (combined.includes("content") || combined.includes("social") || combined.includes("marketing")) {
    selected.push("social_content");
  }
  if (combined.includes("seo") || combined.includes("organic") || combined.includes("search")) {
    selected.push("seo_refresh");
  }
  if (combined.includes("fulfillment") || combined.includes("shipping") || combined.includes("order")) {
    selected.push("fulfillment_monitor");
  }
  if (combined.includes("review") || combined.includes("reputation")) {
    selected.push("review_responder");
  }
  if (combined.includes("lead") || combined.includes("sales") || combined.includes("outbound")) {
    selected.push("lead_qualifier");
  }
  if (combined.includes("invoice") || combined.includes("billing") || combined.includes("finance")) {
    selected.push("invoice_processor");
  }
  if (combined.includes("recruit") || combined.includes("hiring") || combined.includes("candidate")) {
    selected.push("candidate_screener");
  }
  if (combined.includes("blog") || combined.includes("article") || combined.includes("writing")) {
    selected.push("blog_writer");
  }

  // Ensure minimum agents based on scale
  if (selected.length < 4 && intent.business_scale !== "solo") {
    const defaults = ["customer_service", "email_reactivation", "social_content", "fulfillment_monitor"];
    for (const d of defaults) {
      if (!selected.includes(d) && selected.length < 6) selected.push(d);
    }
  }

  // Cap and deduplicate
  return Array.from(new Set(selected)).filter((s) => catalogSlugs.includes(s)).slice(0, 8);
}

function determineTier(intent: IntentProfile, agentCount: number): "specimen" | "standard" | "sovereign" {
  if (intent.business_scale === "solo" || intent.time_horizon === "exploring" || agentCount <= 3) return "specimen";
  if (agentCount >= 7 || intent.budget_signal === "unconstrained") return "sovereign";
  return "standard";
}

function inferBusinessName(intent: IntentProfile, hint?: string): string {
  if (hint) {
    // Try to extract a business name from conversation
    const patterns = [/my (?:business|company|brand|store) (?:is |called |named )([A-Z][a-zA-Z\s]+)/i];
    for (const p of patterns) {
      const match = hint.match(p);
      if (match) return match[1].trim();
    }
  }
  if (intent.business_type) return `Your ${intent.business_type} Factory`;
  return "Your Preview Factory";
}

function generatePersonalizationNotes(intent: IntentProfile, agents: string[]): string {
  const parts: string[] = [];
  if (intent.primary_pain) parts.push(`Primary focus: addressing "${intent.primary_pain}"`);
  if (intent.business_type) parts.push(`Calibrated for ${intent.business_type} operations`);
  parts.push(`${agents.length} agents selected to match discovered intent`);
  if (intent.existing_infrastructure.length > 0) {
    parts.push(`Integrations: ${intent.existing_infrastructure.join(", ")}`);
  }
  return parts.join(". ") + ".";
}
