-- Audit log for all admin actions
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references users(id),
  actor_email text,
  action text not null,
  target_type text,
  target_id text,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

create index idx_audit_log_time on audit_log(created_at desc);
create index idx_audit_log_actor on audit_log(actor_user_id, created_at desc);
create index idx_audit_log_target on audit_log(target_type, target_id);
