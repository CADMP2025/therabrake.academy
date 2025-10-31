# TheraBrake Academy - Feature Branch Deployment Guide

## Branch: feature/course-builder

This branch has its own deployment configuration separate from production.

## Quick Deploy

**For Windows (PowerShell):**
```powershell
.\deploy-feature-branch.ps1
```

**For macOS/Linux:**
```bash
chmod +x deploy-feature-branch.sh
./deploy-feature-branch.sh
```

## What This Does

1. ✅ Installs fresh dependencies (`npm ci`)
2. ✅ Runs TypeScript type checking
3. ✅ Builds the Next.js application
4. ✅ Deploys to Vercel **preview environment** (NOT production)

## Preview URL

After deployment, you'll get a unique URL like:
- `https://therabrake-academy-[random]-[scope].vercel.app`

This URL is specific to the `feature/course-builder` branch and won't affect production.

## Environment Variables

Vercel will use environment variables configured in your Vercel dashboard for preview deployments.

## Promoting to Production

Once the feature is tested and ready:

1. Merge `feature/course-builder` into `main`
2. Run the production deployment:
   ```powershell
   .\deploy-production.sh  # or deploy-production.ps1
   ```

## Manual Deployment via Vercel Dashboard

Alternatively, you can deploy through Vercel's dashboard:

1. Visit https://vercel.com/dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click "Deploy" and select `feature/course-builder` branch

## Current Build Status

✅ Build passing - 95 pages generated
✅ TypeScript checks passing
✅ All UI components resolved correctly

## Branch-Specific Features

This branch includes:
- ✨ Complete UI component library (Batch 12.1 & 12.2)
- ✨ Updated homepage with new copy
- ✨ Fixed module resolution with baseUrl in tsconfig.json
- ✨ Security enhancements (Batch 11)
- ✨ Compliance workflows (FERPA, GDPR, PCI DSS)
