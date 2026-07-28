-- Atomically consumes a forge slot for a given tier and month
-- Returns true if successful, false if no capacity
create or replace function consume_forge_slot(
  p_tier text,
  p_month date
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_capacity record;
begin
  -- Lock the row to prevent race conditions
  select * into v_capacity
  from forge_capacity
  where tier = p_tier
    and month = p_month
  for update;

  -- No capacity record exists
  if not found then
    return false;
  end if;

  -- Check if slots available
  if v_capacity.slots_used >= v_capacity.slots_total then
    return false;
  end if;

  -- Consume the slot
  update forge_capacity
  set slots_used = slots_used + 1
  where tier = p_tier
    and month = p_month;

  return true;
end;
$$;
