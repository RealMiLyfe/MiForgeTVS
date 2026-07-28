-- Updates prospect engagement score based on event type
create or replace function increment_prospect_engagement(
  p_session_token text,
  p_event_type text
)
returns void
language plpgsql
security definer
as $$
declare
  v_score_delta numeric;
begin
  -- Determine score increment based on event type
  case p_event_type
    when 'chat_session' then v_score_delta := 10;
    when 'agent_interaction' then v_score_delta := 5;
    when 'unlock_attempt' then v_score_delta := 50;
    when 'pricing_view' then v_score_delta := 15;
    when 'bespoke_start' then v_score_delta := 30;
    when 'page_view' then v_score_delta := 1;
    else v_score_delta := 2;
  end case;

  update prospect_sessions
  set
    engagement_score = engagement_score + v_score_delta,
    last_seen = now()
  where session_token = p_session_token;

  -- If no row updated, create new prospect session
  if not found then
    insert into prospect_sessions (session_token, engagement_score)
    values (p_session_token, v_score_delta);
  end if;
end;
$$;
