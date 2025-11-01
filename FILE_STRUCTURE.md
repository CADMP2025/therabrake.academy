# TheraBrake Academy — Monorepo File Structure

**Updated:** November 1, 2025  
**Branch:** feature/course-builder  
**Architecture:** NPM Workspaces Monorepo

---

## Overview

TheraBrake Academy has been migrated to a **monorepo structure** using NPM workspaces. This allows for:
- Shared code between web and mobile platforms
- Unified dependency management
- Better code organization and reusability
- Independent deployment of web and mobile apps

---

## Root Structure

```
therabrake.academy/
├── .git/                           # Git repository data
├── .gitignore                      # Git ignore rules
├── .npmrc                          # NPM configuration
├── app.json                        # Legacy app configuration
├── deploy-feature-course-builder.ps1 # Feature branch deployment script
├── fix-dynamic-routes.ps1          # Dynamic route fix script
├── migrate-to-monorepo.ps1         # Monorepo migration script
├── MONOREPO_SETUP.md               # Monorepo setup documentation
├── MONOREPO_SUMMARY.md             # Monorepo migration summary
├── package.json                    # Root workspace configuration
├── package-lock.json               # Root dependency lock file
├── PROGRESS.md                     # Development progress tracker
├── QUICK_START.md                  # Quick start guide
├── README.md                       # Project documentation
├── tsconfig.json                   # Root TypeScript configuration
├── vercel.json                     # Vercel deployment configuration
│
├── apps/                           # Application workspaces
│   ├── web/                        # Next.js web application
│   └── mobile/                     # Expo/React Native mobile app
│
├── packages/                       # Shared packages
│   ├── shared-types/               # Common TypeScript types
│   ├── api-client/                 # Supabase API wrappers
│   └── config/                     # Shared configuration
│
├── components/                     # Shared React components (legacy, to be moved)
├── hooks/                          # Shared React hooks (legacy, to be moved)
├── lib/                            # Shared utilities (legacy, to be moved)
├── utils/                          # Utility functions (legacy, to be moved)
├── types/                          # Type definitions (legacy, to be moved)
├── app/                            # Legacy Next.js app directory (migrated to apps/web)
├── courses/                        # Course import system
├── docs/                           # Documentation
├── public/                         # Static assets (shared)
├── scripts/                        # Deployment & utility scripts
├── supabase/                       # Database configuration & migrations
├── tests/                          # E2E and integration tests
└── playwright-report/              # Test reports
```

---

## Apps Directory

### apps/web/ (Next.js 14.2.33)

**Status:** ✅ Deployed to Vercel  
**Port:** 3001 (dev)  
**URL:** https://therabrake-academy-i18r73up6-cadmp2025s-projects.vercel.app

```
apps/web/
├── .env.local                      # Web environment variables (git-ignored)
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Web-specific git ignores
├── AUTH_IMPLEMENTATION.md          # Authentication documentation
├── BATCH_*.md                      # Batch completion notes
├── components.json                 # shadcn/ui configuration
├── deploy-feature-branch.ps1       # Feature deployment script
├── deploy-feature-branch.sh        # Feature deployment script (bash)
├── deploy-production.sh            # Production deployment
├── EMAIL_WORKFLOW_VERIFIED.md      # Email system docs
├── FILE_STRUCTURE.md               # Web-specific file structure (legacy)
├── middleware.config.ts            # Middleware configuration
├── middleware.ts                   # Next.js middleware
├── next.config.js                  # Next.js configuration
├── next-env.d.ts                   # Next.js TypeScript definitions
├── package.json                    # Web dependencies
├── package-lock.json               # Web dependency lock
├── playwright.config.ts            # Playwright E2E configuration
├── postcss.config.js               # PostCSS configuration
├── README.md                       # Web app documentation
├── sentry.client.config.ts         # Sentry client config
├── sentry.edge.config.ts           # Sentry edge config
├── sentry.server.config.ts         # Sentry server config
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── vercel.json                     # Vercel deployment config
│
├── .next/                          # Next.js build output (git-ignored)
├── node_modules/                   # NPM dependencies (git-ignored)
│
├── app/                            # Next.js App Router
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home page
│   ├── error.tsx                   # Error boundary
│   ├── global-error.tsx            # Global error handler
│   ├── icon.svg                    # App icon
│   │
│   ├── (dashboard)/                # Dashboard route group
│   │   └── instructor/
│   │       ├── affiliate/
│   │       └── course-builder/
│   │
│   ├── about/
│   ├── admin/
│   │   ├── certificates/
│   │   ├── security/
│   │   └── verification-logs/
│   │
│   ├── api/                        # API routes
│   │   ├── activity/
│   │   ├── auth/                   # Authentication endpoints
│   │   │   ├── log-event/
│   │   │   ├── login/
│   │   │   ├── magic-link/
│   │   │   ├── mfa/
│   │   │   │   ├── challenge/
│   │   │   │   ├── enroll/
│   │   │   │   ├── recovery/
│   │   │   │   └── trusted-devices/
│   │   │   ├── password-reset/
│   │   │   ├── sessions/
│   │   │   └── verify-email/
│   │   ├── certificates/
│   │   │   ├── download/
│   │   │   ├── generate/
│   │   │   ├── list/
│   │   │   ├── request-mail/
│   │   │   ├── revoke/
│   │   │   └── verify/
│   │   ├── courses/
│   │   │   ├── featured/
│   │   │   └── popular/
│   │   ├── dashboard/
│   │   │   └── enrollments/
│   │   ├── email/
│   │   │   ├── cron/
│   │   │   ├── quiz-result/
│   │   │   └── test/
│   │   ├── enrollment/
│   │   │   ├── check-access/
│   │   │   ├── extend/
│   │   │   ├── history/
│   │   │   └── status/
│   │   ├── health/
│   │   ├── notes/
│   │   ├── progress/
│   │   │   ├── dashboard/
│   │   │   └── video/
│   │   ├── public/
│   │   │   └── verify/
│   │   ├── purchase/
│   │   │   ├── course/
│   │   │   ├── extend/
│   │   │   ├── gift/
│   │   │   ├── membership/
│   │   │   ├── pricing/
│   │   │   ├── program/
│   │   │   └── validate-promo/
│   │   ├── quiz/
│   │   │   ├── attempt/
│   │   │   ├── attempts/
│   │   │   ├── questions/
│   │   │   └── submit/
│   │   ├── resources/
│   │   │   └── track/
│   │   ├── search/
│   │   │   └── courses/
│   │   ├── stripe/
│   │   │   ├── create-checkout/
│   │   │   ├── create-checkout-session/
│   │   │   └── webhook/
│   │   ├── support/
│   │   ├── transcripts/
│   │   ├── verify-certificate/
│   │   └── webhooks/
│   │       ├── certificate-generated/
│   │       ├── enrollment-created/
│   │       └── stripe/
│   │
│   ├── auth/                       # Authentication pages
│   │   ├── layout.tsx
│   │   ├── forgot-password/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── become-instructor/
│   ├── checkout/
│   │   └── leap-launch/
│   ├── contact/
│   ├── courses/
│   │   ├── [id]/
│   │   ├── catalog/
│   │   ├── leap-launch/
│   │   ├── personal/
│   │   ├── premium/
│   │   ├── professional/
│   │   ├── search/
│   │   └── so-what-mindset/
│   ├── dashboard/
│   ├── enrollment/
│   │   └── success/
│   ├── instructor/
│   │   ├── affiliate-links/
│   │   └── earnings/
│   ├── learn/
│   │   └── [courseId]/
│   │       └── [lessonId]/
│   ├── pricing/
│   ├── privacy/
│   ├── quiz/
│   │   └── [id]/
│   │       └── results/
│   │           └── [attemptId]/
│   ├── refund-policy/
│   ├── student/
│   │   └── certificates/
│   │       └── [id]/
│   ├── support/
│   ├── terms/
│   ├── test-course-builder/
│   └── verify/
│
├── components/                     # React components
│   ├── Providers.tsx
│   ├── course/
│   │   ├── CERequirements.tsx
│   │   ├── CourseBuilder.tsx
│   │   ├── CourseCard.tsx
│   │   ├── EnhancedQuizBuilder.tsx
│   │   ├── IntegratedCourseBuilder.tsx
│   │   └── TipTapEditor.tsx
│   ├── course-builder/
│   │   ├── ContentParser.tsx
│   │   ├── CourseBuilder.tsx
│   │   ├── LessonEditor.tsx
│   │   ├── ModuleOrganizer.tsx
│   │   ├── PreviewPanel.tsx
│   │   └── index.ts
│   ├── courses/
│   │   └── CourseEnrollButton.tsx
│   ├── dashboard/
│   │   └── ProgressWidget.tsx
│   ├── enrollment/
│   │   └── AuthenticatedEnrollButton.tsx
│   ├── instructor/
│   │   └── AffiliateLinksManager.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── learn/
│   │   └── VideoPlayer.tsx
│   ├── quiz/
│   │   ├── QuizPlayer.tsx
│   │   └── QuizResults.tsx
│   ├── shared/
│   │   ├── Breadcrumbs.tsx
│   │   ├── CardLayouts.tsx
│   │   ├── DataTable.tsx
│   │   ├── FileUpload.tsx
│   │   ├── FormField.tsx
│   │   └── Toast.tsx
│   ├── student/
│   │   └── CertificateCard.tsx
│   ├── support/
│   │   └── SupportChatbot.tsx
│   └── ui/                         # shadcn/ui components
│       ├── accordion.tsx
│       ├── alert.tsx
│       ├── alert-dialog.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── empty-state.tsx
│       ├── error-boundary.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── modal.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── skeleton.tsx
│       ├── spinner.tsx
│       ├── status-badge.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       └── toast.tsx
│
├── lib/                            # Backend utilities & services
│   ├── utils.ts
│   ├── auth/
│   │   ├── magic-link.ts
│   │   ├── password-reset.ts
│   │   ├── session-manager.ts
│   │   └── mfa/
│   │       ├── authenticator.ts
│   │       ├── recovery.ts
│   │       └── trusted-devices.ts
│   ├── certificates/
│   │   ├── generators/
│   │   ├── storage/
│   │   ├── validators/
│   │   └── types.ts
│   ├── compliance/
│   ├── email/
│   │   ├── email-service.ts
│   │   └── templates.ts
│   ├── monitoring/
│   ├── parsers/
│   ├── quiz/
│   ├── resources/
│   ├── search/
│   ├── security/
│   ├── services/
│   ├── stripe/
│   │   └── webhook-handler.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── utils/
│
└── public/                         # Static assets
    ├── images/
    │   └── logo/
    ├── file.svg
    ├── globe.svg
    └── window.svg
```

---

### apps/mobile/ (Expo ~54.0.0)

**Status:** ⚠️ Needs EAS Build (deferred)  
**Port:** 8081 (dev)

```
apps/mobile/
├── .env.local                      # Mobile environment variables (git-ignored)
├── .gitignore                      # Mobile-specific git ignores
├── app.json                        # Expo app configuration
├── eas.json                        # EAS Build configuration
├── package.json                    # Mobile dependencies
├── README.md                       # Mobile app documentation
├── tsconfig.json                   # TypeScript configuration
│
├── .expo/                          # Expo cache (git-ignored)
├── node_modules/                   # NPM dependencies (git-ignored)
│
├── app/                            # Expo Router screens
│   ├── _layout.tsx                 # Root layout
│   ├── index.tsx                   # Home screen
│   │
│   ├── (auth)/                     # Auth screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   │
│   ├── (tabs)/                     # Tab navigation
│   │   ├── _layout.tsx
│   │   ├── index.tsx               # Dashboard
│   │   ├── courses.tsx             # Course catalog
│   │   ├── profile.tsx             # User profile
│   │   └── certificates.tsx        # Certificate list
│   │
│   ├── courses/
│   │   └── [id].tsx                # Course detail screen
│   │
│   └── learn/
│       └── [courseId]/
│           └── [lessonId].tsx      # Lesson player
│
├── assets/                         # Mobile assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── components/                     # Mobile-specific components
│   ├── auth/
│   ├── course/
│   ├── learn/
│   └── shared/
│
├── contexts/                       # React contexts
│   └── AuthContext.tsx             # Authentication context
│
├── lib/                            # Mobile utilities
│   ├── supabase.ts                 # Supabase client with SecureStore
│   └── utils.ts
│
└── constants/                      # Constants
    ├── Colors.ts
    └── Config.ts
```

---

## Packages Directory (Shared Code)

### packages/shared-types/

**Purpose:** Common TypeScript types shared between web and mobile

```
packages/shared-types/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                    # Barrel export
    ├── database.types.ts           # Supabase database types
    ├── common.ts                   # Common types (User, Course, etc.)
    └── api.ts                      # API request/response types
```

**Key Types:**
- `User`, `Profile`, `Session`
- `Course`, `Lesson`, `Module`
- `Quiz`, `Question`, `Answer`
- `Certificate`, `Enrollment`
- `Progress`, `Note`, `Resource`

---

### packages/api-client/

**Purpose:** Supabase API wrappers for consistent data access

```
packages/api-client/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                    # Barrel export
    ├── auth.ts                     # Authentication APIs
    ├── courses.ts                  # Course APIs
    ├── enrollment.ts               # Enrollment APIs
    ├── progress.ts                 # Progress tracking APIs
    ├── certificates.ts             # Certificate APIs
    ├── quiz.ts                     # Quiz APIs
    └── utils.ts                    # Helper functions
```

**Example APIs:**
- `getCourses()`, `getCourseById(id)`
- `enrollInCourse(userId, courseId)`
- `updateProgress(userId, lessonId, progress)`
- `generateCertificate(userId, courseId)`

---

### packages/config/

**Purpose:** Shared configuration constants

```
packages/config/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                    # Barrel export
    ├── constants.ts                # App constants
    ├── endpoints.ts                # API endpoints
    └── features.ts                 # Feature flags
```

---

## Shared Directories (Root Level)

### docs/

**Purpose:** User, developer, and DevOps documentation

```
docs/
├── users/
│   ├── student-guide.md
│   ├── instructor-guide.md
│   ├── admin-guide.md
│   ├── troubleshooting.md
│   └── video-tutorials.md
│
├── developers/
│   ├── api-reference.md
│   ├── database-schema.md
│   ├── deployment.md
│   ├── migrations.md
│   ├── disaster-recovery.md
│   ├── ui-architecture.md
│   ├── OFFLINE_DOWNLOAD_MANAGER.md      # Offline downloads guide
│   └── OFFLINE_DOWNLOAD_QUICK_START.md  # Quick start for offline
│
└── devops/
    ├── infrastructure-setup.md
    ├── monitoring-alerting.md
    ├── backups.md
    ├── domains-email.md
    └── cdn-video.md
```

---

### courses/

**Purpose:** Legacy course import system

```
courses/
├── metadata.csv                    # Course metadata
└── import/                         # 44 Word documents
    ├── Addiction Counseling Fundamentals 8 hours CEU.docx
    ├── Advanced Ethics in Digital Age Counseling 4 hour CEU.docx
    ├── EMDR Level 1 Training Part One 7.5 CEU hours.docx
    ├── Leap and Launch How To Build Your Private Practice.docx
    └── ... (40 more courses)
```

---

### supabase/

**Purpose:** Database configuration and migrations

```
supabase/
└── migrations/
    ├── 001_course_builder.sql
    ├── 20250106_001_complete_audit_system.sql
    ├── 20250106_002_data_retention.sql
    ├── 20250106_003_security_incidents.sql
    ├── 20250106_004_field_encryption.sql
    ├── 20250106_005_security_monitoring.sql
    ├── 20250106_006_compliance_workflows.sql
    ├── 20251009175842_create_certificate_audit_log.sql
    ├── 20241028_add_email_logs.sql
    ├── 20241028_add_progress_features.sql
    ├── 20241029_add_was_email_sent_recently.sql
    └── 20241030_fix_email_dedup_function.sql
```

---

### scripts/

**Purpose:** Deployment and utility scripts

```
scripts/
├── check-email-logs.sql
├── check-ui-case.js
├── import-legacy-courses.ts
├── import-remaining-courses.ts
├── phase2-security-setup.sh
├── security-audit.ts
├── test-certificate-generation.ts
├── test-course-player.sh
├── upload-stripe-products.ts
└── validate-security.ts
```

---

### tests/

**Purpose:** E2E and integration tests

```
tests/
├── e2e/
│   ├── smoke.spec.ts
│   └── security.spec.ts
├── fixtures/
│   └── test-users.ts
├── integration/
└── setup/
    ├── seed-test-data.ts
    └── cleanup-test-data.ts
```

---

## NPM Workspaces Configuration

### Root package.json

```json
{
  "name": "therabrake-academy",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=apps/web",
    "dev:web": "npm run dev --workspace=apps/web",
    "dev:mobile": "npm run start --workspace=apps/mobile",
    "build": "npm run build --workspace=apps/web",
    "build:web": "npm run build --workspace=apps/web",
    "test": "npm run test --workspace=apps/web",
    "lint": "npm run lint --workspace=apps/web"
  }
}
```

---

## Tech Stack by Platform

### Web Platform (apps/web/)

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js | 14.2.33 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 3.x |
| **UI Components** | shadcn/ui + Radix UI | Latest |
| **Database** | Supabase (PostgreSQL) | Latest |
| **Auth** | Supabase Auth | Latest |
| **Storage** | Supabase Storage | Latest |
| **Payments** | Stripe | Latest |
| **Search** | MeiliSearch | Latest |
| **Email** | Resend | Latest |
| **Monitoring** | Sentry | 8.34.0 |
| **Deployment** | Vercel | Latest |

### Mobile Platform (apps/mobile/)

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Expo | ~54.0.0 |
| **Language** | TypeScript | 5.x |
| **Navigation** | Expo Router | Latest |
| **Auth** | Supabase Auth + SecureStore | Latest |
| **Video** | Expo Video | Latest |
| **Storage** | Expo SecureStore | Latest |
| **Deployment** | EAS Build | Latest |

---

## Development Commands

### Web Development

```powershell
# Install dependencies
cd apps/web
npm install

# Start development server (port 3001)
npm run dev

# Build for production
npm run build

# Run tests
npm run test
npm run test:e2e

# Lint
npm run lint
```

### Mobile Development

```powershell
# Install dependencies
cd apps/mobile
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web

# EAS Build (when ready)
eas build --profile development --platform ios
```

### Shared Package Development

```powershell
# From root
npm install

# Work on a specific package
cd packages/shared-types
npm run build

# Link packages (automatic with workspaces)
npm install
```

---

## Environment Variables

### Web (.env.local)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://zjoncglqxfcmmljwmoma.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_***
STRIPE_SECRET_KEY=sk_test_***
MEILISEARCH_HOST=<host>
MEILISEARCH_API_KEY=<key>
RESEND_API_KEY=<key>
SENTRY_AUTH_TOKEN=<token>
```

### Mobile (.env.local)

```bash
EXPO_PUBLIC_SUPABASE_URL=https://zjoncglqxfcmmljwmoma.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<key>
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_***
```

---

## Migration Notes

### Monorepo Migration (October 31, 2025)

- ✅ Migrated from single Next.js app to monorepo structure
- ✅ Created `apps/web/` and `apps/mobile/` workspaces
- ✅ Set up shared packages (`shared-types`, `api-client`, `config`)
- ✅ Configured NPM workspaces in root `package.json`
- ✅ Updated Vercel deployment for monorepo structure
- ✅ Fixed build dependencies (moved dev deps to prod)
- ⚠️ Mobile app needs EAS Build (deferred to later phase)

### What's Next

1. **Cloudflare R2 Integration** - Migrate video storage
2. **Course Builder Enhancements** - Drag-and-drop, bulk upload
3. **Firebase Notifications** - Push notifications
4. **Offline Download Manager** - Download content for offline use
5. **Custom Discussion Forum** - Community features
6. **Mobile App Completion** - EAS Build and testing

---

## Key Features & Systems

### Authentication System
- Email/password authentication
- Magic link authentication
- Multi-factor authentication (TOTP)
- Session management with timeouts
- Trusted device management
- Password reset flow

### Course System
- Course catalog with search
- Video lessons with progress tracking
- Quizzes with instant feedback
- Certificate generation on completion
- Course builder for instructors
- Resource attachments

### Payment System
- Stripe checkout integration
- Webhook handling
- Subscription management
- Promo code validation
- Affiliate tracking

### Email System
- Automated onboarding emails
- Course completion notifications
- Payment receipts
- Reminder emails
- Transactional emails via Resend

### Security & Compliance
- PII field encryption (AES-256-GCM)
- FERPA, GDPR, PCI DSS compliance
- Comprehensive audit logging
- Security monitoring
- Role-based access control (RBAC)

---

## Notes

- **Monorepo Benefits:** Code sharing, unified tooling, better organization
- **NPM Workspaces:** No need for Lerna or Yarn workspaces
- **TypeScript:** Strict mode enabled for type safety
- **Shared Types:** Single source of truth for data structures
- **API Client:** Consistent data access patterns
- **Mobile Deferred:** Focus on web first, mobile later with EAS Build

---

**Last Updated:** November 1, 2025  
**Maintainer:** Development Team  
**Branch:** feature/course-builder
