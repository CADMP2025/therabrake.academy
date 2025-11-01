# TheraBrake Academy - Development Progress

**Last Updated:** October 31, 2025  
**Current Branch:** feature/course-builder  
**Status:** Web development - Adding new features

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

### Immediate (Current Focus) - Web Platform Development

**Decision Made:** Continue with web development, return to mobile app later with EAS Build.

#### Priority 1: Cloudflare R2 Integration (Video Storage Migration)
**Goal:** Reduce storage costs and improve video delivery performance

```bash
# Install dependencies
cd apps/web
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# Setup steps:
1. Create Cloudflare R2 bucket
2. Configure CORS policies
3. Create upload API endpoint (app/api/video/upload/route.ts)
4. Build admin migration tool
5. Update video URLs in database
6. Test playback with signed URLs
```

**Benefits:**
- Cost: ~$2-5/month (vs current Supabase storage)
- Better CDN performance
- Unlimited egress (Cloudflare doesn't charge)

#### Priority 2: Enhanced Course Builder
**Goal:** Complete the course builder feature for instructors

**Features to Add:**
- [ ] Drag-and-drop lesson reordering
- [ ] Bulk video upload
- [ ] Course preview mode
- [ ] Quiz creation interface
- [ ] Resource attachment manager
- [ ] Course analytics dashboard

#### Priority 3: Firebase Integration (Push Notifications)
**Goal:** Improve user engagement with notifications

```bash
# Install Firebase
cd apps/web
npm install firebase firebase-admin

# Setup:
1. Create Firebase project
2. Enable Cloud Messaging
3. Add service worker for web push
4. Create notification API endpoints
5. Build notification preferences UI
```

**Use Cases:**
- New course releases
- Lesson updates
- CE renewal reminders
- Forum replies
- Instructor announcements

#### Priority 4: Offline Download Manager
**Goal:** Enable students to download course content for offline access

**Status:** Planning & Architecture Complete ✅  
**Documentation:** `docs/developers/OFFLINE_DOWNLOAD_MANAGER.md`

**Implementation Time:** 52-65 hours over 4 weeks

**Key Features:**
- Priority-based download queue
- Background downloads with pause/resume
- Smart storage management (auto-cleanup, quota checks)
- WiFi-only option
- Offline sync with conflict resolution
- Quality selection (low/medium/high)
- Expiration handling

**Tech Stack:**
- **Web:** IndexedDB + Service Workers + Workbox
- **Mobile:** Expo FileSystem + SQLite + Background Fetch
- **Backend:** Supabase tables for sync + Cloudflare R2 for videos

**Packages Required:**
```bash
# Web
npm install idb workbox-webpack-plugin workbox-strategies comlink

# Mobile  
npm install expo-file-system expo-sqlite @react-native-async-storage/async-storage
```

#### Priority 5: Custom Discussion Forum
**Goal:** Build community engagement features

**Database Tables to Create:**
```sql
-- In Supabase
discussions (id, course_id, user_id, title, content, created_at)
discussion_replies (id, discussion_id, user_id, content, created_at)
discussion_likes (user_id, discussion_id)
discussion_reports (id, discussion_id, user_id, reason)
```

**Features:**
- Course-specific discussions
- Nested replies
- Like/upvote system
- Instructor highlighting
- Moderation tools
- Email notifications

### Medium Priority (After Core Features)

1. **Google Cloud TTS** (Audio Lessons)
   - Set up Google Cloud account
   - Install `@google-cloud/text-to-speech`
   - Create audio generation API
   - Add audio player to course screens
   - Cost: $4 per 1M characters

2. **Advanced Search**
   - Enhance MeiliSearch integration
   - Add filters (price, duration, difficulty)
   - Implement autocomplete
   - Add search analytics

3. **Instructor Dashboard Enhancements**
   - Revenue analytics
   - Student progress tracking
   - Course performance metrics
   - Automated insights

### Mobile App (Deferred to Later Phase)

**When to Return:**
- After core web features are complete
- Set up EAS Build for custom development builds
- Test on iOS simulator and physical devices
- Current code is ready - just needs proper build environment

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

1. **Focus on web platform development**
   - Mobile app deferred until later (EAS Build required)
   - Web app is fully functional and deployed
   - Priority: Add high-value features

2. **Start with Cloudflare R2 migration**
   - Immediate cost savings
   - Improves video performance
   - Relatively quick implementation (~2-3 hours)

3. **Course builder enhancements** are critical
   - Enables instructors to create content independently
   - Reduces admin workload
   - Key for platform scaling

4. **Firebase setup** for push notifications
   - Major engagement driver
   - Free tier sufficient
   - Works alongside Supabase

5. **Mobile app will resume** once:
   - Core web features complete
   - EAS Build environment set up
   - More time allocated for native mobile development

---

**End of Progress Report**
