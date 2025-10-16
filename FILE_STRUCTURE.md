# TheraBrake Academy — Workspace File Structure

**Updated:** October 16, 2025  
**Branch:** feature/course-builder

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
├── app/                            # Next.js App Router pages & layouts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── icon.svg
│   ├── (dashboard)/
│   │   └── instructor/
│   │       └── course-builder/
│   ├── (public)/
│   ├── about/
│   │   └── page.tsx
│   ├── admin/
│   │   └── page.tsx
│   ├── api/                        # API routes
│   │   ├── auth/
│   │   │   └── log-event/
│   │   ├── certificates/
│   │   ├── courses/
│   │   │   ├── route.ts
│   │   │   ├── featured/
│   │   │   └── popular/
│   │   ├── health/
│   │   │   └── route.ts
│   │   ├── progress/
│   │   │   └── route.ts
│   │   ├── search/
│   │   │   └── courses/
│   │   ├── stripe/
│   │   └── webhooks/
│   │       ├── certificate-generated/
│   │       └── enrollment-created/
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
│   │   │   └── so-what/
│   │   ├── professional/
│   │   │   └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   └── so-what-mindset/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── enrollment/
│   │   └── page.tsx
│   ├── instructor/
│   │   └── page.tsx
│   ├── learn/                      # course learning interface
│   │   └── [courseId]/
│   │       └── [lessonId]/
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
│   ├── admin/
│   ├── auth/
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
│   ├── dashboard/
│   │   └── ProgressWidget.tsx
│   ├── instructor/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── learn/
│   │   └── VideoPlayer.tsx
│   ├── quiz/
│   │   ├── QuizPlayer.tsx
│   │   └── QuizResults.tsx
│   ├── shared/
│   └── ui/                         # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── label.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       └── textarea.tsx
├── hooks/                          # React custom hooks
│   └── useSearch.ts
├── lib/                            # backend utilities & services
│   ├── certificates/
│   ├── compliance/
│   │   └── gdpr-functions.ts
│   ├── email/
│   │   ├── email-service.ts
│   │   ├── resend-client.ts
│   │   └── templates.ts
│   ├── monitoring/
│   ├── parsers/
│   │   └── content-parser.ts
│   ├── quiz/
│   │   └── grading.ts
│   ├── resources/
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
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils/
│       └── cn.ts
├── public/                         # static assets
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── certificate-templates/
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
│   ├── security/
│   ├── test-course-player.sh
│   ├── upload-stripe-products.ts
│   └── upload-stripe-products.ts.old
├── styles/
├── supabase/                       # database configuration
│   └── migrations/
│       ├── 001_course_builder.sql
│       ├── 20250106_001_complete_audit_system.sql
│       ├── 20250106_002_data_retention.sql
│       ├── 20250106_003_security_incidents.sql
│       └── 20251009175842_create_certificate_audit_log.sql
├── tests/                          # test files
│   ├── e2e/
│   │   ├── security/
│   │   └── smoke.spec.ts
│   ├── fixtures/
│   │   └── test-users.ts
│   └── setup/
│       └── seed-test-data.ts
├── types/                          # TypeScript definitions
│   └── course-builder/
│       └── index.ts
├── utils/
├── deploy-production.sh
├── fix-register.sh
├── quick-fix.sh
└── update-packages.sh
```

## Key Features

- **Next.js 14+** with App Router
- **API Routes** for courses, progress tracking, webhooks
- **Course Builder** with integrated quiz system
- **Learning Platform** with video player and progress tracking
- **Search** powered by MeiliSearch
- **Email** service with Resend
- **Database** with Supabase (PostgreSQL)
- **Security** monitoring and incident response
- **Testing** with Playwright E2E tests
- **Compliance** GDPR functions

## Notes

- Excludes build artifacts (`.next/`, `node_modules/`) from detailed view
- Environment files contain sensitive keys - ensure proper `.gitignore` configuration
- Migration files handle database schema and security setup
- Test suite covers E2E scenarios and security validation
