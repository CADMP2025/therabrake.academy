# TheraBrake Academy — Workspace File Structure

**Updated:** October 31, 2025  
**Branch:** feature/course-builder

```
Root/
├── .env.local                      # Local environment configuration
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignore rules
├── .npmrc                          # NPM configuration
├── AUTH_IMPLEMENTATION.md          # Authentication documentation
├── BATCH_2.1_COMPLETE.md           # Batch 2.1 completion notes
├── BATCH_2.2_COMPLETE.md           # Batch 2.2 completion notes
├── BATCH_3.1_COMPLETE.md           # Batch 3.1 completion notes
├── components.json                 # shadcn/ui configuration
├── deploy-production.sh            # Production deployment script
├── EMAIL_WORKFLOW_VERIFIED.md      # Email system documentation
├── FILE_STRUCTURE.md               # This file
├── fix-register.sh                 # Registration fix script
├── middleware.config.ts            # Middleware configuration
├── middleware.ts                   # Next.js middleware
├── next.config.js                  # Next.js configuration
├── next-env.d.ts                   # Next.js TypeScript definitions
├── package.json                    # NPM dependencies
├── package-lock.json               # NPM lock file
├── playwright.config.ts            # Playwright E2E test config
├── postcss.config.js               # PostCSS configuration
├── quick-fix.sh                    # Quick fix script
├── README.md                       # Project documentation
├── sentry.client.config.ts         # Sentry client config
├── sentry.edge.config.ts           # Sentry edge config
├── sentry.server.config.ts         # Sentry server config
├── tailwind.config.ts              # Tailwind CSS configuration
├── test.css                        # Test CSS file
├── TEST_MIGRATION_CHECKLIST.md     # Migration checklist
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.tsbuildinfo            # TypeScript build info
├── update-packages.sh              # Package update script
├── vercel.json                     # Vercel deployment config
├── .next/                          # Next.js build output (git-ignored)
├── .vercel/                        # Vercel deployment data (git-ignored)
├── node_modules/                   # NPM dependencies (git-ignored)
├── app/                            # Next.js App Router pages & layouts
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home page
│   ├── error.tsx                   # Error boundary
│   ├── global-error.tsx            # Global error handler
│   ├── icon.svg                    # App icon
│   ├── (dashboard)/                # Dashboard route group
│   │   └── instructor/
│   │       ├── affiliate/
│   │       │   └── page.tsx        # Affiliate management
│   │       └── course-builder/
│   │           └── page.tsx        # Course builder interface
│   ├── about/
│   │   └── page.tsx
│   ├── admin/
│   │   ├── page.tsx                # Admin dashboard
│   │   └── security/
│   │       └── page.tsx            # Security admin panel
│   ├── api/                        # API routes
│   │   ├── auth/                   # Authentication endpoints
│   │   │   ├── log-event/
│   │   │   │   └── route.ts        # Auth event logging
│   │   │   ├── login/
│   │   │   │   └── route.ts        # Login endpoint
│   │   │   ├── magic-link/
│   │   │   │   └── route.ts        # Magic link auth
│   │   │   ├── mfa/                # Multi-factor authentication
│   │   │   │   ├── challenge/
│   │   │   │   │   └── route.ts    # MFA challenge
│   │   │   │   ├── enroll/
│   │   │   │   │   └── route.ts    # MFA enrollment
│   │   │   │   ├── recovery/
│   │   │   │   │   └── route.ts    # MFA recovery
│   │   │   │   └── trusted-devices/
│   │   │   │       └── route.ts    # Trusted device management
│   │   │   ├── password-reset/
│   │   │   │   └── route.ts        # Password reset
│   │   │   ├── sessions/
│   │   │   │   └── route.ts        # Session management
│   │   │   └── verify-email/
│   │   │       └── route.ts        # Email verification
│   │   ├── certificates/           # Certificate management
│   │   │   ├── download/
│   │   │   │   └── route.ts        # Certificate download
│   │   │   ├── generate/
│   │   │   │   └── route.ts        # Certificate generation
│   │   │   ├── list/
│   │   │   │   └── route.ts        # List certificates
│   │   │   ├── request-mail/
│   │   │   │   └── route.ts        # Request certificate by mail
│   │   │   ├── revoke/
│   │   │   │   └── route.ts        # Revoke certificate
│   │   │   └── verify/
│   │   │       └── route.ts        # Verify certificate
│   │   ├── courses/
│   │   │   ├── route.ts            # Course CRUD operations
│   │   │   ├── featured/
│   │   │   │   └── route.ts        # Featured courses
│   │   │   └── popular/
│   │   │       └── route.ts        # Popular courses
│   │   ├── dashboard/
│   │   │   └── enrollments/
│   │   │       └── route.ts        # Dashboard enrollments
│   │   ├── email/                  # Email system
│   │   │   ├── cron/
│   │   │   │   └── route.ts        # Scheduled email jobs
│   │   │   ├── quiz-result/
│   │   │   │   └── route.ts        # Quiz result emails
│   │   │   └── test/
│   │   │       └── route.ts        # Email testing endpoint
│   │   ├── enrollment/
│   │   │   ├── check-access/
│   │   │   │   └── route.ts        # Check enrollment access
│   │   │   ├── extend/
│   │   │   │   └── route.ts        # Extend enrollment
│   │   │   ├── history/
│   │   │   │   └── route.ts        # Enrollment history
│   │   │   └── status/
│   │   │       └── route.ts        # Enrollment status
│   │   ├── health/
│   │   │   └── route.ts            # Health check endpoint
│   │   ├── notes/
│   │   │   └── route.ts            # Student notes
│   │   ├── progress/
│   │   │   ├── route.ts            # Progress tracking
│   │   │   ├── dashboard/
│   │   │   │   └── route.ts        # Progress dashboard data
│   │   │   └── video/
│   │   │       └── route.ts        # Video progress tracking
│   │   ├── public/
│   │   │   └── verify/
│   │   │       └── route.ts        # Public certificate verification
│   │   ├── purchase/               # Purchase endpoints
│   │   │   ├── course/
│   │   │   │   └── route.ts        # Purchase course
│   │   │   ├── extend/
│   │   │   │   └── route.ts        # Extend access
│   │   │   ├── gift/
│   │   │   │   └── route.ts        # Gift purchase
│   │   │   ├── membership/
│   │   │   │   └── route.ts        # Membership purchase
│   │   │   ├── pricing/
│   │   │   │   └── route.ts        # Pricing information
│   │   │   ├── program/
│   │   │   │   └── route.ts        # Program purchase
│   │   │   └── validate-promo/
│   │   │       └── route.ts        # Promo code validation
│   │   ├── quiz/                   # Quiz system
│   │   │   ├── attempt/
│   │   │   │   └── route.ts        # Start quiz attempt
│   │   │   ├── attempts/
│   │   │   │   └── route.ts        # List quiz attempts
│   │   │   ├── questions/
│   │   │   │   └── route.ts        # Get quiz questions
│   │   │   └── submit/
│   │   │       └── route.ts        # Submit quiz answers
│   │   ├── resources/
│   │   │   ├── route.ts            # Course resources
│   │   │   └── track/
│   │   │       └── route.ts        # Resource usage tracking
│   │   ├── search/
│   │   │   └── courses/
│   │   │       └── route.ts        # Course search
│   │   ├── sentry-example-api/
│   │   │   └── route.ts            # Sentry testing endpoint
│   │   ├── stripe/                 # Stripe integration
│   │   │   ├── create-checkout/
│   │   │   │   └── route.ts        # Create checkout session
│   │   │   ├── create-checkout-session/
│   │   │   │   └── route.ts        # Alternative checkout
│   │   │   ├── webhook/
│   │   │   │   └── route.ts        # Stripe webhook handler
│   │   │   └── webhooks/
│   │   │       └── route.ts        # Alternative webhook
│   │   ├── transcripts/
│   │   │   └── route.ts            # Video transcripts
│   │   ├── verify-certificate/
│   │   │   └── route.ts            # Certificate verification
│   │   └── webhooks/               # External webhooks
│   │       ├── certificate-generated/
│   │       │   └── route.ts        # Certificate generation webhook
│   │       ├── enrollment-created/
│   │       │   └── route.ts        # Enrollment webhook
│   │       └── stripe/
│   │           └── route.ts        # Stripe webhook alternative
│   ├── auth/                       # Authentication pages
│   │   ├── layout.tsx              # Auth layout
│   │   ├── forgot-password/
│   │   │   └── page.tsx            # Password reset page
│   │   ├── login/
│   │   │   └── page.tsx            # Login page
│   │   └── register/
│   │       └── page.tsx            # Registration page
│   ├── become-instructor/
│   │   └── page.tsx                # Instructor application
│   ├── checkout/
│   │   └── leap-launch/
│   │       └── page.tsx            # Leap Launch checkout
│   ├── contact/
│   │   └── page.tsx                # Contact form
│   ├── courses/                    # Course pages
│   │   ├── page.tsx                # Course catalog
│   │   ├── [id]/
│   │   │   └── page.tsx            # Individual course page
│   │   ├── leap-launch/
│   │   │   └── page.tsx            # Leap Launch course
│   │   ├── personal/
│   │   │   └── page.tsx            # Personal development courses
│   │   ├── premium/
│   │   │   ├── page.tsx            # Premium courses
│   │   │   ├── leap-launch/
│   │   │   │   └── page.tsx
│   │   │   └── so-what/
│   │   │       └── page.tsx
│   │   ├── professional/
│   │   │   ├── page.tsx            # Professional courses
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Dynamic professional course
│   │   ├── search/
│   │   │   └── page.tsx            # Course search page
│   │   └── so-what-mindset/
│   │       └── page.tsx            # So What Mindset course
│   ├── dashboard/
│   │   └── page.tsx                # Student dashboard
│   ├── enrollment/
│   │   ├── page.tsx                # Enrollment page
│   │   └── success/
│   │       └── page.tsx            # Enrollment success
│   ├── instructor/                 # Instructor pages
│   │   ├── page.tsx                # Instructor dashboard
│   │   ├── affiliate-links/
│   │   │   ├── route.ts            # Affiliate links API
│   │   │   └── [id]/
│   │   │       └── route.ts        # Individual link API
│   │   └── earnings/
│   │       └── page.tsx            # Earnings page
│   ├── learn/                      # Learning interface
│   │   └── [courseId]/
│   │       └── [lessonId]/
│   │           └── page.tsx        # Lesson player
│   ├── pricing/
│   │   └── page.tsx                # Pricing page
│   ├── privacy/
│   │   └── page.tsx                # Privacy policy
│   ├── quiz/                       # Quiz pages
│   │   └── [id]/
│   │       ├── page.tsx            # Quiz player
│   │       └── results/
│   │           └── [attemptId]/
│   │               └── page.tsx    # Quiz results
│   ├── refund-policy/
│   │   └── page.tsx                # Refund policy
│   ├── sentry-example-page/
│   │   └── page.tsx                # Sentry testing page
│   ├── student/                    # Student pages
│   │   ├── page.tsx                # Student dashboard
│   │   └── certificates/
│   │       ├── page.tsx            # Certificate list
│   │       └── [id]/
│   │           └── page.tsx        # Individual certificate
│   ├── support/
│   │   └── page.tsx                # Support page
│   ├── terms/
│   │   └── page.tsx                # Terms of service
│   ├── test-course-builder/
│   │   └── page.tsx                # Course builder test page
│   ├── test-professional/
│   │   └── page.tsx                # Professional test page
│   ├── tx-lpc-approved/
│   │   └── page.tsx                # Texas LPC approval info
│   └── verify/
│       └── page.tsx                # Email verification page
├── components/                     # React components by feature
│   ├── Providers.tsx               # React context providers
│   ├── course/
│   │   ├── CERequirements.tsx      # CE requirements display
│   │   ├── CourseBuilder.tsx       # Course builder component
│   │   ├── CourseCard.tsx          # Course card display
│   │   ├── EnhancedQuizBuilder.tsx # Enhanced quiz builder
│   │   ├── IntegratedCourseBuilder.tsx # Integrated course builder
│   │   └── TipTapEditor.tsx        # Rich text editor
│   ├── course-builder/
│   │   ├── ContentParser.tsx       # Parse course content
│   │   ├── CourseBuilder.tsx       # Main course builder
│   │   ├── LessonEditor.tsx        # Lesson editor component
│   │   ├── ModuleOrganizer.tsx     # Module organization
│   │   ├── PreviewPanel.tsx        # Preview panel
│   │   └── index.ts                # Course builder exports
│   ├── courses/
│   │   └── CourseEnrollButton.tsx  # Enrollment button
│   ├── dashboard/
│   │   └── ProgressWidget.tsx      # Progress display widget
│   ├── enrollment/
│   │   └── AuthenticatedEnrollButton.tsx # Auth enrollment button
│   ├── instructor/
│   │   └── AffiliateLinksManager.tsx # Affiliate link management
│   ├── layout/
│   │   ├── Header.tsx              # Site header
│   │   └── Footer.tsx              # Site footer
│   ├── learn/
│   │   └── VideoPlayer.tsx         # Video player component
│   ├── quiz/
│   │   ├── QuizPlayer.tsx          # Quiz player interface
│   │   └── QuizResults.tsx         # Quiz results display
│   ├── shared/                     # Shared reusable components
│   │   ├── Breadcrumbs.tsx         # Auto-generated breadcrumb navigation
│   │   ├── CardLayouts.tsx         # ContentCard & StatCard layouts
│   │   ├── DataTable.tsx           # Generic data table with sorting
│   │   ├── FileUpload.tsx          # File picker with validation
│   │   ├── FormField.tsx           # Form field wrapper with validation
│   │   └── Toast.tsx               # Toast notification helper
│   ├── student/
│   │   └── CertificateCard.tsx     # Certificate display card
│   ├── support/
│   │   └── SupportChatbot.tsx      # Support chatbot component
│   └── ui/                         # shadcn/ui components
│       ├── accordion.tsx           # Collapsible accordion
│       ├── alert.tsx               # Inline alert messages
│       ├── alert-dialog.tsx        # Confirmation dialog
│       ├── badge.tsx               # Small badge component
│       ├── button.tsx              # Button with variants
│       ├── card.tsx                # Card container components
│       ├── checkbox.tsx            # Checkbox input
│       ├── dialog.tsx              # Modal dialog
│       ├── dropdown-menu.tsx       # Dropdown menu
│       ├── empty-state.tsx         # Empty state display
│       ├── error-boundary.tsx      # React error boundary
│       ├── input.tsx               # Text input component
│       ├── label.tsx               # Form label
│       ├── modal.tsx               # Modal wrapper (convenience)
│       ├── progress.tsx            # Progress bar
│       ├── radio-group.tsx         # Radio button group
│       ├── select.tsx              # Select dropdown
│       ├── separator.tsx           # Horizontal separator
│       ├── skeleton.tsx            # Loading skeleton
│       ├── spinner.tsx             # Loading spinner
│       ├── status-badge.tsx        # Colored status indicators
│       ├── switch.tsx              # Toggle switch
│       ├── table.tsx               # Table component
│       ├── tabs.tsx                # Tabbed interface
│       ├── textarea.tsx            # Multi-line text input
│       └── toast.tsx               # Toast notification wrapper
├── docs/                           # Documentation (users, developers, DevOps)
│   ├── users/
│   │   ├── student-guide.md        # Student onboarding and usage
│   │   ├── instructor-guide.md     # Instructor workflows and tools
│   │   ├── admin-guide.md          # Admin operations and policies
│   │   ├── troubleshooting.md      # Common issues and fixes
│   │   └── video-tutorials.md      # Linked walkthroughs and demos
│   ├── developers/
│   │   ├── api-reference.md        # API surface and contracts
│   │   ├── database-schema.md      # DB schema and ERD notes
│   │   ├── deployment.md           # Local/prod deploy flows
│   │   ├── migrations.md           # Migration strategy and guides
│   │   ├── disaster-recovery.md    # Backups and recovery runbooks
│   │   └── ui-architecture.md      # UI system and conventions
│   └── devops/
│       ├── infrastructure-setup.md # Vercel, Supabase, Stripe, email, domains
│       ├── monitoring-alerting.md  # SLOs, alerts, on-call
│       ├── backups.md              # Backup strategy and restores
│       ├── domains-email.md        # DNS, domains, and email setup
│       └── cdn-video.md            # Video/CDN guidance
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
├── public/                         # Static assets
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
├── scripts/                        # Deployment & utility scripts
│   ├── check-email-logs.sql        # Email system verification queries
│   ├── check-ui-case.js            # Enforce lowercase in components/ui
│   ├── import-legacy-courses.ts    # Legacy course import from Word docs
│   ├── import-remaining-courses.ts # Additional course import
│   ├── phase2-security-setup.sh    # Security setup script
│   ├── security-audit.ts           # Programmatic security checks
│   ├── test-certificate-generation.ts # Cert generation smoke
│   ├── test-course-player.sh       # Course player testing
│   ├── upload-stripe-products.ts   # Stripe product upload
│   └── validate-security.ts        # Validate security posture
├── supabase/                       # Database configuration
│   └── migrations/
│       ├── 001_course_builder.sql                      # Course builder schema
│       ├── 20250106_001_complete_audit_system.sql      # Audit system
│       ├── 20250106_002_data_retention.sql             # Data retention
│       ├── 20250106_003_security_incidents.sql         # Security incidents
│       ├── 20250106_004_field_encryption.sql           # PII field encryption
│       ├── 20250106_005_security_monitoring.sql        # Security monitoring & alerts
│       ├── 20250106_006_compliance_workflows.sql       # FERPA/GDPR/PCI DSS compliance
│       ├── 20251009175842_create_certificate_audit_log.sql # Certificate audit
│       ├── 20241028_add_email_logs.sql                 # Email logging
│       ├── 20241028_add_progress_features.sql          # Progress features
│       ├── 20241029_add_was_email_sent_recently.sql    # Email deduplication
│       └── 20241030_fix_email_dedup_function.sql       # Email dedup fix
├── tests/                          # Test files
│   ├── e2e/
│   │   ├── smoke.spec.ts           # Smoke tests
│   │   └── security.spec.ts        # Security test suite (RBAC, CSRF, XSS, SQLi, etc.)
│   ├── fixtures/
│   │   └── test-users.ts           # Test user fixtures
│   └── setup/
│       └── seed-test-data.ts       # Test data seeding
├── hooks/                          # React custom hooks
│   ├── useEnrollmentIntent.ts      # Enrollment intent tracking
│   └── useSearch.ts                # Search functionality
├── lib/                            # Backend utilities & services
│   ├── utils.ts                    # General utilities (includes cn helper)
│   ├── auth/                       # Authentication services
│   │   ├── magic-link.ts           # Magic link authentication
│   │   ├── password-reset.ts       # Password reset service
│   │   ├── session-manager.ts      # Session management
│   │   └── mfa/                    # Multi-factor authentication
│   │       ├── authenticator.ts    # Authenticator app MFA
│   │       ├── recovery.ts         # Recovery codes
│   │       └── trusted-devices.ts  # Trusted device management
│   ├── certificates/               # Certificate system
│   │   ├── generators/             # PDF templates and more
│   │   ├── storage/                # Storage providers
│   │   ├── validators/             # Validation helpers
│   │   └── types.ts                # Certificate types
│   ├── compliance/                 # Compliance utilities
│   ├── email/                      # Email system
│   ├── monitoring/                 # Monitoring helpers
│   ├── parsers/                    # Content parsers
│   ├── quiz/                       # Quiz logic
│   ├── resources/                  # Resource tracking
│   ├── search/                     # MeiliSearch clients and types
│   ├── security/                   # Security utilities
│   ├── services/                   # Domain services
│   ├── stripe/                     # Stripe integration
│   ├── supabase/                   # Supabase clients
│   └── utils/                      # Misc utilities
- **Security Enhancements:**
  - Route protection auditing tool (`lib/security/route-audit.ts`)
  - Session timeout enforcement (30 minutes) with geographic restrictions
  - Field-level PII encryption with AES-256-GCM (`20250106_004_field_encryption.sql`)
  - Comprehensive security test suite (`tests/e2e/security.spec.ts`)
  - Security monitoring with anomaly detection (`20250106_005_security_monitoring.sql`)
  - Fraud detection and risk scoring system

- **Compliance Workflows:**
  - FERPA, GDPR, and PCI DSS compliance automation (`20250106_006_compliance_workflows.sql`)
  - 4-year data retention for education records, 7-year for audit logs
  - Right to erasure and data export capabilities
  - Compliance dashboard schema

- **Audit System:**
  - Comprehensive audit logging for all sensitive operations
  - Log aggregation and search functionality
  - 7-year retention for financial and compliance logs

## Recent Additions

### Batch 14 - Launch Docs & UI Case Guard (October 2025)

- Added comprehensive documentation:
  - `docs/users/` (student, instructor, admin guides; troubleshooting; video tutorials)
  - `docs/developers/` (API reference, database schema, deployment, migrations, DR, UI architecture)
  - `docs/devops/` (infrastructure setup, monitoring/alerting, backups, domains/email, CDN/video)
- Enforced lowercase UI filenames in `components/ui/*` to avoid Linux case-sensitivity issues
  - Normalized `input.tsx`, `tabs.tsx`, and `table.tsx` (previously `Table.tsx`)
  - Added CI guard `scripts/check-ui-case.js` and npm script `npm run lint:ui-case`
- Verified local production build passes; clear Vercel cache before redeploy to pick up case-only renames

### Batch 7 - Email System Complete (October 2024)

- **Comprehensive Email System:**
  - `lib/email/templates.ts` - Complete template library for all communication types:
    - Onboarding emails (Day 3, Day 7, profile completion, first purchase)
    - Course activity emails (lesson completed, quiz results, new lessons)
    - Engagement emails (inactivity, abandoned cart, monthly summary, streaks)
    - Payment/access emails (payment failed, renewal reminders, refunds, card expiry)
    - Security/admin emails (alerts, suspicious activity, maintenance, privacy updates)
  - `lib/email/email-service.ts` - Enhanced service with logging, deduplication, and error handling
  - `app/api/email/cron/route.ts` - Scheduled email jobs (onboarding and inactivity reminders)
  - `app/api/email/test/route.ts` - Email testing endpoint for all templates
  - `lib/stripe/webhook-handler.ts` - Integrated email sends for payment events
  - Email logging to `email_logs` table with deduplication via `was_email_sent_recently` RPC
  - Progress notifications tracking to prevent duplicate sends

- **Fixed Build Issues:**
  - Repaired corrupted `components/quiz/QuizPlayer.tsx` with clean implementation
  - Added `@types/qrcode` for TypeScript definitions
  - Verified Tabs component resolution at `components/ui/tabs.tsx`

- **Enhanced MFA System:**
  - Multi-factor authentication with authenticator apps
  - Recovery code system for account access
  - Trusted device management
  - MFA challenge and enrollment endpoints

- **Certificate System Enhancements:**
  - Certificate download, listing, and verification endpoints
  - Mail request for physical certificates
  - Certificate revocation system
  - Audit logging for certificate operations

## System Architecture

### Authentication Flow

1. User registers/logs in via `app/auth/login` or `app/auth/register`
2. Optional MFA challenge if enabled
3. Session created and managed via `lib/auth/session-manager.ts`
4. Auth events logged via `app/api/auth/log-event`

### Course Learning Flow

1. User enrolls in course via `app/api/purchase/course`
2. Access verified via `app/api/enrollment/check-access`
3. Lesson content loaded via `app/learn/[courseId]/[lessonId]`
4. Video progress tracked via `app/api/progress/video`
5. Quiz taken via `app/quiz/[id]`
6. Certificate generated on completion via `app/api/certificates/generate`

### Email Communication Flow

1. Trigger events (payment success, quiz completion, inactivity, etc.)
2. Email service checks deduplication via `was_email_sent_recently` RPC
3. Template rendered with user data
4. Email sent via Resend
5. Send logged to `email_logs` table
6. Cron jobs handle scheduled sends (onboarding, reminders)

### Affiliate System Flow

1. Instructor creates affiliate link via `app/instructor/affiliate-links`
2. Link tracked via middleware when clicked
3. Conversion recorded on purchase
4. Earnings tracked via `app/instructor/earnings`
5. Commission calculated and displayed

## Notes

- Excludes build artifacts (`.next/`, `node_modules/`) from version control
- Environment variables required: See `.env.local.example` for full list
- Database migrations handle schema evolution and security setup
- Test suite covers E2E scenarios, API endpoints, and comprehensive security testing
- Email system includes comprehensive logging and prevents duplicate sends
- Progress tracking uses Supabase RLS for security
- All API routes protected with proper authentication and RBAC
- Certificate system uses Supabase Storage for PDF files
- MFA system supports TOTP authenticator apps
- Search index requires MeiliSearch instance
- Stripe webhooks require proper signature verification
- Security features include session timeouts, geo-restrictions, PII encryption, and audit logging
- Compliance workflows automate FERPA, GDPR, and PCI DSS requirements
- UI components follow shadcn/ui pattern with Radix UI primitives and Tailwind styling
- All UI components use `cn` utility from `@/lib/utils` for className merging

## Component Library Usage

### Core UI Components

Import from `@/components/ui/[component-name]`:

- Use `<Select>` for dropdowns with search and keyboard navigation
- Use `<Dialog>` or `<Modal>` for modal overlays
- Use `<AlertDialog>` for confirmation prompts
- Use `<Alert>` for inline messages
- Use `toast.success()` or `toast.error()` for notifications
- Use `<Skeleton>` or `<Spinner>` for loading states
- Use `<ErrorBoundary>` to wrap components that may error
- Use `<EmptyState>` for empty data states
- Use `<StatusBadge>` for status indicators

### Shared Components

Import from `@/components/shared/[component-name]`:

- Use `<FormField>` or `<InputWithError>` for consistent form layouts
- Use `<DataTable>` for tabular data with sorting
- Use `<FileUpload>` for file selection with validation
- Use `<Breadcrumbs>` for navigation context
- Use `<ContentCard>` or `<StatCard>` for card layouts
- Use `toast` helper for notifications throughout the app
