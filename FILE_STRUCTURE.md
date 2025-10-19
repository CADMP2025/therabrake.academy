# TheraBrake Academy — Workspace File Structure

**Updated:** October 19, 2025  
**Branch:** main

```
Root/
├── .env.*                          # environment configuration files
├── .git/                           # git repository data
├── .next/                          # Next.js build output
├── .vercel/                        # Vercel deployment config
├── FILE_STRUCTURE.md               # this file
├── README.md
├── package.json
├── tsconfig.json
├── next.config.js
├── middleware.ts
├── tailwind.config.ts
├── playwright.config.ts
├── vercel.json
├── sentry.*.config.ts              # Sentry error monitoring configs
├── app/                            # Next.js App Router pages & layouts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── icon.svg
│   ├── (dashboard)/
│   │   └── instructor/
│   │       └── course-builder/
│   │           └── page.tsx
│   ├── (public)/
│   ├── about/
│   │   └── page.tsx
│   ├── admin/
│   │   └── page.tsx
│   ├── api/                        # API routes
│   │   ├── auth/
│   │   │   └── log-event/
│   │   │       └── route.ts
│   │   ├── courses/
│   │   │   ├── route.ts
│   │   │   ├── featured/
│   │   │   │   └── route.ts
│   │   │   └── popular/
│   │   │       └── route.ts
│   │   ├── health/
│   │   │   └── route.ts
│   │   ├── progress/
│   │   │   └── route.ts
│   │   ├── search/
│   │   │   └── courses/
│   │   │       └── route.ts
│   │   ├── stripe/
│   │   │   ├── create-checkout/
│   │   │   │   └── route.ts
│   │   │   └── webhook/
│   │   │       └── route.ts
│   │   └── webhooks/
│   │       ├── certificate-generated/
│   │       │   └── route.ts
│   │       └── enrollment-created/
│   │           └── route.ts
│   ├── auth/
│   │   ├── layout.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── become-instructor/
│   │   └── page.tsx
│   ├── checkout/
│   │   └── leap-launch/
│   │       └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── courses/
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── leap-launch/
│   │   │   └── page.tsx
│   │   ├── personal/
│   │   │   └── page.tsx
│   │   ├── premium/
│   │   │   ├── page.tsx
│   │   │   ├── leap-launch/
│   │   │   │   └── page.tsx
│   │   │   └── so-what/
│   │   │       └── page.tsx
│   │   ├── professional/
│   │   │   └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   └── so-what-mindset/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── enrollment/
│   │   ├── EnrollmentContent.tsx
│   │   ├── page.tsx
│   │   └── success/
│   │       └── EnrollmentSuccessContent.tsx
│   ├── instructor/
│   │   └── page.tsx
│   ├── learn/                      # course learning interface
│   │   └── [courseId]/
│   │       └── [lessonId]/
│   │           └── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   ├── quiz/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── refund-policy/
│   │   └── page.tsx
│   ├── support/
│   │   └── page.tsx
│   ├── terms/
│   │   └── page.tsx
│   ├── test-course-builder/
│   │   └── page.tsx
│   └── tx-lpc-approved/
│       └── page.tsx
├── components/                     # React components by feature
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
│   ├── enrollment/
│   │   └── AuthenticatedEnrollButton.tsx
│   ├── dashboard/
│   │   └── ProgressWidget.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── learn/
│   │   └── VideoPlayer.tsx
│   ├── quiz/
│   │   ├── QuizPlayer.tsx
│   │   └── QuizResults.tsx
│   └── ui/                         # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── label.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       └── textarea.tsx
├── hooks/                          # React custom hooks
│   ├── useEnrollmentIntent.ts
│   └── useSearch.ts
├── lib/                            # backend utilities & services
│   ├── compliance/
│   │   └── gdpr-functions.ts
│   ├── email/
│   │   ├── email-service.ts
│   │   ├── resend-client.ts
│   │   └── templates.ts
│   ├── parsers/
│   │   └── content-parser.ts
│   ├── quiz/
│   │   └── grading.ts
│   ├── search/
│   │   ├── meilisearch-client.ts
│   │   ├── search-service.ts
│   │   ├── setup-index.ts
│   │   └── types.ts
│   ├── security/
│   │   ├── incident-response.ts
│   │   ├── input-sanitization.ts
│   │   └── validation.ts
│   ├── stripe/
│   │   └── config.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils/
│       └── cn.ts
├── public/                         # static assets
│   ├── images/
│   │   └── logo/
│   │       ├── favicon.ico
│   │       ├── logo.png
│   │       ├── logo-white.png
│   │       ├── therabrake-icon.png
│   │       ├── therabrake-icon.svg
│   │       ├── therabrake-logo.png
│   │       └── therabrake-logo.svg
│   ├── file.svg
│   ├── globe.svg
│   └── window.svg
├── scripts/                        # deployment & utility scripts
│   ├── phase2-security-setup.sh
│   ├── test-course-player.sh
│   ├── upload-stripe-products.ts
│   └── upload-stripe-products.ts.old
├── supabase/                       # database configuration
│   └── migrations/
│       ├── 001_course_builder.sql
│       ├── 20250106_001_complete_audit_system.sql
│       ├── 20250106_002_data_retention.sql
│       ├── 20250106_003_security_incidents.sql
│       └── 20251009175842_create_certificate_audit_log.sql
├── tests/                          # test files
│   ├── e2e/
│   │   └── smoke.spec.ts
│   ├── fixtures/
│   │   └── test-users.ts
│   └── setup/
│       └── seed-test-data.ts
├── types/                          # TypeScript definitions
│   └── course-builder/
│       └── index.ts
├── deploy-production.sh
├── fix-register.sh
├── quick-fix.sh
└── update-packages.sh
```

## Key Features

- **Next.js 14+** with App Router
- **API Routes** for courses, progress tracking, webhooks, and Stripe integration
- **Course Builder** with integrated quiz system
- **Learning Platform** with video player and progress tracking
- **Search** powered by MeiliSearch
- **Email** service with Resend
- **Database** with Supabase (PostgreSQL)
- **Security** monitoring and incident response
- **Testing** with Playwright E2E tests
- **Compliance** GDPR functions
- **Error Monitoring** with Sentry integration
- **Enrollment** success flow and payment processing

## Recent Additions

- Added Sentry configuration files for error monitoring
- Enhanced enrollment flow with dedicated content components:
  - `app/enrollment/EnrollmentContent.tsx`
  - `app/enrollment/success/EnrollmentSuccessContent.tsx`
  - `components/enrollment/AuthenticatedEnrollButton.tsx`
- Improved Stripe integration:
  - `app/api/stripe/create-checkout-session/route.ts`
  - `lib/stripe/config.ts`
- Course enrollment button component (`components/courses/CourseEnrollButton.tsx`)
- Enhanced API routes with proper file structure
- Additional React hooks (`useEnrollmentIntent.ts`)

## Notes

- Excludes build artifacts (`.next/`, `node_modules/`) from detailed view
- Environment files contain sensitive keys - ensure proper `.gitignore` configuration
- Migration files handle database schema and security setup
- Test suite covers E2E scenarios and security validation
