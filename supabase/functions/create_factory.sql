-- Atomically creates a factory and inserts default agents based on tier
create or replace function create_factory(
  p_slug text,
  p_business_name text,
  p_contact_name text,
  p_contact_email text,
  p_niche text default null,
  p_tier text default 'standard',
  p_owner_user_id uuid default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_factory_id uuid;
  v_agent record;
begin
  -- Create factory
  insert into factories (slug, business_name, contact_name, contact_email, niche, owner_user_id, status)
  values (p_slug, p_business_name, p_contact_name, p_contact_email, p_niche, p_owner_user_id, 'demo')
  returning id into v_factory_id;

  -- Insert starter agents based on tier
  if p_tier = 'specimen' then
    -- Specimen gets limited starter agents
    for v_agent in (select slug from agent_catalog where starter = true limit 5)
    loop
      insert into factory_agents (factory_id, catalog_slug, status)
      values (v_factory_id, v_agent.slug, 'demo');
    end loop;
  elsif p_tier = 'sovereign' then
    -- Sovereign gets all available agents
    for v_agent in (select slug from agent_catalog where status = 'available')
    loop
      insert into factory_agents (factory_id, catalog_slug, status)
      values (v_factory_id, v_agent.slug, 'demo');
    end loop;
  else
    -- Standard gets all starter agents
    for v_agent in (select slug from agent_catalog where starter = true)
    loop
      insert into factory_agents (factory_id, catalog_slug, status)
      values (v_factory_id, v_agent.slug, 'demo');
    end loop;
  end if;

  return v_factory_id;
end;
$$;
