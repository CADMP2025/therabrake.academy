# Deployment Procedures

This guide covers how to build and deploy TheraBrake Academy to production (Vercel), including environment variables and cache considerations.

## Prerequisites

- Vercel CLI installed and logged in.
- Project linked to the correct Vercel project.
- `.env.production` prepared with all required variables.

## One-command deploy (script)

Use the provided script:

- `deploy-production.sh` (Linux/macOS)
  - Installs deps with `npm ci`
  - Type-checks, builds, and deploys with `vercel --prod --yes`

On Windows, run equivalent steps from PowerShell.

## Manual deploy steps

1. Install dependencies: `npm ci`
2. Type check: `npm run type-check`
3. Build: `npm run build`
4. Deploy: `vercel --prod`

## Clearing cache on Vercel

- Use the Vercel dashboard to Redeploy with "Clear cache & deploy" after case-only renames or alias changes.
- CLI: `vercel --prod --force` (forces a fresh build on Vercel).

## Environment variables (production)

Set these in Vercel Project Settings → Environment Variables:

- NEXT_PUBLIC_SITE_URL
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE (server only)
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- RESEND_API_KEY
- SENTRY_DSN (optional)
- Any feature flags used in the app

## Build configuration

- `vercel.json` sets build and framework to Next.js.
- `next.config.js` defines webpack alias `@` to project root and disables `fs` fallback on client.

## Post-deploy checks

- /health returns 200
- Static pages render; dynamic routes load without 500s
- API endpoints requiring cookies function as expected
- Stripe webhooks show 2xx
- Email test at /api/email/test succeeds

## Rollback

- Use Vercel dashboard to promote a previous deployment if needed.
- Tag releases in Git to track deploys.
