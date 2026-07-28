import { NextResponse } from "next/server";
import { mockFactories, mockAgentCatalog } from "@/lib/supabase/mocks";

const eventTemplates = [
  { slug: "customer_service", texts: ["Resolved ticket #{n}", "Responded to {n} customer inquiries", "Escalated 1 VIP issue to human review", "Processed return request #{n}"] },
  { slug: "email_reactivation", texts: ["Sent {n} win-back emails", "Campaign open rate: {p}%", "A/B test complete: Variant B wins", "Drafted reactivation sequence for segment"] },
  { slug: "social_content", texts: ["Published {n} posts to TikTok", "Scheduled {n} posts for this week", "Generated {n} caption variants", "Engagement up {p}% this hour"] },
  { slug: "seo_refresh", texts: ["Optimized {n} product pages", "Updated meta descriptions for {n} pages", "Keyword position improved by {p} spots", "Content audit flagged {n} issues"] },
  { slug: "fulfillment_monitor", texts: ["Tracked {n} shipments", "Flagged {n} delayed orders", "Notified {n} customers of delay", "All orders on track"] },
  { slug: "ops_reporting", texts: ["Generated daily summary", "Revenue up {p}% week-over-week", "Anomaly detected: cart abandonment spike", "Weekly report ready for review"] },
  { slug: "review_responder", texts: ["Responded to {n} reviews", "Drafted response to 1-star review", "Thanked {n} 5-star reviewers", "Sentiment analysis: {p}% positive"] },
];

export async function POST(_request: Request, { params }: { params: { slug: string } }) {
  const factory = mockFactories.find((f) => f.slug === params.slug);
  if (!factory) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const factoryAgentSlugs = mockAgentCatalog.filter((a) => a.starter).map((a) => a.slug);
  const available = eventTemplates.filter((t) => factoryAgentSlugs.includes(t.slug));
  const template = available[Math.floor(Math.random() * available.length)];
  const text = template.texts[Math.floor(Math.random() * template.texts.length)]
    .replace("{n}", String(Math.floor(Math.random() * 40) + 1))
    .replace("{p}", String(Math.floor(Math.random() * 30) + 3));

  const types = ["action", "action", "action", "action", "handoff", "milestone", "alert"];

  const event = {
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    factory_id: factory.id,
    catalog_slug: template.slug,
    event_text: text,
    event_type: types[Math.floor(Math.random() * types.length)],
    metadata: {},
    created_at: new Date().toISOString(),
  };

  return NextResponse.json(event);
}
