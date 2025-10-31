# Vercel Setup & Deployment Guide

## First-Time Setup

### 1. Login to Vercel

```powershell
vercel login
```

This will:
- Open your browser
- Ask you to authenticate with GitHub, GitLab, Bitbucket, or email
- Generate an authentication token

### 2. Link Your Project (if not already linked)

```powershell
vercel link
```

This connects your local project to your Vercel project dashboard.

## Deploy Feature Branch

Once authenticated, deploy the `feature/course-builder` branch:

```powershell
.\deploy-feature-branch.ps1
```

Or manually:

```powershell
vercel --yes
```

## What Happens During Deployment

1. **Build succeeds** ✅ (95 pages generated)
2. **Vercel uploads** your `.next` build folder
3. **Preview URL created** - unique to this branch
4. **Environment variables** - pulled from Vercel dashboard

## Expected Preview URL Format

```
https://therabrake-academy-[random]-[your-username].vercel.app
```

## Environment Variables

Make sure these are configured in your Vercel project dashboard:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`

**Optional (for full functionality):**
- `MEILISEARCH_HOST`
- `MEILISEARCH_API_KEY`
- `REDIS_URL`
- `SENTRY_DSN`

## Deployment Options

### Option 1: CLI (Recommended for preview)

```powershell
# Preview deployment (this branch)
vercel

# Production deployment (after merge to main)
vercel --prod
```

### Option 2: Git Integration (Automatic)

If you've connected your GitHub repo to Vercel:

1. Push to `feature/course-builder` branch
2. Vercel automatically deploys a preview
3. Check your Vercel dashboard for the URL

### Option 3: Vercel Dashboard (Manual)

1. Visit <https://vercel.com/dashboard>
2. Select "therabrake-academy" project
3. Go to "Deployments" tab
4. Click "Deploy" and select `feature/course-builder`

## Current Build Status

✅ **Build: PASSING**
- 95 pages generated successfully
- All TypeScript checks passing
- UI components resolved correctly
- Module resolution fixed (baseUrl in tsconfig.json)

## Troubleshooting

### "Token is not valid"

Run:

```powershell
vercel login
```

### "Project not linked"

Run:

```powershell
vercel link
```

Then follow prompts to:
1. Select your Vercel scope/team
2. Link to existing project or create new one
3. Confirm the link

### Build fails on Vercel (but works locally)

Check:
1. Environment variables in Vercel dashboard
2. Node.js version matches (20.x in package.json)
3. All dependencies in package.json

## Next Steps After Deployment

1. ✅ Get your preview URL
2. Test the new homepage copy
3. Test UI components
4. Verify all features work
5. Once satisfied, merge to `main` for production

## Production Deployment

After merging to `main`:

```powershell
.\deploy-production.ps1
```

Or if using Git integration, push to `main` and Vercel auto-deploys.
