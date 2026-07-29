# MiLyfe Launch Checklist

## Infrastructure
- [ ] All environment variables set with real values (no placeholders)
- [ ] Supabase project provisioned and all migrations run (0001-0008)
- [ ] All RLS policies active and tested
- [ ] Database backups configured
- [ ] Vercel production deployment successful
- [ ] Custom domain `milyfe.fun` connected
- [ ] SSL certificate active
- [ ] DNS propagation verified globally

## Integrations
- [ ] Paddle production account active and products configured
- [ ] GoCardless production account active
- [ ] DocuSeal contract templates published
- [ ] Cal.com booking event types configured
- [ ] Resend domain verified and DNS records set (SPF, DKIM, DMARC)
- [ ] Anthropic API key active with sufficient credits
- [ ] OpenAI API key active
- [ ] NVIDIA Build API access confirmed
- [ ] PostHog project created
- [ ] Sentry project created (optional for launch)

## Content
- [ ] All 32 catalog agents seeded with system prompts
- [ ] Derek's factory (#001) live and personalized
- [ ] All 12 specimen factories live with activity events
- [ ] Manifesto published and reviewed
- [ ] Legal pages reviewed by counsel
- [ ] All email templates active with production copy

## Payments
- [ ] Test transaction completed via Paddle
- [ ] Test mandate created via GoCardless
- [ ] Webhook signatures verified
- [ ] Contract signature flow tested
- [ ] Refund flow tested

## Communications
- [ ] Test email delivered to real inbox (not spam)
- [ ] All template variables interpolating correctly
- [ ] Cron jobs scheduled and tested
- [ ] Unsubscribe flow works

## Monitoring
- [ ] Error tracking capturing test errors
- [ ] Analytics tracking key events
- [ ] Operator notifications working

## Performance
- [ ] Lighthouse scores >90 on all public pages
- [ ] Load time <2s on 3G simulation
- [ ] Mobile UX tested on real devices

## Security
- [ ] All API keys rotated to production values
- [ ] No secrets in client-side code
- [ ] Security headers active
- [ ] Rate limits in place
- [ ] CSRF protection on state-changing operations

## Documentation
- [ ] README with setup instructions
- [ ] Environment variable documentation
- [ ] Deployment runbook
- [ ] Operator handbook
