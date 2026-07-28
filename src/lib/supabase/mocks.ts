import type {
  User, Factory, AgentCatalogEntry, FactoryAgent,
  ActivityEvent, BespokeRequest, PricingTier,
} from "./types";

// ============================================
// MOCK USERS
// ============================================
export const mockUsers: User[] = [
  {
    id: "u-001",
    email: "miforge@milyfe.fun",
    full_name: "MiForge Operator",
    avatar_url: null,
    role: "admin",
    created_at: "2025-01-01T00:00:00Z",
  },

  {
    id: "u-002",
    email: "derek@novagoods.com",
    full_name: "Derek Adams",
    avatar_url: null,
    role: "client",
    created_at: "2025-03-15T00:00:00Z",
  },
];

// ============================================
// MOCK FACTORIES (13 total: Derek + 12 specimens)
// ============================================
export const mockFactories: Factory[] = [
  {
    id: "f-001", factory_number: 1, slug: "derek-adams",
    owner_user_id: "u-002", business_name: "NovaGoods",
    contact_name: "Derek Adams", contact_email: "derek@novagoods.com",
    niche: "Novelty Ecommerce", lifetime_revenue: 420000, margin: 0.32,
    customer_count: 8400, broker_valuation_low: 180000,
    broker_valuation_high: 260000, platforms: ["Shopify", "TikTok Shop"],
    custom_notes: null, brand_voice_sample: "Playful, punny, meme-adjacent",
    status: "activated", product: "miforge", is_specimen: false,
    health_score: 92, created_at: "2025-03-15T00:00:00Z",
    activated_at: "2025-03-20T00:00:00Z",
  },

  {
    id: "f-002", factory_number: 2, slug: "specimen-bloom-beauty",
    owner_user_id: null, business_name: "Bloom Beauty Co",
    contact_name: "Specimen", contact_email: null,
    niche: "DTC Beauty", lifetime_revenue: 890000, margin: 0.45,
    customer_count: 12000, broker_valuation_low: 400000,
    broker_valuation_high: 600000, platforms: ["Shopify"],
    custom_notes: null, brand_voice_sample: "Clean, aspirational, empowering",
    status: "demo", product: "miforge", is_specimen: true,
    health_score: 85, created_at: "2025-04-01T00:00:00Z", activated_at: null,
  },
  {
    id: "f-003", factory_number: 3, slug: "specimen-iron-legal",
    owner_user_id: null, business_name: "Iron Legal Partners",
    contact_name: "Specimen", contact_email: null,
    niche: "Legal Services", lifetime_revenue: 1200000, margin: 0.55,
    customer_count: 340, broker_valuation_low: 800000,
    broker_valuation_high: 1200000, platforms: ["Custom CRM"],
    custom_notes: null, brand_voice_sample: "Professional, authoritative",
    status: "demo", product: "miforge", is_specimen: true,
    health_score: 78, created_at: "2025-04-01T00:00:00Z", activated_at: null,
  },

  {
    id: "f-004", factory_number: 4, slug: "specimen-pulse-saas",
    owner_user_id: null, business_name: "PulseSaaS Agency",
    contact_name: "Specimen", contact_email: null,
    niche: "SaaS Agency", lifetime_revenue: 650000, margin: 0.62,
    customer_count: 45, broker_valuation_low: 500000,
    broker_valuation_high: 750000, platforms: ["HubSpot", "Stripe"],
    custom_notes: null, brand_voice_sample: "Data-driven, results-focused",
    status: "demo", product: "miforge", is_specimen: true,
    health_score: 88, created_at: "2025-04-01T00:00:00Z", activated_at: null,
  },
  {
    id: "f-005", factory_number: 5, slug: "specimen-ember-content",
    owner_user_id: null, business_name: "Ember Content Studio",
    contact_name: "Specimen", contact_email: null,
    niche: "Content Studio", lifetime_revenue: 320000, margin: 0.70,
    customer_count: 28, broker_valuation_low: 200000,
    broker_valuation_high: 350000, platforms: ["WordPress", "YouTube"],
    custom_notes: null, brand_voice_sample: "Creative, bold, narrative-driven",
    status: "demo", product: "miforge", is_specimen: true,
    health_score: 91, created_at: "2025-04-01T00:00:00Z", activated_at: null,
  },

  {
    id: "f-006", factory_number: 6, slug: "specimen-nexus-fintech",
    owner_user_id: null, business_name: "Nexus Fintech",
    contact_name: "Specimen", contact_email: null,
    niche: "Fintech Ops", lifetime_revenue: 2100000, margin: 0.38,
    customer_count: 5200, broker_valuation_low: 1500000,
    broker_valuation_high: 2200000, platforms: ["Plaid", "Stripe"],
    custom_notes: null, brand_voice_sample: "Precise, trustworthy, technical",
    status: "demo", product: "miforge", is_specimen: true,
    health_score: 95, created_at: "2025-04-01T00:00:00Z", activated_at: null,
  },
  {
    id: "f-007", factory_number: 7, slug: "specimen-verde-consulting",
    owner_user_id: null, business_name: "Verde Consulting",
    contact_name: "Specimen", contact_email: null,
    niche: "Consulting", lifetime_revenue: 780000, margin: 0.72,
    customer_count: 18, broker_valuation_low: 600000,
    broker_valuation_high: 900000, platforms: ["Notion", "Calendly"],
    custom_notes: null, brand_voice_sample: "Strategic, insightful",
    status: "demo", product: "miforge", is_specimen: true,
    health_score: 82, created_at: "2025-04-01T00:00:00Z", activated_at: null,
  },

  {
    id: "f-008", factory_number: 8, slug: "specimen-apex-recruitment",
    owner_user_id: null, business_name: "Apex Recruitment",
    contact_name: "Specimen", contact_email: null,
    niche: "Recruitment", lifetime_revenue: 540000, margin: 0.48,
    customer_count: 120, broker_valuation_low: 350000,
    broker_valuation_high: 500000, platforms: ["LinkedIn", "Workable"],
    custom_notes: null, brand_voice_sample: "Direct, personable",
    status: "demo", product: "miforge", is_specimen: true,
    health_score: 79, created_at: "2025-04-01T00:00:00Z", activated_at: null,
  },
  {
    id: "f-009", factory_number: 9, slug: "specimen-drift-dtc",
    owner_user_id: null, business_name: "Drift DTC",
    contact_name: "Specimen", contact_email: null,
    niche: "DTC Fashion", lifetime_revenue: 1100000, margin: 0.35,
    customer_count: 22000, broker_valuation_low: 700000,
    broker_valuation_high: 1000000, platforms: ["Shopify", "Klaviyo"],
    custom_notes: null, brand_voice_sample: "Trendy, youthful, urban",
    status: "demo", product: "miforge", is_specimen: true,
    health_score: 87, created_at: "2025-04-01T00:00:00Z", activated_at: null,
  },

  {
    id: "f-010", factory_number: 10, slug: "specimen-atlas-logistics",
    owner_user_id: null, business_name: "Atlas Logistics",
    contact_name: "Specimen", contact_email: null,
    niche: "Logistics", lifetime_revenue: 3200000, margin: 0.18,
    customer_count: 890, broker_valuation_low: 2000000,
    broker_valuation_high: 3500000, platforms: ["ShipStation", "Custom"],
    custom_notes: null, brand_voice_sample: "Efficient, reliable",
    status: "demo", product: "miforge", is_specimen: true,
    health_score: 90, created_at: "2025-04-01T00:00:00Z", activated_at: null,
  },
  {
    id: "f-011", factory_number: 11, slug: "specimen-cipher-security",
    owner_user_id: null, business_name: "Cipher Security",
    contact_name: "Specimen", contact_email: null,
    niche: "Cybersecurity", lifetime_revenue: 920000, margin: 0.65,
    customer_count: 62, broker_valuation_low: 700000,
    broker_valuation_high: 1100000, platforms: ["Custom", "Jira"],
    custom_notes: null, brand_voice_sample: "Technical, authoritative",
    status: "demo", product: "miforge", is_specimen: true,
    health_score: 84, created_at: "2025-04-01T00:00:00Z", activated_at: null,
  },

  {
    id: "f-012", factory_number: 12, slug: "specimen-harvest-food",
    owner_user_id: null, business_name: "Harvest Food Co",
    contact_name: "Specimen", contact_email: null,
    niche: "Food & Beverage", lifetime_revenue: 480000, margin: 0.28,
    customer_count: 6800, broker_valuation_low: 250000,
    broker_valuation_high: 400000, platforms: ["Shopify", "DoorDash"],
    custom_notes: null, brand_voice_sample: "Warm, organic, community-focused",
    status: "demo", product: "miforge", is_specimen: true,
    health_score: 76, created_at: "2025-04-01T00:00:00Z", activated_at: null,
  },
  {
    id: "f-013", factory_number: 13, slug: "specimen-orbit-education",
    owner_user_id: null, business_name: "Orbit Education",
    contact_name: "Specimen", contact_email: null,
    niche: "EdTech", lifetime_revenue: 1500000, margin: 0.52,
    customer_count: 4500, broker_valuation_low: 1000000,
    broker_valuation_high: 1800000, platforms: ["Canvas", "Stripe"],
    custom_notes: null, brand_voice_sample: "Encouraging, clear, progressive",
    status: "demo", product: "miforge", is_specimen: true,
    health_score: 93, created_at: "2025-04-01T00:00:00Z", activated_at: null,
  },
];


// ============================================
// MOCK AGENT CATALOG (31 agents)
// ============================================
export const mockAgentCatalog: AgentCatalogEntry[] = [
  { id: "a-01", slug: "customer_service", name: "Customer Service Agent", category: "client_services", description: "Handles inbound customer queries, returns, and order status", capabilities: ["ticket_response", "order_lookup", "return_processing"], ideal_for: ["ecommerce", "dtc"], starter: true, status: "available", icon_name: "MessageSquare", model_config: {}, display_order: 1, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-02", slug: "email_reactivation", name: "Email Reactivation Agent", category: "sales_growth", description: "Generates and sends win-back email sequences to churned customers", capabilities: ["email_generation", "segmentation", "ab_testing"], ideal_for: ["ecommerce", "saas"], starter: true, status: "available", icon_name: "Mail", model_config: {}, display_order: 2, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-03", slug: "social_content", name: "Social Content Agent", category: "content", description: "Creates platform-native social media content with brand voice matching", capabilities: ["content_generation", "hashtag_research", "scheduling"], ideal_for: ["dtc", "content_studios"], starter: true, status: "available", icon_name: "Share2", model_config: {}, display_order: 3, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-04", slug: "seo_refresh", name: "SEO Refresh Agent", category: "content", description: "Audits and rewrites existing content for search optimization", capabilities: ["content_audit", "keyword_optimization", "meta_generation"], ideal_for: ["content_studios", "saas"], starter: true, status: "available", icon_name: "Search", model_config: {}, display_order: 4, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-05", slug: "fulfillment_monitor", name: "Fulfillment Monitor Agent", category: "ecommerce_ops", description: "Tracks orders, flags delays, and proactively notifies customers", capabilities: ["order_tracking", "delay_detection", "notification"], ideal_for: ["ecommerce", "logistics"], starter: true, status: "available", icon_name: "Package", model_config: {}, display_order: 5, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-06", slug: "ops_reporting", name: "Ops Reporting Agent", category: "finance_ops", description: "Generates daily/weekly operational reports with KPI tracking", capabilities: ["data_aggregation", "report_generation", "anomaly_detection"], ideal_for: ["all"], starter: true, status: "available", icon_name: "BarChart3", model_config: {}, display_order: 6, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-07", slug: "review_responder", name: "Review Responder Agent", category: "client_services", description: "Crafts personalized responses to customer reviews across platforms", capabilities: ["sentiment_analysis", "response_generation", "platform_posting"], ideal_for: ["ecommerce", "hospitality"], starter: true, status: "available", icon_name: "Star", model_config: {}, display_order: 7, created_at: "2025-01-01T00:00:00Z" },

  { id: "a-08", slug: "inventory_forecaster", name: "Inventory Forecaster Agent", category: "ecommerce_ops", description: "Predicts stock needs and generates reorder recommendations", capabilities: ["demand_forecasting", "reorder_alerts", "seasonal_analysis"], ideal_for: ["ecommerce", "retail"], starter: false, status: "available", icon_name: "Boxes", model_config: {}, display_order: 8, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-09", slug: "pricing_optimizer", name: "Pricing Optimizer Agent", category: "sales_growth", description: "Analyzes competitor pricing and suggests optimal price points", capabilities: ["competitor_monitoring", "price_elasticity", "margin_optimization"], ideal_for: ["ecommerce", "saas"], starter: false, status: "available", icon_name: "DollarSign", model_config: {}, display_order: 9, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-10", slug: "lead_qualifier", name: "Lead Qualifier Agent", category: "sales_growth", description: "Scores and qualifies inbound leads based on fit criteria", capabilities: ["lead_scoring", "enrichment", "routing"], ideal_for: ["saas", "consulting"], starter: false, status: "available", icon_name: "UserCheck", model_config: {}, display_order: 10, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-11", slug: "blog_writer", name: "Blog Writer Agent", category: "content", description: "Produces long-form blog content optimized for SEO and engagement", capabilities: ["long_form_writing", "research", "internal_linking"], ideal_for: ["content_studios", "saas"], starter: false, status: "available", icon_name: "FileText", model_config: {}, display_order: 11, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-12", slug: "ad_copy_generator", name: "Ad Copy Generator Agent", category: "content", description: "Creates high-converting ad copy for Meta, Google, and TikTok", capabilities: ["ad_copywriting", "hook_generation", "variant_testing"], ideal_for: ["ecommerce", "dtc"], starter: false, status: "available", icon_name: "Megaphone", model_config: {}, display_order: 12, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-13", slug: "onboarding_concierge", name: "Onboarding Concierge Agent", category: "client_services", description: "Guides new customers through setup and first-value experiences", capabilities: ["guided_setup", "checklist_management", "milestone_tracking"], ideal_for: ["saas", "consulting"], starter: false, status: "available", icon_name: "Compass", model_config: {}, display_order: 13, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-14", slug: "churn_predictor", name: "Churn Predictor Agent", category: "sales_growth", description: "Identifies at-risk customers and triggers retention workflows", capabilities: ["churn_scoring", "risk_alerts", "intervention_triggers"], ideal_for: ["saas", "ecommerce"], starter: false, status: "available", icon_name: "AlertTriangle", model_config: {}, display_order: 14, created_at: "2025-01-01T00:00:00Z" },

  { id: "a-15", slug: "invoice_processor", name: "Invoice Processor Agent", category: "finance_ops", description: "Automates invoice creation, sending, and follow-up", capabilities: ["invoice_generation", "payment_tracking", "reminder_automation"], ideal_for: ["consulting", "agencies"], starter: false, status: "available", icon_name: "Receipt", model_config: {}, display_order: 15, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-16", slug: "expense_tracker", name: "Expense Tracker Agent", category: "finance_ops", description: "Categorizes and tracks business expenses with anomaly detection", capabilities: ["expense_categorization", "budget_alerts", "tax_prep"], ideal_for: ["all"], starter: false, status: "available", icon_name: "CreditCard", model_config: {}, display_order: 16, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-17", slug: "candidate_screener", name: "Candidate Screener Agent", category: "recruitment", description: "Reviews applications and shortlists candidates based on criteria", capabilities: ["resume_parsing", "scoring", "outreach_drafting"], ideal_for: ["recruitment", "hr"], starter: false, status: "available", icon_name: "Users", model_config: {}, display_order: 17, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-18", slug: "meeting_scheduler", name: "Meeting Scheduler Agent", category: "client_services", description: "Handles meeting coordination, rescheduling, and prep briefs", capabilities: ["calendar_management", "prep_generation", "follow_up"], ideal_for: ["consulting", "sales"], starter: false, status: "available", icon_name: "Calendar", model_config: {}, display_order: 18, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-19", slug: "product_description", name: "Product Description Agent", category: "content", description: "Writes compelling product descriptions optimized for conversion", capabilities: ["copywriting", "seo_optimization", "tone_matching"], ideal_for: ["ecommerce"], starter: false, status: "available", icon_name: "ShoppingBag", model_config: {}, display_order: 19, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-20", slug: "competitor_monitor", name: "Competitor Monitor Agent", category: "sales_growth", description: "Tracks competitor activities, pricing changes, and market moves", capabilities: ["web_monitoring", "alert_generation", "trend_analysis"], ideal_for: ["all"], starter: false, status: "available", icon_name: "Eye", model_config: {}, display_order: 20, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-21", slug: "refund_processor", name: "Refund Processor Agent", category: "ecommerce_ops", description: "Handles refund requests with policy compliance and customer care", capabilities: ["refund_evaluation", "processing", "communication"], ideal_for: ["ecommerce"], starter: false, status: "available", icon_name: "RotateCcw", model_config: {}, display_order: 21, created_at: "2025-01-01T00:00:00Z" },

  { id: "a-22", slug: "newsletter_curator", name: "Newsletter Curator Agent", category: "content", description: "Curates and writes newsletter content from multiple sources", capabilities: ["content_curation", "newsletter_writing", "personalization"], ideal_for: ["content_studios", "media"], starter: false, status: "available", icon_name: "Newspaper", model_config: {}, display_order: 22, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-23", slug: "support_escalation", name: "Support Escalation Agent", category: "client_services", description: "Identifies critical support issues and routes to human operators", capabilities: ["priority_detection", "escalation_routing", "context_preparation"], ideal_for: ["all"], starter: false, status: "available", icon_name: "PhoneCall", model_config: {}, display_order: 23, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-24", slug: "social_listener", name: "Social Listener Agent", category: "sales_growth", description: "Monitors brand mentions and sentiment across social platforms", capabilities: ["mention_tracking", "sentiment_analysis", "alert_generation"], ideal_for: ["dtc", "brands"], starter: false, status: "available", icon_name: "Radio", model_config: {}, display_order: 24, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-25", slug: "contract_reviewer", name: "Contract Reviewer Agent", category: "finance_ops", description: "Reviews contracts for key terms, risks, and compliance issues", capabilities: ["document_analysis", "risk_flagging", "summary_generation"], ideal_for: ["legal", "consulting"], starter: false, status: "available", icon_name: "FileCheck", model_config: {}, display_order: 25, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-26", slug: "data_enrichment", name: "Data Enrichment Agent", category: "sales_growth", description: "Enriches CRM records with public data and engagement signals", capabilities: ["data_enrichment", "deduplication", "scoring_update"], ideal_for: ["saas", "sales"], starter: false, status: "available", icon_name: "Database", model_config: {}, display_order: 26, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-27", slug: "workflow_automator", name: "Workflow Automator Agent", category: "ecommerce_ops", description: "Creates and manages automated workflows between business tools", capabilities: ["workflow_design", "trigger_management", "error_handling"], ideal_for: ["all"], starter: false, status: "available", icon_name: "Workflow", model_config: {}, display_order: 27, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-28", slug: "qa_tester", name: "QA Tester Agent", category: "ecommerce_ops", description: "Runs automated checks on site functionality and checkout flows", capabilities: ["site_monitoring", "checkout_testing", "error_reporting"], ideal_for: ["ecommerce", "saas"], starter: false, status: "beta", icon_name: "CheckCircle", model_config: {}, display_order: 28, created_at: "2025-01-01T00:00:00Z" },

  { id: "a-29", slug: "proposal_writer", name: "Proposal Writer Agent", category: "client_services", description: "Drafts client proposals and SOWs from brief inputs", capabilities: ["proposal_generation", "pricing_suggestion", "template_management"], ideal_for: ["consulting", "agencies"], starter: false, status: "available", icon_name: "PenTool", model_config: {}, display_order: 29, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-30", slug: "talent_outreach", name: "Talent Outreach Agent", category: "recruitment", description: "Identifies and messages potential candidates with personalized outreach", capabilities: ["candidate_sourcing", "message_personalization", "response_tracking"], ideal_for: ["recruitment"], starter: false, status: "available", icon_name: "UserPlus", model_config: {}, display_order: 30, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-31", slug: "custom_bespoke", name: "Bespoke Agent", category: "bespoke", description: "Custom-built agent tailored to your unique business requirements", capabilities: ["custom"], ideal_for: ["all"], starter: false, status: "bespoke_only", icon_name: "Sparkles", model_config: {}, display_order: 31, created_at: "2025-01-01T00:00:00Z" },
  { id: "a-00", slug: "forge_concierge", name: "The Forge Concierge", category: "platform", description: "The first conversation. Helps operators discover what their business actually needs before anything is forged.", capabilities: ["intent_discovery", "transparent_education", "factory_recommendation", "emotional_attunement", "trust_building"], ideal_for: ["any_operator", "founders", "skeptics", "new_to_milyfe"], starter: false, status: "platform_only", icon_name: "Compass", model_config: { provider: "anthropic", model: "claude-3-5-sonnet-latest", temperature: 0.7, max_tokens: 1500 }, display_order: 0, created_at: "2025-01-01T00:00:00Z" },
];


// ============================================
// MOCK FACTORY AGENTS (7 starter agents per factory)
// ============================================
const starterSlugs = ["customer_service", "email_reactivation", "social_content", "seo_refresh", "fulfillment_monitor", "ops_reporting", "review_responder"];

export const mockFactoryAgents: FactoryAgent[] = mockFactories.flatMap((factory) =>
  starterSlugs.map((slug, i) => ({
    id: `fa-${factory.id}-${i}`,
    factory_id: factory.id,
    catalog_slug: slug,
    status: factory.status === "activated" ? "active" as const : "demo" as const,
    custom_config: {},
    activated_at: factory.activated_at,
    created_at: factory.created_at,
  }))
);

// ============================================
// MOCK PRICING TIERS (3 tiers)
// ============================================
export const mockPricingTiers: PricingTier[] = [
  {
    id: "pt-001", product: "miforge", slug: "specimen",
    name: "Specimen", positioning: "See what's possible",
    best_for: "Businesses exploring autonomous operations",
    forge_fee_starting: 2500, retainer_starting: 497,
    uplift_share_percent: 0, minimum_commitment_months: 1,
    includes: { agents: 5, custom_agents: 0, support: "async", onboarding: "self-serve" },
    featured: false, display_order: 1,
  },

  {
    id: "pt-002", product: "miforge", slug: "standard",
    name: "Standard", positioning: "The full factory",
    best_for: "Owner-operators ready to go autonomous",
    forge_fee_starting: 7500, retainer_starting: 1497,
    uplift_share_percent: 5, minimum_commitment_months: 3,
    includes: { agents: 15, custom_agents: 2, support: "priority", onboarding: "guided" },
    featured: true, display_order: 2,
  },
  {
    id: "pt-003", product: "miforge", slug: "sovereign",
    name: "Sovereign", positioning: "Total autonomous control",
    best_for: "Scaling businesses wanting full AI operations",
    forge_fee_starting: 15000, retainer_starting: 2997,
    uplift_share_percent: 8, minimum_commitment_months: 6,
    includes: { agents: 31, custom_agents: "unlimited", support: "dedicated", onboarding: "white_glove" },
    featured: false, display_order: 3,
  },
];


// ============================================
// MOCK BESPOKE REQUESTS (5 samples)
// ============================================
export const mockBespokeRequests: BespokeRequest[] = [
  { id: "br-001", request_number: 1, contact_name: "Sarah Chen", contact_email: "sarah@techflow.io", contact_method: "email", business_name: "TechFlow", industry: "SaaS", team_size: "5-10", existing_tools: ["HubSpot", "Slack"], deployment_surface: ["web", "slack"], role_description: "Need an agent that monitors our trial users and triggers personalized onboarding sequences based on feature adoption.", timeline: "2-3 weeks", priority_speed: 7, priority_cost: 5, priority_autonomy: 9, generated_scope: null, recommended_tier: "standard", estimated_forge_fee_low: 8000, estimated_forge_fee_high: 12000, additional_context: null, status: "submitted", operator_notes: null, created_at: "2025-06-01T00:00:00Z" },
  { id: "br-002", request_number: 2, contact_name: "Marcus Wright", contact_email: "marcus@wrightlegal.com", contact_method: "phone", business_name: "Wright Legal", industry: "Legal", team_size: "11-25", existing_tools: ["Clio", "DocuSign"], deployment_surface: ["web"], role_description: "Contract review agent that can flag non-standard clauses and suggest alternatives based on our precedent library.", timeline: "4-6 weeks", priority_speed: 4, priority_cost: 3, priority_autonomy: 8, generated_scope: null, recommended_tier: "sovereign", estimated_forge_fee_low: 15000, estimated_forge_fee_high: 22000, additional_context: null, status: "reviewing", operator_notes: "Complex use case, schedule call", created_at: "2025-05-28T00:00:00Z" },
  { id: "br-003", request_number: 3, contact_name: "Jess Park", contact_email: "jess@glowlabs.co", contact_method: "email", business_name: "Glow Labs", industry: "DTC Beauty", team_size: "1-5", existing_tools: ["Shopify", "Klaviyo"], deployment_surface: ["shopify", "email"], role_description: "Personalized skincare routine recommender that chats with customers and builds custom bundles.", timeline: "1-2 weeks", priority_speed: 9, priority_cost: 7, priority_autonomy: 6, generated_scope: null, recommended_tier: "standard", estimated_forge_fee_low: 6000, estimated_forge_fee_high: 9000, additional_context: null, status: "scoping", operator_notes: null, created_at: "2025-05-25T00:00:00Z" },
  { id: "br-004", request_number: 4, contact_name: "Tom Huang", contact_email: "tom@rapidhr.com", contact_method: "email", business_name: "RapidHR", industry: "HR Tech", team_size: "25-50", existing_tools: ["Workday", "LinkedIn"], deployment_surface: ["web", "api"], role_description: "Candidate pre-screening agent that conducts initial phone screens and generates structured assessments.", timeline: "6-8 weeks", priority_speed: 3, priority_cost: 4, priority_autonomy: 10, generated_scope: null, recommended_tier: "sovereign", estimated_forge_fee_low: 18000, estimated_forge_fee_high: 28000, additional_context: null, status: "quoted", operator_notes: "Enterprise pricing discussed", created_at: "2025-05-20T00:00:00Z" },
  { id: "br-005", request_number: 5, contact_name: "Ava Martinez", contact_email: "ava@greenbite.com", contact_method: "email", business_name: "GreenBite", industry: "Food Delivery", team_size: "5-10", existing_tools: ["Square", "DoorDash"], deployment_surface: ["web", "sms"], role_description: "Order management agent that handles modifications, dietary questions, and delivery coordination.", timeline: "2-3 weeks", priority_speed: 8, priority_cost: 6, priority_autonomy: 7, generated_scope: null, recommended_tier: "standard", estimated_forge_fee_low: 7000, estimated_forge_fee_high: 10000, additional_context: null, status: "won", operator_notes: "Converting to factory", created_at: "2025-05-15T00:00:00Z" },
];


// ============================================
// MOCK ACTIVITY EVENTS (sample per Derek factory)
// ============================================
export const mockActivityEvents: ActivityEvent[] = [
  { id: "ae-01", factory_id: "f-001", catalog_slug: "customer_service", event_text: "Resolved 12 customer tickets in the last hour", event_type: "action", metadata: { tickets_resolved: 12 }, created_at: "2025-06-15T14:30:00Z" },
  { id: "ae-02", factory_id: "f-001", catalog_slug: "email_reactivation", event_text: "Sent 45 win-back emails to churned segment", event_type: "action", metadata: { emails_sent: 45 }, created_at: "2025-06-15T13:00:00Z" },
  { id: "ae-03", factory_id: "f-001", catalog_slug: "social_content", event_text: "Published 3 TikTok posts with #NovaGoods trending", event_type: "milestone", metadata: { platform: "tiktok", posts: 3 }, created_at: "2025-06-15T11:00:00Z" },
  { id: "ae-04", factory_id: "f-001", catalog_slug: "fulfillment_monitor", event_text: "Flagged 2 delayed shipments — notified customers", event_type: "alert", metadata: { delayed: 2 }, created_at: "2025-06-15T10:30:00Z" },
  { id: "ae-05", factory_id: "f-001", catalog_slug: "ops_reporting", event_text: "Daily report generated: Revenue up 8% week-over-week", event_type: "action", metadata: { revenue_change: 0.08 }, created_at: "2025-06-15T09:00:00Z" },
  { id: "ae-06", factory_id: "f-001", catalog_slug: "review_responder", event_text: "Responded to 8 new 5-star reviews on Trustpilot", event_type: "action", metadata: { reviews_responded: 8 }, created_at: "2025-06-15T08:00:00Z" },
  { id: "ae-07", factory_id: "f-001", catalog_slug: "seo_refresh", event_text: "Optimized 4 product pages — avg position improved 3.2 spots", event_type: "milestone", metadata: { pages: 4, improvement: 3.2 }, created_at: "2025-06-14T16:00:00Z" },
  { id: "ae-08", factory_id: "f-001", catalog_slug: "customer_service", event_text: "Escalated 1 VIP complaint to human review", event_type: "handoff", metadata: { priority: "high" }, created_at: "2025-06-14T14:00:00Z" },
  { id: "ae-09", factory_id: "f-001", catalog_slug: "email_reactivation", event_text: "Campaign A/B test complete: Variant B wins (+23% open rate)", event_type: "milestone", metadata: { winner: "B", improvement: 0.23 }, created_at: "2025-06-14T12:00:00Z" },
  { id: "ae-10", factory_id: "f-001", catalog_slug: "social_content", event_text: "Scheduled 7 posts for next week across Instagram and TikTok", event_type: "action", metadata: { scheduled: 7 }, created_at: "2025-06-14T10:00:00Z" },
];


// ============================================
// MOCK QUERY FUNCTION
// ============================================
export function mockQuery(table: string, filters: Record<string, unknown> = {}): unknown[] {
  let data: unknown[];

  switch (table) {
    case "users":
      data = mockUsers;
      break;
    case "factories":
      data = mockFactories;
      break;
    case "agent_catalog":
      data = mockAgentCatalog;
      break;
    case "factory_agents":
      data = mockFactoryAgents;
      break;
    case "pricing_tiers":
      data = mockPricingTiers;
      break;
    case "bespoke_requests":
      data = mockBespokeRequests;
      break;
    case "activity_events":
      data = mockActivityEvents;
      break;
    case "testimonials":
      data = [];
      break;
    default:
      data = [];
  }

  // Apply filters
  if (Object.keys(filters).length > 0) {
    data = data.filter((item) => {
      const record = item as Record<string, unknown>;
      return Object.entries(filters).every(([key, value]) => record[key] === value);
    });
  }

  return data;
}
