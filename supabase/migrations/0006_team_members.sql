-- Team members for factory access control
create table factory_team_members (
  id uuid primary key default gen_random_uuid(),
  factory_id uuid references factories(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  role text default 'viewer' check (role in ('owner', 'operator', 'viewer')),
  invited_by uuid references users(id),
  invited_at timestamptz default now(),
  accepted_at timestamptz,
  last_active_at timestamptz,
  unique (factory_id, user_id)
);

create index idx_team_members_factory on factory_team_members(factory_id);
create index idx_team_members_user on factory_team_members(user_id);
