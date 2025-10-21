# TheraBrake Academy — Workspace File Structure

**Updated:** October 20, 2025  
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
├── sentry.*.config.ts              # Sentry error monitoring configs
├── app/                            # Next.js App Router pages & layouts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── icon.svg
│   ├── (dashboard)/
│   │   └── instructor/
│   │       ├── affiliate/
│   │       │   └── page.tsx
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
│   │   ├── certificates/
│   │   │   └── route.ts
│   │   ├── courses/
│   │   │   ├── route.ts
│   │   │   ├── featured/
│   │   │   │   └── route.ts
│   │   │   └── popular/
│   │   │       └── route.ts
│   │   ├── email/
│   │   │   └── test/
│   │   │       └── route.ts
│   │   ├── health/
│   │   │   └── route.ts
│   │   ├── progress/
│   │   │   └── route.ts
│   │   ├── search/
│   │   │   └── courses/
│   │   │       └── route.ts
│   │   ├── stripe/
│   │   │   ├── create-checkout-session/
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
│   ├── instructor/
│   │   └── AffiliateLinksManager.tsx
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
├── courses/                        # Legacy course import system
│   ├── import/                     # 44 Word documents for CE & PD courses
│   │   ├── Addiction Counseling Fundamentals 8 hours CEU.docx
│   │   ├── Advanced Ethics in Digital Age Counseling 4 hour CEU.docx
│   │   ├── Advanced Private Practice Management.docx
│   │   ├── Art and Expressive Therapies Techniques.docx
│   │   ├── Building a Trauma Informed Practice and Telehealth.docx
│   │   ├── Business Ethics for Mental Health Professionals.docx
│   │   ├── Cancer Diagnosis Its not the end its just the beginning.docx
│   │   ├── Chronic Pain and Medical Psychology.docx
│   │   ├── Clinical Supervision Skills for New Supervisors.docx
│   │   ├── Co_Occurring Disorders Mental Health and Substance Use 6 Hours CEU.docx
│   │   ├── Complex PTSD and Developmental Trauma 8 Hour CEU.docx
│   │   ├── Credit Building and Debt Management Full Course.docx
│   │   ├── Crisis Intervention and De escalation Techniques.docx
│   │   ├── Cultural Competency Specific Populations.docx
│   │   ├── Cultural Diversity in Texas Counseling Practice CEU.docx
│   │   ├── Digital Mental Health Tools and Apps.docx
│   │   ├── Discovering the You after the We Comprehensive Course.docx
│   │   ├── EMDR Level 1 Training Part One 7.5 CEU hours.docx
│   │   ├── EMDR Level 1 Training Part Two 7.5 CEU hours.docx
│   │   ├── Eating Disorders Assessment and Treatment.docx
│   │   ├── Ethics for Professional Counselors.docx
│   │   ├── Family Systems and Structural Family Therapy.docx
│   │   ├── Financial Literacy Full Course.docx
│   │   ├── Finding the Perfect Match Course.docx
│   │   ├── GROUP THERAPY FACILITATION AND DEVELOPMENT.docx
│   │   ├── Gottman Method Couples Therapy Level One 12 hour CEU.docx
│   │   ├── Grief and Bereavement Counseling.docx
│   │   ├── Healing Forward A Comprehensive Course in Relationship Recovery and Personal Reclamation.docx
│   │   ├── Integrative and Holistic Treatment Approaches.docx
│   │   ├── Leadership in Mental Health Organizations.docx
│   │   ├── Leap and Launch How To Build Your Private Practice for Mental Health Professionals course.docx
│   │   ├── Legal Issues and Documentation for Counselors 4 hour CEU.docx
│   │   ├── Motivational Interviewing for Addiction Recovery.docx
│   │   ├── Neurofeedback and Brain.docx
│   │   ├── Play Therapy Fundamentals Parts 1 and 2 12 hour CEU.docx
│   │   ├── Rebuilding After Betrayal Comprehensive Online Course.docx
│   │   ├── Regulating the Storm Trauma Anger and the Brain CEU Course.docx
│   │   ├── Risk Management in Counseling CEU.docx
│   │   ├── Somatic Approaches to Trauma Recovery 6 hours CEU.docx
│   │   ├── Suicide Risk Assessment and Prevention 3 hour CEU.docx
│   │   ├── Telehealth in Counseling CEU.docx
│   │   ├── The So What Mindset Comprehensive Course.docx
│   │   ├── Working with LGBTQ.docx
│   │   └── Working with Military Veterans and PTSD.docx
│   └── metadata.csv                # Course metadata for import script
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
│   ├── check-email-logs.sql        # Email system verification queries
│   ├── import-legacy-courses.ts    # Legacy course import from Word docs
│   ├── import-remaining-courses.ts # Additional course import script
│   ├── phase2-security-setup.sh
│   ├── security/                   # Security setup scripts
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
- **Legacy Course Import** system with Word document parsing via mammoth
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

- **Expanded Legacy Course Import System:** Now includes 44 complete courses:
  - `courses/import/` - 44 Word documents (CE courses + Personal Development)
  - `courses/metadata.csv` - Complete course metadata configuration
  - `scripts/import-legacy-courses.ts` - Primary automated import script
  - `scripts/import-remaining-courses.ts` - Additional course import script
  - EMDR courses now split into Part 1 & 2 (7.5 CE hours each)
  - Added 8 personal development courses including relationship recovery, financial literacy, and self-discovery
- **Enhanced Email System:**
  - `app/api/email/test/route.ts` - Email service testing and verification
  - `scripts/check-email-logs.sql` - Email workflow verification queries
  - `EMAIL_WORKFLOW_VERIFIED.md` - Complete email system documentation
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
- **Complete Course Library:** 44 total courses including:
  - 36 professional CE courses (3-15 CE hours each)
  - 8 personal development courses
  - EMDR Level 1 split into two 7.5-hour parts
  - All CE courses are Texas LPC approved
- Import scripts use mammoth library to parse Word documents into HTML content
- Email system includes comprehensive testing and verification workflows
