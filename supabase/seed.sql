-- MiLyfe Platform Seed Data
-- Run after all migrations. Idempotent (safe to re-run).

-- Admin user
INSERT INTO users (email, full_name, role)
VALUES ('miforge@milyfe.fun', 'MiForge Operator', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Pricing tiers
INSERT INTO pricing_tiers (product, slug, name, positioning, best_for, forge_fee_starting, retainer_starting, uplift_share_percent, minimum_commitment_months, includes, featured, display_order)
VALUES
('miforge', 'specimen', 'Specimen Factory', 'Single-module deployment for testing autonomous infrastructure', 'Operators testing the water before full commitment', 2500, 500, 5, 2, '["1 agent activated","30-day deployment sprint","Weekly ops report","Email support"]'::jsonb, false, 1),
('miforge', 'standard', 'Standard Factory', 'Full six-agent deployment for operator replacement', 'Ecommerce operators recovering neglected businesses or preparing for exit', 12000, 1800, 8, 3, '["All 6 agents activated","90-day stabilization sprint","Weekly ops reporting","Priority support","Full integration"]'::jsonb, true, 2),
('miforge', 'sovereign', 'Sovereign Factory', 'Bespoke infrastructure for multi-brand operators and holdcos', 'Multi-business operators, agencies, and holdcos scaling autonomous ops', 35000, 4500, 10, 6, '["Custom-forged agents","Multi-brand deployment","Dedicated forge engineer","Weekly strategy sessions","White-glove onboarding"]'::jsonb, false, 3)
ON CONFLICT (product, slug) DO NOTHING;

-- Forge capacity (current + 3 months)
INSERT INTO forge_capacity (month, tier, slots_total, slots_used) VALUES
(date_trunc('month', now())::date, 'standard', 5, 2),
(date_trunc('month', now())::date, 'specimen', 8, 3),
(date_trunc('month', now())::date, 'sovereign', 2, 0),
(date_trunc('month', now() + interval '1 month')::date, 'standard', 5, 0),
(date_trunc('month', now() + interval '1 month')::date, 'specimen', 8, 0),
(date_trunc('month', now() + interval '1 month')::date, 'sovereign', 2, 0)
ON CONFLICT (month, tier) DO NOTHING;

-- Derek's Factory (#001)
INSERT INTO factories (slug, business_name, contact_name, contact_email, niche, lifetime_revenue, margin, customer_count, broker_valuation_low, broker_valuation_high, platforms, custom_notes, product, is_specimen, status)
VALUES ('derek-adams', 'Derek''s Business', 'Derek Adams', null, 'Gifting & Novelty / Gag Gifts', 1600000, 0.52, 43604, 525000, 650000, array['shopify','tiktok_shop'], 'Business neglected 18+ months. Seeking sale-ready stabilization.', 'miforge', false, 'demo')
ON CONFLICT (slug) DO NOTHING;

-- Insert Derek's agents
INSERT INTO factory_agents (factory_id, catalog_slug)
SELECT f.id, slug FROM factories f, unnest(array['customer_service','email_reactivation','social_content','seo_refresh','fulfillment_monitor','ops_reporting']) AS slug
WHERE f.slug = 'derek-adams'
ON CONFLICT (factory_id, catalog_slug) DO NOTHING;

-- Note: Full 12 specimen factories and 32 catalog agents are defined
-- in the TypeScript mock data (src/lib/supabase/mocks.ts) for development.
-- Production seeding uses the mock data as source of truth for SQL INSERT statements.
-- Run scripts/seed-platform.ts for full seeding in a real Supabase project.
