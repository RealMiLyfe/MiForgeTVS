-- Row Level Security Policies for MiLyfe Platform

-- Enable RLS on all tables
alter table users enable row level security;
alter table factories enable row level security;
alter table agent_catalog enable row level security;
alter table factory_agents enable row level security;
alter table chat_sessions enable row level security;
alter table activations enable row level security;
alter table activity_events enable row level security;
alter table bespoke_requests enable row level security;
alter table waitlist enable row level security;
alter table pricing_tiers enable row level security;
alter table forge_capacity enable row level security;
alter table testimonials enable row level security;
alter table prospect_sessions enable row level security;
alter table operator_notifications enable row level security;
alter table email_templates enable row level security;
alter table ai_usage_logs enable row level security;

-- ============================================
-- USERS POLICIES
-- ============================================
create policy "Users can view own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (role = (select role from users where id = auth.uid()))
  );

create policy "Operators can view all users"
  on users for select
  using (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

create policy "Only admins can change roles"
  on users for update
  using (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- FACTORIES POLICIES
-- ============================================
create policy "Public can view demo and specimen factories"
  on factories for select
  using (status = 'demo' or is_specimen = true);

create policy "Owners can view their own factories"
  on factories for select
  using (auth.uid() = owner_user_id);

create policy "Operators can select all factories"
  on factories for select
  using (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

create policy "Operators can insert factories"
  on factories for insert
  with check (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

create policy "Operators can update factories"
  on factories for update
  using (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

create policy "Only admins can delete factories"
  on factories for delete
  using (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- FACTORY AGENTS POLICIES
-- ============================================
create policy "Public can view agents of public factories"
  on factory_agents for select
  using (
    exists (
      select 1 from factories
      where factories.id = factory_agents.factory_id
      and (factories.status = 'demo' or factories.is_specimen = true)
    )
  );

create policy "Owners can view their factory agents"
  on factory_agents for select
  using (
    exists (
      select 1 from factories
      where factories.id = factory_agents.factory_id
      and factories.owner_user_id = auth.uid()
    )
  );

create policy "Operators can manage all factory agents"
  on factory_agents for all
  using (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

-- ============================================
-- CHAT SESSIONS POLICIES
-- ============================================
create policy "Anyone can insert chat sessions"
  on chat_sessions for insert
  with check (true);

create policy "Sessions viewable by token or factory owner"
  on chat_sessions for select
  using (
    session_token is not null
    or exists (
      select 1 from factories
      where factories.id = chat_sessions.factory_id
      and factories.owner_user_id = auth.uid()
    )
  );

create policy "Operators can view all chat sessions"
  on chat_sessions for select
  using (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

-- ============================================
-- ACTIVITY EVENTS POLICIES
-- ============================================
create policy "Public can view events of public factories"
  on activity_events for select
  using (
    exists (
      select 1 from factories
      where factories.id = activity_events.factory_id
      and (factories.status = 'demo' or factories.is_specimen = true)
    )
  );

create policy "Only operators can insert events"
  on activity_events for insert
  with check (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

-- ============================================
-- ACTIVATIONS POLICIES
-- ============================================
create policy "Users can view own activations"
  on activations for select
  using (
    exists (
      select 1 from factories
      where factories.id = activations.factory_id
      and factories.owner_user_id = auth.uid()
    )
  );

create policy "Operators can manage activations"
  on activations for all
  using (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

-- ============================================
-- BESPOKE REQUESTS POLICIES
-- ============================================
create policy "Anyone can submit bespoke requests"
  on bespoke_requests for insert
  with check (true);

create policy "Users can view own requests by email"
  on bespoke_requests for select
  using (
    contact_email = (select email from users where id = auth.uid())
  );

create policy "Operators can manage bespoke requests"
  on bespoke_requests for all
  using (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

-- ============================================
-- WAITLIST POLICIES
-- ============================================
create policy "Anyone can join waitlist"
  on waitlist for insert
  with check (true);

create policy "Users can view own waitlist entry"
  on waitlist for select
  using (
    email = (select email from users where id = auth.uid())
  );

create policy "Operators can manage waitlist"
  on waitlist for all
  using (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

-- ============================================
-- OPERATOR NOTIFICATIONS POLICIES
-- ============================================
create policy "Operators can view own notifications"
  on operator_notifications for select
  using (operator_id = auth.uid());

create policy "Operators can update own notifications"
  on operator_notifications for update
  using (operator_id = auth.uid());

-- ============================================
-- PUBLIC READ TABLES (no auth required)
-- ============================================
create policy "Agent catalog is public"
  on agent_catalog for select
  using (true);

create policy "Pricing tiers are public"
  on pricing_tiers for select
  using (true);

create policy "Featured testimonials are public"
  on testimonials for select
  using (featured = true);

-- ============================================
-- PROSPECT SESSIONS
-- ============================================
create policy "Prospect sessions viewable by operators"
  on prospect_sessions for select
  using (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

create policy "Anyone can create prospect sessions"
  on prospect_sessions for insert
  with check (true);

create policy "Anyone can update prospect sessions by token"
  on prospect_sessions for update
  using (true);

-- ============================================
-- EMAIL TEMPLATES (operator only)
-- ============================================
create policy "Operators can manage email templates"
  on email_templates for all
  using (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

-- ============================================
-- AI USAGE LOGS (operator only)
-- ============================================
create policy "Operators can view AI logs"
  on ai_usage_logs for select
  using (
    exists (select 1 from users where id = auth.uid() and role in ('operator', 'admin'))
  );

create policy "Service role can insert AI logs"
  on ai_usage_logs for insert
  with check (true);
