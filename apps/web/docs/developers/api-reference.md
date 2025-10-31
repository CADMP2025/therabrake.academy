# API Reference

This document summarizes the App Router API endpoints under `app/api/*`. All APIs return JSON unless otherwise noted. Authentication is via Supabase auth cookies; many routes are dynamic and not prerendered.

## Conventions

- Base URL: <https://therabrake.academy>
- Auth: Supabase session cookie; some endpoints accept Bearer tokens for internal testing.
- Errors: `{ success: false, error: string, code?: string }`
- Success: `{ success: true, data: any }`

## Index by domain

### Auth (`/api/auth/*`)

- POST /api/auth/login
- POST /api/auth/magic-link
- POST /api/auth/password-reset
- GET  /api/auth/sessions
- POST /api/auth/verify-email
- POST /api/auth/log-event
- POST /api/auth/mfa/challenge
- POST /api/auth/mfa/enroll
- POST /api/auth/mfa/recovery
- GET  /api/auth/mfa/trusted-devices

### Courses (`/api/courses/*`)

- GET  /api/courses
- GET  /api/courses/featured
- GET  /api/courses/popular
- GET  /api/courses/recommended
- GET  /api/courses/reviews
- POST /api/courses/reviews/helpful
- GET  /api/courses/tags

### Enrollment (`/api/enrollment/*`)

- GET  /api/enrollment/status
- GET  /api/enrollment/history
- POST /api/enrollment/check-access
- POST /api/enrollment/extend

### Progress (`/api/progress/*`)

- GET  /api/progress
- POST /api/progress/video
- GET  /api/progress/dashboard

### Quiz (`/api/quiz/*`)

- POST /api/quiz/attempt
- GET  /api/quiz/attempts
- GET  /api/quiz/questions
- POST /api/quiz/submit

### Resources & Notes

- GET  /api/resources
- POST /api/resources/track
- POST /api/notes

### Support (`/api/support/*`)

- GET  /api/support/categories
- GET  /api/support/guides
- GET  /api/support/kb
- GET  /api/support/videos
- GET  /api/support/faqs
- GET  /api/support/faqs/[slug]
- POST /api/support/faqs/feedback
- POST /api/support/chatbot
- GET  /api/support/tickets
- GET  /api/support/tickets/[id]

### Certificates (`/api/certificates/*`)

- POST /api/certificates/generate
- POST /api/certificates/request-mail
- POST /api/certificates/revoke
- GET  /api/verify-certificate
- GET  /api/public/verify

### Purchase & Stripe (`/api/purchase/*`, `/api/stripe/*`)

- POST /api/purchase/course
- POST /api/purchase/extend
- POST /api/purchase/gift
- GET  /api/purchase/pricing
- POST /api/purchase/membership
- POST /api/purchase/program
- POST /api/purchase/validate-promo
- POST /api/stripe/create-checkout
- POST /api/stripe/create-checkout-session
- POST /api/stripe/webhook  (legacy)
- POST /api/stripe/webhooks (preferred)

### System & integrations

- GET  /api/health
- POST /api/email/quiz-result
- POST /api/email/test
- POST /api/email/cron
- GET  /api/activity/recent
- POST /api/webhooks/stripe
- POST /api/webhooks/enrollment-created
- POST /api/webhooks/certificate-generated

## Request/Response contracts

This codebase standardizes on service responses like:

```
interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
}
```

Endpoint-specific params and shapes are defined inline in each route. See the `app/api/*/route.ts` files for the exact handlers and validation logic.

## Authentication and dynamic usage

Many routes read `cookies` or `request.url` and thus cannot be prerendered. That’s expected. Ensure authentication cookies are present when calling protected endpoints from the browser or SSR environment.

## Rate limiting and security

- Sensitive endpoints should be rate-limited at the edge (Vercel Protection) and/or within the handlers.
- CSRF is mitigated by same-site cookies and route design; avoid state-changing GETs.
- PII is minimized in logs; Sentry scrubbing is enabled.
