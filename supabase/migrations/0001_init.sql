-- MiLyfe Platform - Initial Schema Migration
-- Run against a fresh Supabase project

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- USERS
-- ============================================
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'client' check (role in ('client', 'operator', 'admin')),
  created_at timestamptz default now()
);

create index idx_users_email on users(email);
create index idx_users_role on users(role);

-- ============================================
-- FACTORIES
-- ============================================
create table factories (
  id uuid primary key default gen_random_uuid(),
  factory_number serial unique,
  slug text unique not null,
  owner_user_id uuid references users(id) on delete set null,
  business_name text not null,
  contact_name text not null,
  contact_email text,
  niche text,
  lifetime_revenue numeric,
  margin numeric,
  customer_count integer,
  broker_valuation_low numeric,
  broker_valuation_high numeric,
  platforms text[],
  custom_notes text,
  brand_voice_sample text,
  status text default 'demo' check (status in ('demo', 'checkout', 'activated', 'paused')),
  product text default 'miforge',
  is_specimen boolean default false,
  health_score integer default 100,
  created_at timestamptz default now(),
  activated_at timestamptz
);

create index idx_factories_slug on factories(slug);
create index idx_factories_status on factories(status);
create index idx_factories_owner on factories(owner_user_id);

-- ============================================
-- AGENT CATALOG
-- ============================================
create table agent_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('ecommerce_ops', 'sales_growth', 'content', 'client_services', 'finance_ops', 'recruitment', 'bespoke')),
  description text,
  capabilities text[],
  ideal_for text[],
  starter boolean default false,
  status text default 'available' check (status in ('available', 'beta', 'coming_soon', 'bespoke_only')),
  icon_name text,
  model_config jsonb default '{}'::jsonb,
  display_order integer,
  created_at timestamptz default now()
);

create index idx_agent_catalog_slug on agent_catalog(slug);
create index idx_agent_catalog_category on agent_catalog(category);

-- ============================================
-- FACTORY AGENTS
-- ============================================
create table factory_agents (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid references factories(id) on delete cascade,
  catalog_slug text references agent_catalog(slug),
  status text default 'demo' check (status in ('demo', 'active', 'paused')),
  custom_config jsonb default '{}'::jsonb,
  activated_at timestamptz,
  created_at timestamptz default now(),
  unique (factory_id, catalog_slug)
);

create index idx_factory_agents_factory on factory_agents(factory_id);
create index idx_factory_agents_slug on factory_agents(catalog_slug);

-- ============================================
-- CHAT SESSIONS
-- ============================================
create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid references factories(id) on delete cascade,
  catalog_slug text references agent_catalog(slug),
  session_token text,
  messages jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  last_message_at timestamptz default now()
);

create index idx_chat_sessions_factory_agent on chat_sessions(factory_id, catalog_slug);
create index idx_chat_sessions_token on chat_sessions(session_token);

-- ============================================
-- ACTIVATIONS
-- ============================================
create table activations (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid references factories(id) on delete cascade,
  tier text check (tier in ('specimen', 'standard', 'sovereign')),
  payment_provider text check (payment_provider in ('paddle', 'gocardless')),
  payment_status text check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_reference text,
  contract_signed boolean default false,
  contract_url text,
  access_handoff_complete boolean default false,
  forge_fee numeric,
  monthly_retainer numeric,
  uplift_share_percent numeric,
  scheduled_call_at timestamptz,
  created_at timestamptz default now()
);

create index idx_activations_factory on activations(factory_id);

-- ============================================
-- ACTIVITY EVENTS
-- ============================================
create table activity_events (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid references factories(id) on delete cascade,
  catalog_slug text references agent_catalog(slug),
  event_text text not null,
  event_type text default 'action' check (event_type in ('action', 'handoff', 'milestone', 'alert')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index idx_activity_events_factory_time on activity_events(factory_id, created_at desc);

-- ============================================
-- BESPOKE REQUESTS
-- ============================================
create table bespoke_requests (
  id uuid primary key default gen_random_uuid(),
  request_number serial unique,
  contact_name text,
  contact_email text,
  contact_method text,
  business_name text,
  industry text,
  team_size text,
  existing_tools text[],
  deployment_surface text[],
  role_description text not null,
  timeline text,
  priority_speed integer,
  priority_cost integer,
  priority_autonomy integer,
  generated_scope jsonb,
  recommended_tier text,
  estimated_forge_fee_low numeric,
  estimated_forge_fee_high numeric,
  additional_context text,
  status text default 'submitted' check (status in ('submitted', 'reviewing', 'scoping', 'quoted', 'won', 'lost')),
  operator_notes text,
  created_at timestamptz default now()
);

create index idx_bespoke_requests_status on bespoke_requests(status);

-- ============================================
-- WAITLIST
-- ============================================
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  business_name text,
  interest_tier text,
  notes text,
  status text default 'waiting' check (status in ('waiting', 'invited', 'converted', 'passed')),
  invited_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================
-- PRICING TIERS
-- ============================================
create table pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  product text not null,
  slug text not null,
  name text not null,
  positioning text,
  best_for text,
  forge_fee_starting numeric,
  retainer_starting numeric,
  uplift_share_percent numeric,
  minimum_commitment_months integer,
  includes jsonb,
  featured boolean default false,
  display_order integer,
  unique (product, slug)
);

-- ============================================
-- FORGE CAPACITY
-- ============================================
create table forge_capacity (
  id uuid primary key default gen_random_uuid(),
  month date not null,
  tier text not null,
  slots_total integer,
  slots_used integer default 0,
  created_at timestamptz default now(),
  unique (month, tier)
);

-- ============================================
-- TESTIMONIALS
-- ============================================
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  factory_slug text references factories(slug) on delete set null,
  contact_name text,
  business_name text,
  quote text,
  outcome_metric text,
  featured boolean default false,
  display_order integer,
  created_at timestamptz default now()
);

-- ============================================
-- PROSPECT SESSIONS
-- ============================================
create table prospect_sessions (
  id uuid primary key default gen_random_uuid(),
  session_token text unique not null,
  factory_slug text references factories(slug) on delete cascade,
  first_seen timestamptz default now(),
  last_seen timestamptz default now(),
  chat_sessions_count integer default 0,
  agents_interacted text[],
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  location_country text,
  location_region text,
  engagement_score numeric default 0,
  claimed_by_user_id uuid references users(id) on delete set null,
  operator_notes text
);

create index idx_prospect_sessions_factory on prospect_sessions(factory_slug, last_seen desc);
create index idx_prospect_sessions_token on prospect_sessions(session_token);

-- ============================================
-- OPERATOR NOTIFICATIONS
-- ============================================
create table operator_notifications (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid references users(id) on delete cascade,
  type text not null check (type in ('new_prospect', 'bespoke_request', 'payment', 'churn_risk', 'waitlist')),
  title text,
  body text,
  link text,
  read boolean default false,
  created_at timestamptz default now()
);

create index idx_operator_notifications_lookup on operator_notifications(operator_id, read, created_at desc);

-- ============================================
-- EMAIL TEMPLATES
-- ============================================
create table email_templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text,
  subject text,
  body_html text,
  body_text text,
  variables jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- ============================================
-- AI USAGE LOGS
-- ============================================
create table ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid references factories(id) on delete set null,
  catalog_slug text,
  provider text,
  model text,
  input_tokens integer,
  output_tokens integer,
  estimated_cost_usd numeric,
  latency_ms integer,
  status text check (status in ('success', 'fallback_used', 'failed')),
  created_at timestamptz default now()
);

create index idx_ai_usage_logs_time on ai_usage_logs(created_at desc);
create index idx_ai_usage_logs_factory on ai_usage_logs(factory_id, created_at desc);
