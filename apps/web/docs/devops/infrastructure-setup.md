# Infrastructure & Launch Checklist (Production)

This guide covers setting up the production environment and launching safely.

## Vercel (App hosting)

- Link repo to Vercel project
- Set environment variables (see Developers → Deployment)
- Configure regions and edge/runtime as needed
- Protect preview deployments if required

## Supabase (DB, Auth, Storage)

- Create production project
- Apply migrations from `supabase/migrations`
- Configure Auth (email templates, MFA policies)
- Enable PITR and automated backups
- Set CORS and storage bucket policies

## Stripe (Payments)

- Create products/prices and map to catalog
- Set webhook endpoint to `/api/stripe/webhooks`
- Store `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel
- Run `scripts/upload-stripe-products.ts` if using automated sync

## CDN for video delivery

Options:

- Cloudflare Stream or Bunny Stream (recommended for HLS and analytics)
- Supabase Storage + signed URLs + caching (simple)

Document chosen provider and update player configuration.

## Domain & SSL

- Configure custom domain in Vercel (`therabrake.academy`)
- Add DNS records per Vercel instructions
- Verify SSL certificates (automatic via Vercel)

## Email domain (Resend)

- Verify domain at resend.com/domains (see EMAIL_WORKFLOW_VERIFIED.md)
- Add DKIM (TXT), SPF, and optional MX
- Update `RESEND_API_KEY` and from-address in production

## Monitoring & alerting

- Sentry DSN configured (client, server, edge configs present)
- Vercel Analytics (optional)
- Alerts on 5xx rates, slow endpoints, and webhook failures

## Backups & recovery

- Supabase PITR enabled
- Weekly logical dumps stored offsite
- Restoration test performed

## Data migration

- Import legacy courses using scripts
- Validate counts and sample content
- Run test migrations in a staging environment first

## Pre-launch checklist

- [ ] All environment variables set
- [ ] Build passes on Vercel with cache clear
- [ ] Webhooks succeed
- [ ] Emails deliver in production
- [ ] Critical user flows smoke-tested end-to-end
- [ ] Rollback plan ready (promote previous deploy)
