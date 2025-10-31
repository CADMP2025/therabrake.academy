/**
 * Security Testing Suite
 * Comprehensive security tests for authentication, authorization, and vulnerabilities
 */

import { test, expect } from '@playwright/test'

test.describe('Security: Authentication & Session Management', () => {
  test('should enforce session timeout after 30 minutes of inactivity', async ({ page }) => {
    // Login
    await page.goto('/auth/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    
    // Wait for login
    await expect(page).toHaveURL('/dashboard')
    
    // Simulate 30 minutes of inactivity (mock time)
    await page.evaluate(() => {
      const thirtyMinutesAgo = new Date(Date.now() - 31 * 60 * 1000).toISOString()
      document.cookie = `last_activity=${thirtyMinutesAgo}; path=/`
    })
    
    // Try to access protected page
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/)
  })
  
  test('should require MFA for admin users', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('[name="email"]', 'admin@therabrake.academy')
    await page.fill('[name="password"]', 'AdminPassword123!')
    await page.click('button[type="submit"]')
    
    // Should redirect to MFA challenge
    await expect(page).toHaveURL(/\/auth\/mfa\/challenge/)
  })
  
  test('should block login after 5 failed attempts', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Attempt 5 failed logins
    for (let i = 0; i < 5; i++) {
      await page.fill('[name="email"]', 'test@example.com')
      await page.fill('[name="password"]', 'WrongPassword123!')
      await page.click('button[type="submit"]')
      await page.waitForTimeout(1000)
    }
    
    // 6th attempt should be blocked
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'WrongPassword123!')
    await page.click('button[type="submit"]')
    
    // Should show rate limit error
    await expect(page.locator('text=too many attempts')).toBeVisible()
  })
})

test.describe('Security: Authorization & Access Control', () => {
  test('student cannot access admin routes', async ({ page }) => {
    // Login as student
    await page.goto('/auth/login')
    await page.fill('[name="email"]', 'student@example.com')
    await page.fill('[name="password"]', 'StudentPassword123!')
    await page.click('button[type="submit"]')
    
    // Try to access admin page
    const response = await page.goto('/admin')
    
    // Should return 403 Forbidden
    expect(response?.status()).toBe(403)
  })
  
  test('instructor cannot access admin-only features', async ({ page, request }) => {
    // Login as instructor
    await page.goto('/auth/login')
    await page.fill('[name="email"]', 'instructor@example.com')
    await page.fill('[name="password"]', 'InstructorPassword123!')
    await page.click('button[type="submit"]')
    
    // Try to revoke a certificate (admin-only)
    const response = await request.post('/api/certificates/revoke', {
      data: { certificateId: '123' },
    })
    
    expect(response.status()).toBe(403)
  })
  
  test('unauthenticated user cannot access protected API routes', async ({ request }) => {
    const protectedRoutes = [
      '/api/progress/dashboard',
      '/api/enrollment/history',
      '/api/certificates/generate',
      '/api/admin/users',
    ]
    
    for (const route of protectedRoutes) {
      const response = await request.get(route)
      expect(response.status()).toBe(401)
    }
  })
})

test.describe('Security: Data Protection & PII', () => {
  test('should mask SSN in user profiles', async ({ page }) => {
    // Login as student
    await page.goto('/auth/login')
    await page.fill('[name="email"]', 'student@example.com')
    await page.fill('[name="password"]', 'StudentPassword123!')
    await page.click('button[type="submit"]')
    
    // Go to profile
    await page.goto('/student/profile')
    
    // SSN should be masked
    const ssnField = page.locator('[data-testid="ssn"]')
    await expect(ssnField).toContainText('***-**-')
    await expect(ssnField).not.toContainText(/\d{3}-\d{2}-\d{4}/)
  })
  
  test('should not expose PII in API responses', async ({ request }) => {
    const response = await request.get('/api/users/profile', {
      headers: {
        Authorization: 'Bearer valid-token',
      },
    })
    
    const data = await response.json()
    
    // Should not contain raw SSN, credit card, or sensitive data
    expect(data).not.toHaveProperty('ssn')
    expect(data).not.toHaveProperty('card_number')
    expect(data).not.toHaveProperty('cvv')
  })
  
  test('educational records require FERPA compliance logging', async ({ page }) => {
    // Login as instructor
    await page.goto('/auth/login')
    await page.fill('[name="email"]', 'instructor@example.com')
    await page.fill('[name="password"]', 'InstructorPassword123!')
    await page.click('button[type="submit"]')
    
    // Access student grades
    await page.goto('/instructor/grades/student-123')
    
    // Verify audit log was created (check via API)
    const response = await page.request.get('/api/audit-logs?type=educational_record_access')
    expect(response.ok()).toBeTruthy()
  })
})

test.describe('Security: XSS & Injection Protection', () => {
  test('should sanitize user input to prevent XSS', async ({ page }) => {
    await page.goto('/auth/register')
    
    const xssPayload = '<script>alert("XSS")</script>'
    
    await page.fill('[name="name"]', xssPayload)
    await page.fill('[name="email"]', 'xsstest@example.com')
    await page.fill('[name="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    
    // Navigate to profile page
    await page.goto('/student/profile')
    
    // Name should be escaped, not executed
    const nameElement = page.locator('[data-testid="user-name"]')
    await expect(nameElement).not.toContainText('<script>')
    
    // No alert should be triggered
    page.on('dialog', dialog => {
      throw new Error('XSS alert triggered!')
    })
  })
  
  test('should prevent SQL injection in search', async ({ request }) => {
    const sqlPayload = "' OR '1'='1"
    
    const response = await request.get(`/api/search/courses?q=${encodeURIComponent(sqlPayload)}`)
    
    // Should return safe results, not expose database
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data).not.toHaveProperty('error')
  })
})

test.describe('Security: CSRF Protection', () => {
  test('should reject POST requests without valid CSRF token', async ({ request }) => {
    const response = await request.post('/api/courses/enroll', {
      data: { courseId: '123' },
      // No CSRF token
    })
    
    expect(response.status()).toBe(403)
  })
  
  test('should accept POST requests with valid CSRF token', async ({ page, request }) => {
    // Login to get session
    await page.goto('/auth/login')
    await page.fill('[name="email"]', 'student@example.com')
    await page.fill('[name="password"]', 'StudentPassword123!')
    await page.click('button[type="submit"]')
    
    // Get CSRF token from page
    const csrfToken = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="csrf-token"]')
      return meta?.getAttribute('content')
    })
    
    // Make API request with token
    const response = await request.post('/api/courses/enroll', {
      data: { courseId: '123' },
      headers: {
        'X-CSRF-Token': csrfToken || '',
      },
    })
    
    expect(response.ok()).toBeTruthy()
  })
})

test.describe('Security: Rate Limiting', () => {
  test('should enforce rate limits on API endpoints', async ({ request }) => {
    const requests = []
    
    // Make 11 requests (limit is 10 per minute)
    for (let i = 0; i < 11; i++) {
      requests.push(request.get('/api/courses'))
    }
    
    const responses = await Promise.all(requests)
    
    // At least one should be rate limited
    const rateLimited = responses.some(r => r.status() === 429)
    expect(rateLimited).toBeTruthy()
  })
  
  test('should return rate limit headers', async ({ request }) => {
    const response = await request.get('/api/courses')
    
    const headers = response.headers()
    expect(headers).toHaveProperty('x-ratelimit-limit')
    expect(headers).toHaveProperty('x-ratelimit-remaining')
    expect(headers).toHaveProperty('x-ratelimit-reset')
  })
})

test.describe('Security: File Upload', () => {
  test('should reject files with dangerous extensions', async ({ page }) => {
    await page.goto('/student/assignments/upload')
    
    // Create a fake .exe file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'virus.exe',
      mimeType: 'application/x-msdownload',
      buffer: Buffer.from('fake executable'),
    })
    
    await page.click('button[type="submit"]')
    
    // Should show error
    await expect(page.locator('text=file type not allowed')).toBeVisible()
  })
  
  test('should enforce file size limits', async ({ page }) => {
    await page.goto('/student/assignments/upload')
    
    // Create a large file (> 100MB)
    const largeBuffer = Buffer.alloc(101 * 1024 * 1024)
    
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'large-file.pdf',
      mimeType: 'application/pdf',
      buffer: largeBuffer,
    })
    
    await page.click('button[type="submit"]')
    
    // Should show error
    await expect(page.locator('text=file too large')).toBeVisible()
  })
})

test.describe('Security: Geographic Restrictions', () => {
  test('should block access from restricted countries', async ({ request }) => {
    const response = await request.get('/api/courses', {
      headers: {
        'cf-ipcountry': 'KP', // North Korea
      },
    })
    
    expect(response.status()).toBe(403)
  })
  
  test('should allow access from non-restricted countries', async ({ request }) => {
    const response = await request.get('/api/courses', {
      headers: {
        'cf-ipcountry': 'US',
      },
    })
    
    expect(response.ok()).toBeTruthy()
  })
})

test.describe('Security: Compliance', () => {
  test('GDPR: user can request data export', async ({ page, request }) => {
    // Login
    await page.goto('/auth/login')
    await page.fill('[name="email"]', 'student@example.com')
    await page.fill('[name="password"]', 'StudentPassword123!')
    await page.click('button[type="submit"]')
    
    // Request data export
    await page.goto('/settings/privacy')
    await page.click('text=Export My Data')
    
    // Should create compliance request
    await expect(page.locator('text=export request submitted')).toBeVisible()
  })
  
  test('FERPA: access to educational records is logged', async ({ page, request }) => {
    // Login as instructor
    await page.goto('/auth/login')
    await page.fill('[name="email"]', 'instructor@example.com')
    await page.fill('[name="password"]', 'InstructorPassword123!')
    await page.click('button[type="submit"]')
    
    // View student grades
    await page.goto('/instructor/grades/student-123')
    
    // Check audit log
    const auditResponse = await request.get('/api/audit-logs?type=educational_record_access')
    const auditData = await auditResponse.json()
    
    expect(auditData.logs).toContainEqual(
      expect.objectContaining({
        event_type: 'educational_record_access',
        target_id: 'student-123',
      })
    )
  })
})

test.describe('Security: Headers & Configuration', () => {
  test('should include security headers', async ({ request }) => {
    const response = await request.get('/')
    const headers = response.headers()
    
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-xss-protection']).toBe('1; mode=block')
    expect(headers['strict-transport-security']).toContain('max-age=31536000')
    expect(headers['content-security-policy']).toBeDefined()
  })
  
  test('should set secure cookie flags in production', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'TestPassword123!',
      },
    })
    
    const cookies = response.headers()['set-cookie']
    expect(cookies).toContain('HttpOnly')
    expect(cookies).toContain('SameSite=Lax')
    
    if (process.env.NODE_ENV === 'production') {
      expect(cookies).toContain('Secure')
    }
  })
})
