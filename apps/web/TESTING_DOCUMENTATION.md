# Comprehensive Test Suite Documentation

## Overview
This document provides a complete guide to the testing infrastructure for TherabrakAcademy.

## Test Structure

```
tests/
├── e2e/                          # End-to-end tests
│   ├── 01-auth-flow.spec.ts     # Authentication flows (8 tests)
│   ├── 02-purchase-enrollment.spec.ts  # Purchase & enrollment (8 tests)
│   ├── 03-learning-experience.spec.ts  # Learning journey (11 tests)
│   ├── 04-security.spec.ts      # Security testing (20+ tests)
│   └── 05-accessibility.spec.ts # WCAG 2.1 AA compliance (30+ tests)
├── integration/
│   └── api.test.ts              # API integration tests (40+ tests)
├── unit/
│   ├── services/
│   │   └── enrollment.test.ts   # Enrollment service (15 tests)
│   └── utils/
│       └── utilities.test.ts    # Utility functions (15 tests)
├── fixtures/
│   └── test-helpers.ts          # Reusable test utilities
└── setup/
    └── global-setup.ts          # Test environment setup
```

## Test Coverage Summary

### E2E Tests (77+ test cases)

#### 1. Authentication Flow (01-auth-flow.spec.ts)
- ✅ User registration with email verification
- ✅ Login/logout functionality
- ✅ Password reset flow
- ✅ Account lockout after 5 failed attempts
- ✅ Remember me functionality
- ✅ Auth guards for protected routes
- ✅ Session management
- ✅ Invalid credential handling

#### 2. Purchase & Enrollment (02-purchase-enrollment.spec.ts)
- ✅ Browse and filter courses
- ✅ View course details
- ✅ Checkout with Stripe (test cards: 4242... success, 4000...0002 decline)
- ✅ Apply promo codes
- ✅ Purchase membership subscriptions
- ✅ Verify enrollment after purchase
- ✅ Payment failure handling
- ✅ Receipt generation

#### 3. Learning Experience (03-learning-experience.spec.ts)
- ✅ Video playback and progress tracking
- ✅ Create timestamped lesson notes
- ✅ Download course resources
- ✅ Navigate between lessons
- ✅ Take quizzes (pass/fail scenarios)
- ✅ Quiz time limits
- ✅ Quiz retakes (max 3 attempts)
- ✅ Mark lessons complete
- ✅ Track overall course progress
- ✅ Generate completion certificate
- ✅ Resume from last position

#### 4. Security Testing (04-security.spec.ts)
- ✅ SQL injection prevention (login, search)
- ✅ XSS prevention (user input, course descriptions)
- ✅ CSRF protection
- ✅ Origin header validation
- ✅ Authentication bypass prevention
- ✅ Role-based access control (student, instructor, admin)
- ✅ Rate limiting (login, API)
- ✅ Sensitive data exposure prevention
- ✅ Secure cookie attributes
- ✅ Input validation (email, password)
- ✅ Authorization checks (user data, course modifications)

#### 5. Accessibility Testing (05-accessibility.spec.ts)
**WCAG 2.1 AA Compliance**
- ✅ Automated axe-core scans (homepage, login, courses, dashboard)
- ✅ Keyboard navigation (Tab, Enter, Space, Escape)
- ✅ Focus management and indicators
- ✅ Modal focus trapping
- ✅ Screen reader support (ARIA labels, roles)
- ✅ Proper heading hierarchy
- ✅ Descriptive alt text for images
- ✅ Form labels and error announcements
- ✅ Color contrast (light/dark mode)
- ✅ 200% zoom support
- ✅ Mobile viewport (375x667)
- ✅ Touch target sizes (44x44px minimum)
- ✅ Video player keyboard controls
- ✅ Caption support

### Integration Tests (40+ test cases)

#### API Integration (api.test.ts)
**Authentication APIs:**
- POST /api/auth/login (valid/invalid credentials)
- POST /api/auth/password-reset
- GET /api/auth/sessions

**Course APIs:**
- GET /api/courses (list, filtering, featured)
- GET /api/courses/tags

**Enrollment APIs:**
- GET /api/enrollment/status
- GET /api/enrollment/check-access
- GET /api/enrollment/history

**Progress APIs:**
- GET /api/progress/dashboard
- POST /api/progress/video
- GET /api/progress (by course)

**Quiz APIs:**
- GET /api/quiz/questions
- POST /api/quiz/attempt
- POST /api/quiz/submit
- GET /api/quiz/attempts

**Purchase APIs:**
- GET /api/purchase/pricing
- POST /api/purchase/validate-promo

**Support APIs:**
- GET /api/support/faqs
- POST /api/support/tickets

**Error Handling:**
- 401 for unauthorized access
- 400 for invalid requests
- 404 for non-existent resources

### Unit Tests (30+ test cases)

#### Enrollment Service (enrollment.test.ts)
- enrollUserInCourse (validation, duplicates, foreign keys)
- checkEnrollmentAccess (active, expired, suspended)
- calculateCourseProgress (0%, partial, 100%)
- unenrollUser (soft delete, data preservation)
- grantCertificateAccess (completed courses only)

#### Utilities (utilities.test.ts)
**Progress Tracking:**
- calculateWatchTime
- calculateLearningStreak
- markLessonComplete
- saveVideoProgress

**Validation:**
- validateEmail (valid/invalid formats)
- validatePassword (strength requirements)
- sanitizeInput (HTML/XSS prevention)
- validateCoursePrice (range validation)

**Date Helpers:**
- formatDuration (HH:MM:SS)
- calculateTimeRemaining
- isWithinDateRange

## Running Tests

### Prerequisites
```bash
npm install
# Ensure environment variables are set:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# NEXT_PUBLIC_APP_URL
```

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Specific Test Suite
```bash
# Authentication only
npx playwright test 01-auth-flow

# Security only
npx playwright test 04-security

# Accessibility only
npx playwright test 05-accessibility
```

### Run Integration Tests
```bash
npm test -- integration
```

### Run Unit Tests
```bash
npm test -- unit
```

### Run with UI Mode (Debugging)
```bash
npx playwright test --ui
```

### Run in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Generate Test Report
```bash
npx playwright show-report
```

## Test Helpers

### Available Utilities (tests/fixtures/test-helpers.ts)

#### Data Generation
- `generateTestUser()` - Create fake user data
- `generateTestCourse()` - Create fake course data
- `generateTestLesson()` - Create fake lesson data
- `generateTestQuiz()` - Create fake quiz data
- `generateTestQuestion()` - Create fake quiz question

#### Database Operations
- `createTestUser(overrides)` - Insert user into Supabase
- `createTestCourse(instructorId)` - Insert course into Supabase
- `createTestLesson(courseId)` - Insert lesson into Supabase
- `createTestQuiz(lessonId)` - Insert quiz into Supabase
- `enrollUserInCourse(userId, courseId)` - Create enrollment
- `deleteTestUser(userId)` - Clean up test user
- `deleteTestCourse(courseId)` - Clean up test course

#### Assertions
- `assertEnrollmentExists(userId, courseId)` - Verify enrollment
- `assertUserHasRole(userId, role)` - Verify user role
- `assertEmailSent(email, subject)` - Verify email delivery

#### Utilities
- `waitForEmail(email, timeout)` - Wait for email to arrive
- `waitForRecord(table, conditions, timeout)` - Wait for database record
- `createAuthenticatedRequest(token)` - Create auth headers
- `mockStripeWebhook(event)` - Mock Stripe events

## Test Data

### Stripe Test Cards
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Insufficient Funds:** 4000 0000 0000 9995
- **Expired:** 4000 0000 0000 0069

### Test Accounts
Create test accounts dynamically using `createTestUser()`:
```typescript
const { user, profile } = await createTestUser({
  role: 'instructor', // or 'student', 'admin'
})
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - run: npm test -- --coverage
```

### Test Coverage Goals
- E2E: Critical user paths (100%)
- Integration: All API endpoints (100%)
- Unit: Business logic (80%+)
- Security: Top 10 OWASP (100%)
- Accessibility: WCAG 2.1 AA (100%)

## Common Issues & Solutions

### Issue: Tests timing out
**Solution:** Increase timeout in playwright.config.ts
```typescript
timeout: 60000, // 60 seconds
```

### Issue: Database conflicts
**Solution:** Use unique IDs with `faker.string.uuid()` or clean up in `afterEach`

### Issue: Flaky tests
**Solution:** Use `waitFor` methods instead of fixed timeouts
```typescript
await expect(element).toBeVisible({ timeout: 10000 })
```

### Issue: Missing @axe-core/playwright
**Solution:** Install accessibility testing package
```bash
npm install --save-dev @axe-core/playwright
```

## Next Steps

### Pending Implementation
1. **Manual Testing Checklist (Batch 13.2)**
   - Create step-by-step test scenarios
   - Document expected results
   - Edge case documentation

2. **Performance Testing (Batch 13.3)**
   - Load testing with k6
   - Database query benchmarks
   - Video streaming performance
   - API response time monitoring

3. **Additional Coverage**
   - Instructor course builder tests
   - Admin panel functionality
   - Email templates rendering
   - Certificate PDF generation
   - Refund workflow

## Maintenance

### Regular Tasks
- Update test data monthly
- Review and update expected behaviors
- Check for deprecated Playwright APIs
- Update accessibility standards
- Review failed test reports

### When to Update Tests
- After adding new features
- When changing authentication logic
- After UI/UX updates
- When modifying API endpoints
- After security patches

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Stripe Testing](https://stripe.com/docs/testing)

---

**Last Updated:** 2025-01-30  
**Test Suite Version:** 1.0.0  
**Total Test Cases:** 147+
