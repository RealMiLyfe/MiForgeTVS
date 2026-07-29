// Agent interconnection rules - defines which agents connect to which

const CONNECTION_RULES: [string, string][] = [
  ["customer_service", "fulfillment_monitor"],
  ["customer_service", "ops_reporting"],
  ["customer_service", "review_responder"],
  ["email_reactivation", "social_content"],
  ["email_reactivation", "ops_reporting"],
  ["seo_refresh", "social_content"],
  ["fulfillment_monitor", "ops_reporting"],
  ["social_content", "ops_reporting"],
  ["review_responder", "ops_reporting"],
];

export interface Connection {
  from: string;
  to: string;
}

export function getConnections(activeSlugs: string[]): Connection[] {
  const set = new Set(activeSlugs);
  return CONNECTION_RULES
    .filter(([a, b]) => set.has(a) && set.has(b))
    .map(([from, to]) => ({ from, to }));
}
