-- Computes factory health score 0-100
-- Based on: activity frequency (40%), agent activation rate (30%), payment status (30%)
create or replace function get_factory_health(p_factory_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  v_activity_score integer := 0;
  v_agent_score integer := 0;
  v_payment_score integer := 0;
  v_recent_events integer;
  v_total_agents integer;
  v_active_agents integer;
  v_payment_status text;
begin
  -- Activity frequency (40%): recent events in last 7 days
  select count(*) into v_recent_events
  from activity_events
  where factory_id = p_factory_id
    and created_at > now() - interval '7 days';

  if v_recent_events >= 20 then
    v_activity_score := 40;
  elsif v_recent_events >= 10 then
    v_activity_score := 30;
  elsif v_recent_events >= 5 then
    v_activity_score := 20;
  elsif v_recent_events >= 1 then
    v_activity_score := 10;
  else
    v_activity_score := 0;
  end if;

  -- Agent activation rate (30%): ratio of active to total
  select count(*), count(*) filter (where status = 'active')
  into v_total_agents, v_active_agents
  from factory_agents
  where factory_id = p_factory_id;

  if v_total_agents > 0 then
    v_agent_score := (v_active_agents * 30) / v_total_agents;
  end if;

  -- Payment status (30%)
  select payment_status into v_payment_status
  from activations
  where factory_id = p_factory_id
  order by created_at desc
  limit 1;

  case v_payment_status
    when 'paid' then v_payment_score := 30;
    when 'pending' then v_payment_score := 15;
    when 'failed' then v_payment_score := 0;
    else v_payment_score := 15; -- no activation record = demo
  end case;

  -- Update factory health score
  update factories
  set health_score = v_activity_score + v_agent_score + v_payment_score
  where id = p_factory_id;

  return v_activity_score + v_agent_score + v_payment_score;
end;
$$;
