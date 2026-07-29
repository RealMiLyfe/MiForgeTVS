-- Email delivery tracking
create table email_events (
  id uuid primary key default gen_random_uuid(),
  template_slug text,
  recipient text,
  sender text,
  subject text,
  status text default 'sent' check (status in ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'failed', 'placeholder')),
  provider_message_id text,
  metadata jsonb,
  sent_at timestamptz default now(),
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz
);

create index idx_email_events_recipient on email_events(recipient, sent_at desc);
create index idx_email_events_template on email_events(template_slug, sent_at desc);
create index idx_email_events_status on email_events(status);

-- Notification preferences
alter table users add column if not exists notification_preferences jsonb default '{
  "email_weekly_reports": true,
  "email_agent_alerts": true,
  "email_billing": true,
  "email_referrals": true,
  "email_team_activity": true,
  "email_platform_updates": true
}'::jsonb;
