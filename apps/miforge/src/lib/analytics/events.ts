// Analytics event tracking - uses PostHog in production, console in placeholder

type EventName =
  | "concierge_widget_opened"
  | "concierge_first_message"
  | "concierge_preview_generated"
  | "factory_page_visited"
  | "agent_chat_initiated"
  | "unlock_flow_started"
  | "payment_completed"
  | "bespoke_submitted"
  | "waitlist_signup"
  | "page_view";

export function trackEvent(name: EventName, properties?: Record<string, unknown>): void {
  console.log(`[Analytics] ${name}`, properties || {});
  // In production: posthog.capture(name, properties)
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  console.log(`[Analytics] Identify: ${userId}`, traits || {});
  // In production: posthog.identify(userId, traits)
}
