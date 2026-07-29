# MiLyfe Deployment Guide

## Prerequisites
- Node.js 18+ (recommended: 22)
- npm or pnpm
- Vercel CLI (for deployment)
- Supabase CLI (for migrations)

## Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## Environment Variables

All services work in placeholder mode when keys are set to `PLACEHOLDER`.
This allows full UX development without live services.

### Required for production:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `ANTHROPIC_API_KEY` - For Concierge + factory agents
- `RESEND_API_KEY` - For transactional emails
- `PADDLE_API_KEY` - For payment processing

## Database Setup

```bash
# Run all migrations in order
supabase db push

# Or run manually:
psql $DATABASE_URL < supabase/migrations/0001_init.sql
psql $DATABASE_URL < supabase/migrations/0002_ai_usage_logs.sql
# ... through 0008
psql $DATABASE_URL < supabase/policies/rls_policies.sql
psql $DATABASE_URL < supabase/functions/*.sql
psql $DATABASE_URL < supabase/seed.sql
```

## Vercel Deployment

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

## Post-Deployment
1. Verify all pages load correctly
2. Test Concierge chat flow
3. Test factory page cinematic
4. Verify placeholder mode works for unconfigured services
5. Run through launch checklist in docs/LAUNCH_CHECKLIST.md
