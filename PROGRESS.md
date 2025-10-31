# TheraBrake Academy - Development Progress

**Last Updated:** October 31, 2025  
**Current Branch:** feature/course-builder  
**Status:** Mobile app development in progress

---

## ✅ **Completed Today**

### 1. Monorepo Migration
- ✅ Migrated from single Next.js app to monorepo structure
- ✅ Created `apps/web/` and `apps/mobile/` structure
- ✅ Set up NPM workspaces
- ✅ Created shared packages:
  - `packages/shared-types/` - Common TypeScript types
  - `packages/api-client/` - Supabase API wrappers
  - `packages/config/` - Shared configuration

### 2. Expo Mobile App
- ✅ Initialized Expo app with Expo Router
- ✅ Created authentication screens (login, register, forgot-password)
- ✅ Built course browsing and detail screens
- ✅ Implemented video player with Expo Video
- ✅ Set up AuthContext with Supabase
- ✅ Configured environment variables (.env.local)
- ✅ Added Stripe test keys

### 3. Vercel Deployment
- ✅ Fixed monorepo deployment configuration
- ✅ Moved build dependencies to production dependencies:
  - tailwindcss, autoprefixer, postcss
  - typescript, eslint, @types/* packages
  - jest, @playwright/test
- ✅ Excluded test configs from Next.js build (tsconfig.json)
- ✅ Successfully deployed web app to Vercel preview
- ✅ **Preview URL:** https://therabrake-academy-i18r73up6-cadmp2025s-projects.vercel.app

### 4. Git Management
- ✅ All changes committed and pushed to `feature/course-builder` branch
- ✅ Created deployment script: `deploy-feature-course-builder.ps1`
- ✅ Total commits: 15+ on feature branch

---

## ⚠️ **Known Issues**

### Mobile App - Expo Go Compatibility
**Problem:** App loads but shows blank screen on iPhone with Expo Go

**Root Cause:** 
- Expo Go on iOS always uses React Native's New Architecture (Fabric)
- Current React Native 0.81.5 + Expo Router has compatibility issues with Fabric
- Error: `TypeError: Cannot read property 'S' of undefined` in ReactFabric-dev.js

**Attempted Fixes:**
- ✅ Disabled New Architecture in app.json (didn't work - Expo Go overrides)
- ✅ Re-enabled New Architecture (still errors)
- ✅ Simplified root layout (removed ThemeProvider, fonts, splash screen)
- ❌ Expo Go fundamentally incompatible with current setup

**Solution Required:**
- Need custom development build (not Expo Go)
- Set up EAS Build for iOS simulator/device
- Alternative: Test web version first (`npx expo start` → press `w`)

---

## 📋 **Next Steps**

### Immediate (Next Session)

#### Option A: EAS Build Setup (Recommended for Mobile Testing)
```bash
cd apps/mobile
eas build:configure  # Already done
eas build --profile development --platform ios
# Download .app file and install on simulator
```

#### Option B: Test Web Version First
```bash
cd apps/mobile
npx expo start
# Press 'w' to open in browser
# Verify all functionality works
```

#### Option C: Continue with Web Platform
- Skip mobile testing for now
- Focus on implementing new features on web
- Return to mobile later with custom build

### Medium Priority

1. **Cloudflare R2 Integration** (Video Storage)
   - Install `@aws-sdk/client-s3`
   - Set up R2 bucket
   - Create upload API endpoint
   - Migrate existing videos
   - Cost: ~$2-5/month (vs current Supabase storage)

2. **Firebase Integration** (Push Notifications)
   - Install Firebase SDK
   - Set up Cloud Messaging
   - Create notification system for:
     - New course releases
     - Lesson updates
     - CE renewal reminders
   - Cost: Free tier sufficient

3. **Custom Discussion Forum**
   - Create Supabase tables (discussions, replies)
   - Build forum UI components
   - Add moderation tools
   - Implement reporting system

4. **Google Cloud TTS** (Audio Lessons)
   - Set up Google Cloud account
   - Install `@google-cloud/text-to-speech`
   - Create audio generation API
   - Add audio player to course screens
   - Cost: $4 per 1M characters

### Long-term

1. **GDPR/CCPA Compliance**
   - Data export endpoint
   - Account deletion flow
   - Consent logging
   - Privacy policy updates

2. **Analytics Dashboard**
   - Firebase Analytics integration
   - Metabase setup
   - Track: enrollments, completions, churn

3. **Email Marketing**
   - ConvertKit/ActiveCampaign integration
   - Drip campaigns
   - CE renewal reminders

---

## 🏗️ **Current Architecture**

### Monorepo Structure
```
therabrake.academy/
├── apps/
│   ├── web/                    # Next.js 14.2.33 (deployed)
│   │   ├── app/               # App Router
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities, Supabase client
│   │   └── package.json       # Web dependencies
│   └── mobile/                # Expo ~54.0.0 (in progress)
│       ├── app/               # Expo Router screens
│       ├── contexts/          # AuthContext
│       ├── lib/               # Supabase client
│       └── package.json       # Mobile dependencies
├── packages/
│   ├── shared-types/          # Common TypeScript types
│   ├── api-client/            # Supabase API wrappers
│   └── config/                # Shared configuration
└── package.json               # Root workspace config
```

### Tech Stack
| Category | Current Tool | Status |
|----------|-------------|---------|
| **Frontend Web** | Next.js 14.2.33 | ✅ Production |
| **Frontend Mobile** | Expo ~54.0.0 | ⚠️ Needs EAS Build |
| **Database** | Supabase (PostgreSQL) | ✅ Active |
| **Auth** | Supabase Auth | ✅ Active |
| **Storage** | Supabase Storage | ✅ Active |
| **Payments** | Stripe | ✅ Active |
| **Search** | MeiliSearch | ✅ Active |
| **Video Player** | Expo Video, native HTML5 | ✅ Active |
| **Deployment** | Vercel | ✅ Active |
| **Video Storage** | Supabase Storage | 🔄 Migrate to R2 |
| **Push Notifications** | None | 📝 Add Firebase |
| **Audio/TTS** | None | 📝 Add Google Cloud |
| **Forums** | None | 📝 Build custom |

---

## 📦 **Environment Variables**

### Required for Development

**apps/web/.env.local:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://zjoncglqxfcmmljwmoma.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_***
STRIPE_SECRET_KEY=sk_test_***
MEILISEARCH_HOST=<host>
MEILISEARCH_API_KEY=<key>
```

**apps/mobile/.env.local:**
```bash
EXPO_PUBLIC_SUPABASE_URL=https://zjoncglqxfcmmljwmoma.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<key>
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_***
STRIPE_EXPO_TEST_SECRET_KEY=sk_test_***
```

### To Add (Next Phase)

```bash
# Cloudflare R2
R2_ACCESS_KEY_ID=<key>
R2_SECRET_ACCESS_KEY=<secret>
R2_BUCKET_NAME=therabrake-videos
CLOUDFLARE_ACCOUNT_ID=<id>

# Firebase
FIREBASE_PROJECT_ID=<id>
FIREBASE_PRIVATE_KEY=<key>
FIREBASE_CLIENT_EMAIL=<email>

# Google Cloud TTS
GOOGLE_CLOUD_PROJECT_ID=<id>
GOOGLE_CLOUD_KEY=<key>
```

---

## 🚀 **Quick Start Commands**

### Development

```bash
# Web app
cd apps/web
npm run dev          # Port 3001

# Mobile app
cd apps/mobile
npx expo start       # Port 8081
# Press 'w' for web, 'a' for Android, 'i' for iOS

# Full stack
npm run dev          # Runs both (from root)
```

### Deployment

```bash
# Web (Vercel)
vercel --yes                                    # Preview
vercel --prod                                   # Production

# Mobile (EAS Build)
cd apps/mobile
eas build --profile development --platform ios  # Dev build
eas build --profile preview --platform ios      # Preview
eas build --profile production --platform ios   # Production
```

---

## 📝 **Important Files Modified Today**

1. **Root Configuration**
   - `package.json` - NPM workspaces setup
   - `vercel.json` - Monorepo deployment config
   - `migrate-to-monorepo.ps1` - Migration script
   - `deploy-feature-course-builder.ps1` - Deployment automation

2. **Web App**
   - `apps/web/package.json` - Moved dev dependencies to dependencies
   - `apps/web/tsconfig.json` - Excluded test configs from build
   - `apps/web/next.config.js` - Monorepo-aware config

3. **Mobile App**
   - `apps/mobile/app.json` - Expo configuration, New Architecture enabled
   - `apps/mobile/app/_layout.tsx` - Simplified root layout
   - `apps/mobile/lib/supabase.ts` - Supabase client with SecureStore
   - `apps/mobile/contexts/AuthContext.tsx` - Authentication provider
   - All screen files in `app/(auth)/`, `app/(tabs)/`, `app/courses/`, `app/learn/`

4. **Shared Packages**
   - `packages/shared-types/src/database.types.ts` - Database types
   - `packages/shared-types/src/common.ts` - Common types
   - `packages/api-client/src/*` - API wrappers (auth, courses, certificates, progress)

---

## 💾 **Backup & Recovery**

### Git Branches
- **main** - Stable production code (pre-monorepo)
- **feature/course-builder** - Current work (monorepo + mobile app)

### To Restore Previous State
```bash
# If needed, revert to pre-monorepo state
git checkout main

# To continue current work
git checkout feature/course-builder
```

### Important Commits
- `5c8c5d5d` - Initial monorepo migration
- `273d67fe` - Final Vercel deployment fix
- `1bf0b3c9` - Latest on feature/course-builder

---

## 🎯 **Success Criteria**

### Phase 1: Mobile App (Current)
- [ ] EAS Build configured and working
- [ ] iOS simulator build generated
- [ ] Authentication flow tested
- [ ] Course browsing functional
- [ ] Video playback working
- [ ] Profile screen operational

### Phase 2: Video Migration
- [ ] Cloudflare R2 bucket created
- [ ] Upload API endpoint built
- [ ] Existing videos migrated
- [ ] Signed URL generation working
- [ ] Cost reduced to ~$5/month

### Phase 3: Engagement Features
- [ ] Firebase Cloud Messaging integrated
- [ ] Push notifications working (iOS + Android)
- [ ] Custom forum built and deployed
- [ ] Google Cloud TTS audio generation
- [ ] Audio player in course screens

---

## 📞 **Resources & Links**

- **Vercel Preview:** https://therabrake-academy-i18r73up6-cadmp2025s-projects.vercel.app
- **GitHub Repo:** https://github.com/CADMP2025/therabrake.academy
- **Supabase Project:** https://zjoncglqxfcmmljwmoma.supabase.co
- **Stripe Dashboard:** https://dashboard.stripe.com
- **EAS Dashboard:** https://expo.dev

---

## 💡 **Notes for Next Session**

1. **Mobile app is blocked** on Expo Go compatibility
   - Decide: EAS Build or test web version first
   - EAS Build takes ~15-20 min to complete
   - Web version should work immediately

2. **Web app is fully deployed** and working
   - Can start adding new features to web
   - Mobile can catch up later

3. **Cloudflare R2 migration** should be next priority
   - Significant cost savings
   - Easy implementation (S3-compatible)
   - Better performance with CDN

4. **Consider Firebase** for push notifications
   - Free tier sufficient
   - Easy integration with existing Supabase auth
   - Critical for user engagement

---

**End of Progress Report**
