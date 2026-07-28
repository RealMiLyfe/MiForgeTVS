-- Patch 003: The Forge Concierge System

-- Discovery sessions (Concierge conversations)
create table discovery_sessions (
  id uuid primary key default gen_random_uuid(),
  session_token text unique not null,
  user_id uuid references users(id) on delete set null,
  messages jsonb default '[]'::jsonb,
  extracted_intent jsonb default '{}'::jsonb,
  intent_confidence numeric default 0,
  recommended_factory_config jsonb default '{}'::jsonb,
  status text default 'active' check (status in ('active', 'preview_generated', 'converted', 'abandoned')),
  last_message_at timestamptz default now(),
  created_at timestamptz default now()
);

create index idx_discovery_sessions_token on discovery_sessions(session_token);
create index idx_discovery_sessions_user on discovery_sessions(user_id);
create index idx_discovery_sessions_status on discovery_sessions(status, last_message_at desc);

-- Intent profiles (extracted structured intent per session)
create table intent_profiles (
  id uuid primary key default gen_random_uuid(),
  discovery_session_id uuid references discovery_sessions(id) on delete cascade,
  business_stage text,
  primary_pain text,
  secondary_pains text[],
  operational_bottlenecks text[],
  desired_outcomes text[],
  time_horizon text,
  budget_signal text,
  emotional_state text,
  business_type text,
  business_scale text,
  existing_infrastructure text[],
  extracted_at timestamptz default now()
);

create index idx_intent_profiles_session on intent_profiles(discovery_session_id);

-- Preview factories (auto-generated from discovery)
create table preview_factories (
  id uuid primary key default gen_random_uuid(),
  discovery_session_id uuid references discovery_sessions(id) on delete cascade,
  factory_id uuid references factories(id) on delete cascade,
  generated_at timestamptz default now()
);

-- Track Concierge -> conversion funnel
create table concierge_conversions (
  id uuid primary key default gen_random_uuid(),
  discovery_session_id uuid references discovery_sessions(id) on delete set null,
  conversion_type text check (conversion_type in ('preview_generated', 'factory_explored', 'unlock_started', 'activated', 'bespoke_submitted', 'waitlist_joined')),
  metadata jsonb,
  created_at timestamptz default now()
);

-- Add preview columns to factories table
alter table factories add column if not exists is_preview boolean default false;
alter table factories add column if not exists preview_source_session_id uuid references discovery_sessions(id);
alter table factories add column if not exists preview_expires_at timestamptz;

-- Add Concierge to agent catalog (platform-only, not visible in public catalog)
insert into agent_catalog (
  slug, name, category, description, capabilities, ideal_for,
  starter, status, icon_name, display_order, model_config
) values (
  'forge_concierge',
  'The Forge Concierge',
  'platform',
  'The first conversation. Helps operators discover what their business actually needs before anything is forged.',
  array[
    'Intent discovery through unhurried dialogue',
    'Transparent education about MiForge capabilities and limitations',
    'Personalized factory recommendation based on discovered intent',
    'Emotional attunement to operator state',
    'Trust-building through clarity, not claims'
  ],
  array[
    'Any operator exploring autonomous infrastructure',
    'Founders unsure what agents they need',
    'Skeptics wanting transparent education',
    'Anyone new to MiLyfe'
  ],
  false,
  'platform_only',
  'Compass',
  0,
  '{"provider": "anthropic", "model": "claude-3-5-sonnet-latest", "temperature": 0.7, "max_tokens": 1500}'::jsonb
);

-- RLS for new tables
alter table discovery_sessions enable row level security;
alter table intent_profiles enable row level security;
alter table preview_factories enable row level security;
alter table concierge_conversions enable row level security;

create policy "Anyone can create discovery sessions"
  on discovery_sessions for insert with check (true);

create policy "Sessions viewable by token or owner"
  on discovery_sessions for select
  using (true);

create policy "Sessions updatable by token or owner"
  on discovery_sessions for update
  using (true);

create policy "Operators can view all intent profiles"
  on intent_profiles for select
  using (exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin')));

create policy "System can insert intent profiles"
  on intent_profiles for insert with check (true);

create policy "Preview factories viewable by all"
  on preview_factories for select using (true);

create policy "System can insert preview factories"
  on preview_factories for insert with check (true);

create policy "Conversions insertable by system"
  on concierge_conversions for insert with check (true);

create policy "Operators can view conversions"
  on concierge_conversions for select
  using (exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin')));
