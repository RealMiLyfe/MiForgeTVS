// Intent extraction logic - analyzes conversation to build structured intent profile
// In production: calls AI with generateStructuredOutput
// In placeholder mode: returns mock based on message patterns

import type { ChatMessage } from "@/lib/supabase/types";

export interface IntentProfile {
  business_stage: string | null;
  primary_pain: string | null;
  secondary_pains: string[];
  operational_bottlenecks: string[];
  desired_outcomes: string[];
  time_horizon: string | null;
  budget_signal: string | null;
  emotional_state: string | null;
  business_type: string | null;
  business_scale: string | null;
  existing_infrastructure: string[];
  confidence: number;
}

export function extractIntentFromConversation(messages: ChatMessage[]): IntentProfile {
  const userMessages = messages.filter((m) => m.role === "user");
  const allText = userMessages.map((m) => m.content).join(" ").toLowerCase();
  const msgCount = userMessages.length;

  // Build confidence based on conversation depth
  const confidence = Math.min(1.0, msgCount * 0.12);

  // Extract signals from text patterns
  const profile: IntentProfile = {
    business_stage: detectStage(allText),
    primary_pain: detectPrimaryPain(allText),
    secondary_pains: detectSecondaryPains(allText),
    operational_bottlenecks: detectBottlenecks(allText),
    desired_outcomes: detectOutcomes(allText),
    time_horizon: detectTimeHorizon(allText),
    budget_signal: detectBudget(allText),
    emotional_state: detectEmotionalState(allText),
    business_type: detectBusinessType(allText),
    business_scale: detectScale(allText),
    existing_infrastructure: detectInfrastructure(allText),
    confidence,
  };

  return profile;
}

function detectStage(text: string): string | null {
  if (text.includes("starting") || text.includes("launching") || text.includes("new business")) return "launching";
  if (text.includes("growing") || text.includes("scaling") || text.includes("expanding")) return "growing";
  if (text.includes("stuck") || text.includes("plateaued") || text.includes("stagnant")) return "plateaued";
  if (text.includes("declining") || text.includes("losing") || text.includes("dropping")) return "declining";
  if (text.includes("selling") || text.includes("exit") || text.includes("acquisition")) return "exiting";
  return msgLength(text) > 50 ? "growing" : null;
}

function detectPrimaryPain(text: string): string | null {
  if (text.includes("overwhelm") || text.includes("too much") || text.includes("no time")) return "Founder overwhelmed by operational workload";
  if (text.includes("customer service") || text.includes("tickets") || text.includes("support")) return "Customer service consuming too much time";
  if (text.includes("content") || text.includes("social media") || text.includes("marketing")) return "Content and marketing falling behind";
  if (text.includes("email") || text.includes("reactivat") || text.includes("churn")) return "Customer retention and email engagement declining";
  if (text.includes("hire") || text.includes("staff") || text.includes("team")) return "Cannot scale without expensive hiring";
  return msgLength(text) > 100 ? "Operational bottleneck limiting growth" : null;
}

function detectSecondaryPains(text: string): string[] {
  const pains: string[] = [];
  if (text.includes("fulfillment") || text.includes("shipping")) pains.push("Fulfillment tracking issues");
  if (text.includes("report") || text.includes("analytics")) pains.push("Lack of operational visibility");
  if (text.includes("seo") || text.includes("organic")) pains.push("SEO declining without attention");
  if (text.includes("review") || text.includes("reputation")) pains.push("Review management neglected");
  return pains;
}

function detectBottlenecks(text: string): string[] {
  const bottlenecks: string[] = [];
  if (text.includes("manual") || text.includes("repetitive")) bottlenecks.push("Manual repetitive tasks");
  if (text.includes("respond") || text.includes("reply")) bottlenecks.push("Response time to customers");
  if (text.includes("schedule") || text.includes("calendar")) bottlenecks.push("Scheduling and coordination");
  if (text.includes("data") || text.includes("track")) bottlenecks.push("Data tracking and reporting");
  return bottlenecks;
}

function detectOutcomes(text: string): string[] {
  const outcomes: string[] = [];
  if (text.includes("time") || text.includes("freedom") || text.includes("reclaim")) outcomes.push("Reclaim operational time");
  if (text.includes("revenue") || text.includes("grow") || text.includes("money")) outcomes.push("Increase revenue");
  if (text.includes("scale") || text.includes("expand")) outcomes.push("Scale without proportional hiring");
  if (text.includes("sell") || text.includes("valuation") || text.includes("exit")) outcomes.push("Increase business valuation");
  return outcomes.length > 0 ? outcomes : ["Reduce operational burden"];
}

function detectTimeHorizon(text: string): string | null {
  if (text.includes("immediately") || text.includes("urgent") || text.includes("asap")) return "immediate";
  if (text.includes("weeks") || text.includes("soon")) return "weeks";
  if (text.includes("months") || text.includes("quarter")) return "months";
  if (text.includes("exploring") || text.includes("researching") || text.includes("just looking")) return "exploring";
  return null;
}

function detectBudget(text: string): string | null {
  if (text.includes("cheap") || text.includes("afford") || text.includes("tight")) return "tight";
  if (text.includes("invest") || text.includes("budget")) return "moderate";
  if (text.includes("whatever it takes") || text.includes("money isn't")) return "unconstrained";
  return "unknown";
}

function detectEmotionalState(text: string): string | null {
  if (text.includes("overwhelm") || text.includes("drowning") || text.includes("exhausted")) return "overwhelmed";
  if (text.includes("curious") || text.includes("interested") || text.includes("wondering")) return "curious";
  if (text.includes("skeptic") || text.includes("doubt") || text.includes("really work")) return "skeptical";
  if (text.includes("ready") || text.includes("let's do") || text.includes("sign me")) return "ready";
  return "curious";
}

function detectBusinessType(text: string): string | null {
  if (text.includes("ecommerce") || text.includes("shopify") || text.includes("store")) return "Ecommerce";
  if (text.includes("saas") || text.includes("software") || text.includes("subscription")) return "SaaS";
  if (text.includes("agency") || text.includes("client") || text.includes("freelance")) return "Agency / Services";
  if (text.includes("content") || text.includes("creator") || text.includes("media")) return "Content / Creator";
  if (text.includes("consult") || text.includes("coaching")) return "Consulting";
  if (text.includes("legal") || text.includes("law")) return "Legal";
  return null;
}

function detectScale(text: string): string | null {
  if (text.includes("solo") || text.includes("just me") || text.includes("one person")) return "solo";
  if (text.includes("small team") || text.includes("few people") || text.includes("2-10")) return "small_team";
  if (text.includes("team of") || text.includes("employees") || text.includes("staff")) return "small_team";
  return null;
}

function detectInfrastructure(text: string): string[] {
  const infra: string[] = [];
  if (text.includes("shopify")) infra.push("Shopify");
  if (text.includes("klaviyo")) infra.push("Klaviyo");
  if (text.includes("hubspot")) infra.push("HubSpot");
  if (text.includes("stripe")) infra.push("Stripe");
  if (text.includes("notion")) infra.push("Notion");
  if (text.includes("slack")) infra.push("Slack");
  if (text.includes("wordpress")) infra.push("WordPress");
  return infra;
}

function msgLength(text: string): number {
  return text.length;
}
