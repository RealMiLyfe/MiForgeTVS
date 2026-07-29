// Generated TypeScript types from MiLyfe database schema

export type UserRole = "client" | "operator" | "admin";
export type FactoryStatus = "demo" | "checkout" | "activated" | "paused";
export type AgentCategory = "ecommerce_ops" | "sales_growth" | "content" | "client_services" | "finance_ops" | "recruitment" | "bespoke" | "platform";
export type AgentStatus = "available" | "beta" | "coming_soon" | "bespoke_only" | "platform_only";
export type FactoryAgentStatus = "demo" | "active" | "paused";
export type PaymentProvider = "paddle" | "gocardless";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type ActivationTier = "specimen" | "standard" | "sovereign";
export type EventType = "action" | "handoff" | "milestone" | "alert";
export type BespokeStatus = "submitted" | "reviewing" | "scoping" | "quoted" | "won" | "lost";
export type WaitlistStatus = "waiting" | "invited" | "converted" | "passed";
export type NotificationType = "new_prospect" | "bespoke_request" | "payment" | "churn_risk" | "waitlist";
export type AILogStatus = "success" | "fallback_used" | "failed";

// ============================================
// ROW TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Factory {
  id: string;
  factory_number: number;
  slug: string;
  owner_user_id: string | null;
  business_name: string;
  contact_name: string;
  contact_email: string | null;
  niche: string | null;
  lifetime_revenue: number | null;
  margin: number | null;
  customer_count: number | null;
  broker_valuation_low: number | null;
  broker_valuation_high: number | null;
  platforms: string[] | null;
  custom_notes: string | null;
  brand_voice_sample: string | null;
  status: FactoryStatus;
  product: string;
  is_specimen: boolean;
  health_score: number;
  created_at: string;
  activated_at: string | null;
}

export interface AgentCatalogEntry {
  id: string;
  slug: string;
  name: string;
  category: AgentCategory;
  description: string | null;
  capabilities: string[] | null;
  ideal_for: string[] | null;
  starter: boolean;
  status: AgentStatus;
  icon_name: string | null;
  model_config: Record<string, unknown>;
  display_order: number | null;
  created_at: string;
}

export interface FactoryAgent {
  id: string;
  factory_id: string;
  catalog_slug: string;
  status: FactoryAgentStatus;
  custom_config: Record<string, unknown>;
  activated_at: string | null;
  created_at: string;
}

export interface ChatSession {
  id: string;
  factory_id: string;
  catalog_slug: string;
  session_token: string | null;
  messages: ChatMessage[];
  created_at: string;
  last_message_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface Activation {
  id: string;
  factory_id: string;
  tier: ActivationTier | null;
  payment_provider: PaymentProvider | null;
  payment_status: PaymentStatus | null;
  payment_reference: string | null;
  contract_signed: boolean;
  contract_url: string | null;
  access_handoff_complete: boolean;
  forge_fee: number | null;
  monthly_retainer: number | null;
  uplift_share_percent: number | null;
  scheduled_call_at: string | null;
  created_at: string;
}

export interface ActivityEvent {
  id: string;
  factory_id: string;
  catalog_slug: string;
  event_text: string;
  event_type: EventType;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface BespokeRequest {
  id: string;
  request_number: number;
  contact_name: string | null;
  contact_email: string | null;
  contact_method: string | null;
  business_name: string | null;
  industry: string | null;
  team_size: string | null;
  existing_tools: string[] | null;
  deployment_surface: string[] | null;
  role_description: string;
  timeline: string | null;
  priority_speed: number | null;
  priority_cost: number | null;
  priority_autonomy: number | null;
  generated_scope: Record<string, unknown> | null;
  recommended_tier: string | null;
  estimated_forge_fee_low: number | null;
  estimated_forge_fee_high: number | null;
  additional_context: string | null;
  status: BespokeStatus;
  operator_notes: string | null;
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  business_name: string | null;
  interest_tier: string | null;
  notes: string | null;
  status: WaitlistStatus;
  invited_at: string | null;
  created_at: string;
}

export interface PricingTier {
  id: string;
  product: string;
  slug: string;
  name: string;
  positioning: string | null;
  best_for: string | null;
  forge_fee_starting: number | null;
  retainer_starting: number | null;
  uplift_share_percent: number | null;
  minimum_commitment_months: number | null;
  includes: Record<string, unknown> | null;
  featured: boolean;
  display_order: number | null;
}

export interface ForgeCapacity {
  id: string;
  month: string;
  tier: string;
  slots_total: number | null;
  slots_used: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  factory_slug: string | null;
  contact_name: string | null;
  business_name: string | null;
  quote: string | null;
  outcome_metric: string | null;
  featured: boolean;
  display_order: number | null;
  created_at: string;
}

export interface ProspectSession {
  id: string;
  session_token: string;
  factory_slug: string | null;
  first_seen: string;
  last_seen: string;
  chat_sessions_count: number;
  agents_interacted: string[] | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  location_country: string | null;
  location_region: string | null;
  engagement_score: number;
  claimed_by_user_id: string | null;
  operator_notes: string | null;
}

export interface OperatorNotification {
  id: string;
  operator_id: string;
  type: NotificationType;
  title: string | null;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  slug: string;
  name: string | null;
  subject: string | null;
  body_html: string | null;
  body_text: string | null;
  variables: unknown[];
  updated_at: string;
}

export interface AIUsageLog {
  id: string;
  factory_id: string | null;
  catalog_slug: string | null;
  provider: string | null;
  model: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  estimated_cost_usd: number | null;
  latency_ms: number | null;
  status: AILogStatus | null;
  created_at: string;
}

// ============================================
// INSERT TYPES
// ============================================

export type UserInsert = Omit<User, "id" | "created_at"> & { id?: string; created_at?: string };
export type FactoryInsert = Omit<Factory, "id" | "factory_number" | "created_at" | "health_score"> & { id?: string; created_at?: string; health_score?: number };
export type AgentCatalogInsert = Omit<AgentCatalogEntry, "id" | "created_at"> & { id?: string; created_at?: string };
export type FactoryAgentInsert = Omit<FactoryAgent, "id" | "created_at"> & { id?: string; created_at?: string };
export type ChatSessionInsert = Omit<ChatSession, "id" | "created_at" | "last_message_at"> & { id?: string; created_at?: string; last_message_at?: string };
export type ActivationInsert = Omit<Activation, "id" | "created_at"> & { id?: string; created_at?: string };
export type ActivityEventInsert = Omit<ActivityEvent, "id" | "created_at"> & { id?: string; created_at?: string };
export type BespokeRequestInsert = Omit<BespokeRequest, "id" | "request_number" | "created_at"> & { id?: string; created_at?: string };
export type WaitlistInsert = Omit<WaitlistEntry, "id" | "created_at"> & { id?: string; created_at?: string };
export type PricingTierInsert = Omit<PricingTier, "id"> & { id?: string };

// ============================================
// UPDATE TYPES
// ============================================

export type UserUpdate = Partial<Omit<User, "id" | "created_at">>;
export type FactoryUpdate = Partial<Omit<Factory, "id" | "factory_number" | "created_at">>;
export type FactoryAgentUpdate = Partial<Omit<FactoryAgent, "id" | "created_at">>;
export type BespokeRequestUpdate = Partial<Omit<BespokeRequest, "id" | "request_number" | "created_at">>;

// ============================================
// DATABASE TYPE (for Supabase client typing)
// ============================================

export interface Database {
  public: {
    Tables: {
      users: { Row: User; Insert: UserInsert; Update: UserUpdate };
      factories: { Row: Factory; Insert: FactoryInsert; Update: FactoryUpdate };
      agent_catalog: { Row: AgentCatalogEntry; Insert: AgentCatalogInsert; Update: Partial<AgentCatalogInsert> };
      factory_agents: { Row: FactoryAgent; Insert: FactoryAgentInsert; Update: FactoryAgentUpdate };
      chat_sessions: { Row: ChatSession; Insert: ChatSessionInsert; Update: Partial<ChatSessionInsert> };
      activations: { Row: Activation; Insert: ActivationInsert; Update: Partial<ActivationInsert> };
      activity_events: { Row: ActivityEvent; Insert: ActivityEventInsert; Update: Partial<ActivityEventInsert> };
      bespoke_requests: { Row: BespokeRequest; Insert: BespokeRequestInsert; Update: BespokeRequestUpdate };
      waitlist: { Row: WaitlistEntry; Insert: WaitlistInsert; Update: Partial<WaitlistInsert> };
      pricing_tiers: { Row: PricingTier; Insert: PricingTierInsert; Update: Partial<PricingTierInsert> };
      forge_capacity: { Row: ForgeCapacity; Insert: Partial<ForgeCapacity>; Update: Partial<ForgeCapacity> };
      testimonials: { Row: Testimonial; Insert: Partial<Testimonial>; Update: Partial<Testimonial> };
      prospect_sessions: { Row: ProspectSession; Insert: Partial<ProspectSession>; Update: Partial<ProspectSession> };
      operator_notifications: { Row: OperatorNotification; Insert: Partial<OperatorNotification>; Update: Partial<OperatorNotification> };
      email_templates: { Row: EmailTemplate; Insert: Partial<EmailTemplate>; Update: Partial<EmailTemplate> };
      ai_usage_logs: { Row: AIUsageLog; Insert: Partial<AIUsageLog>; Update: Partial<AIUsageLog> };
    };
  };
}
