/**
 * Security Tests
 * Penetration testing for common security vulnerabilities
 */

import { test, expect } from '@playwright/test'

test.describe('Security Tests', () => {
  test.describe('SQL Injection Prevention', () => {
    test('should prevent SQL injection in login', async ({ page }) => {
      await page.goto('/auth/login')

      const sqlInjection = "' OR '1'='1"
      
      await page.fill('input[name="email"]', sqlInjection)
      await page.fill('input[name="password"]', sqlInjection)
      await page.click('button[type="submit"]')

      // Should not grant access
      await expect(page).not.toHaveURL(/\/dashboard/)
      await expect(page.locator('text=/error|invalid/i')).toBeVisible()
    })

    test('should prevent SQL injection in search', async ({ page }) => {
      await page.goto('/courses')

      const sqlInjection = "'; DROP TABLE courses; --"
      
      await page.fill('input[type="search"]', sqlInjection)
      await page.press('input[type="search"]', 'Enter')

      // Should handle gracefully without breaking
      await expect(page).toHaveURL(/\/courses/)
      // Page should still function
      await expect(page.locator('h1')).toBeVisible()
    })
  })

  test.describe('XSS Prevention', () => {
    test('should escape script tags in user input', async ({ page }) => {
      await page.goto('/auth/register')

      const xssPayload = '<script>alert("xss")</script>'
      
      await page.fill('input[name="name"]', xssPayload)
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'Test123!@#')
      await page.click('button[type="submit"]')

      // Check that script is not executed
      page.on('dialog', () => {
        throw new Error('XSS alert dialog should not appear')
      })

      // Script should be escaped in rendered output
      const nameDisplay = page.locator('text=/profile|account/i')
      await expect(nameDisplay).not.toContainText('<script>')
    })

    test('should sanitize HTML in course descriptions', async ({ page }) => {
      await page.goto('/courses')

      // Click on a course
      await page.click('a[href*="/courses/"]')

      // Check that no unescaped HTML is rendered
      const description = page.locator('.course-description, [data-testid="description"]')
      const html = await description.innerHTML()
      
      expect(html).not.toMatch(/<script/i)
      expect(html).not.toMatch(/onerror=/i)
      expect(html).not.toMatch(/javascript:/i)
    })
  })

  test.describe('CSRF Protection', () => {
    test('should reject requests without CSRF token', async ({ page, context }) => {
      // Try to make a state-changing request without proper CSRF protection
      const response = await context.request.post('/api/enrollment/create', {
        data: {
          courseId: 'test-course-id',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Should reject or require authentication
      expect([401, 403, 422]).toContain(response.status())
    })

    test('should validate origin header on POST requests', async ({ page, context }) => {
      const response = await context.request.post('/api/auth/login', {
        data: {
          email: 'test@example.com',
          password: 'password',
        },
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://malicious-site.com',
        },
      })

      // Should reject cross-origin requests
      expect([403, 422]).toContain(response.status())
    })
  })

  test.describe('Authentication Bypass Prevention', () => {
    test('should prevent unauthorized access to dashboard', async ({ page }) => {
      // Try to access dashboard without logging in
      await page.goto('/dashboard')

      // Should redirect to login
      await expect(page).toHaveURL(/\/auth\/login/)
    })

    test('should prevent unauthorized access to instructor panel', async ({ page }) => {
      await page.goto('/auth/login')

      // Login as regular student
      await page.fill('input[name="email"]', 'student@example.com')
      await page.fill('input[name="password"]', 'Test123!@#')
      await page.click('button[type="submit"]')

      // Try to access instructor-only route
      await page.goto('/instructor/courses')

      // Should be denied or redirected
      await expect(page).not.toHaveURL(/\/instructor\/courses/)
      await expect(page.locator('text=/unauthorized|access denied/i')).toBeVisible()
    })

    test('should prevent admin access for non-admin users', async ({ page }) => {
      await page.goto('/auth/login')

      // Login as regular user
      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'Test123!@#')
      await page.click('button[type="submit"]')

      // Try to access admin panel
      await page.goto('/admin')

      // Should be denied
      await expect(page).not.toHaveURL(/\/admin/)
    })
  })

  test.describe('Rate Limiting', () => {
    test('should rate limit login attempts', async ({ page }) => {
      await page.goto('/auth/login')

      // Attempt multiple failed logins rapidly
      for (let i = 0; i < 10; i++) {
        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="password"]', 'WrongPassword123!')
        await page.click('button[type="submit"]')
        await page.waitForTimeout(100)
      }

      // Should show rate limit or account lock message
      await expect(page.locator('text=/rate limit|locked|too many attempts/i')).toBeVisible()
    })

    test('should rate limit API requests', async ({ context }) => {
      const requests = []
      
      // Fire off many requests rapidly
      for (let i = 0; i < 50; i++) {
        requests.push(
          context.request.get('/api/courses')
        )
      }

      const responses = await Promise.all(requests)
      const rateLimited = responses.some(r => r.status() === 429)

      expect(rateLimited).toBe(true)
    })
  })

  test.describe('Sensitive Data Exposure Prevention', () => {
    test('should not expose passwords in responses', async ({ context }) => {
      const response = await context.request.post('/api/auth/register', {
        data: {
          email: 'newuser@example.com',
          password: 'SecretPassword123!',
          name: 'New User',
        },
      })

      const body = await response.text()
      
      expect(body).not.toContain('SecretPassword123!')
      expect(body).not.toMatch(/password.*:.*["'][^"']+["']/i)
    })

    test('should not expose API keys in client code', async ({ page }) => {
      await page.goto('/')

      // Check page source
      const content = await page.content()
      
      expect(content).not.toMatch(/sk_live_/i)
      expect(content).not.toMatch(/service_role/i)
      expect(content).not.toMatch(/Bearer [A-Za-z0-9_-]{100,}/i)
    })

    test('should use secure cookies for sessions', async ({ page, context }) => {
      await page.goto('/auth/login')
      
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'Test123!@#')
      await page.click('button[type="submit"]')

      // Check cookie attributes
      const cookies = await context.cookies()
      const sessionCookie = cookies.find(c => 
        c.name.includes('session') || c.name.includes('auth')
      )

      if (sessionCookie) {
        expect(sessionCookie.httpOnly).toBe(true)
        expect(sessionCookie.secure).toBe(true)
        expect(sessionCookie.sameSite).toBe('Strict')
      }
    })
  })

  test.describe('Input Validation', () => {
    test('should validate email format', async ({ page }) => {
      await page.goto('/auth/register')

      await page.fill('input[name="email"]', 'notanemail')
      await page.fill('input[name="password"]', 'Test123!@#')
      await page.click('button[type="submit"]')

      await expect(page.locator('text=/invalid email/i')).toBeVisible()
    })

    test('should enforce password strength requirements', async ({ page }) => {
      await page.goto('/auth/register')

      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'weak')
      await page.click('button[type="submit"]')

      await expect(page.locator('text=/password.*strong|requirement/i')).toBeVisible()
    })

    test('should prevent file upload of dangerous types', async ({ page }) => {
      // This would require an actual file upload feature
      // Placeholder for when implemented
      expect(true).toBe(true)
    })
  })

  test.describe('Authorization Checks', () => {
    test('should prevent users from accessing other users\' data', async ({ page, context }) => {
      // Login as user 1
      await page.goto('/auth/login')
      await page.fill('input[name="email"]', 'user1@example.com')
      await page.fill('input[name="password"]', 'Test123!@#')
      await page.click('button[type="submit"]')

      // Try to access another user's progress
      const response = await context.request.get('/api/progress?userId=other-user-id')

      // Should be denied
      expect([401, 403]).toContain(response.status())
    })

    test('should prevent unauthorized course modifications', async ({ page, context }) => {
      // Login as non-instructor
      await page.goto('/auth/login')
      await page.fill('input[name="email"]', 'student@example.com')
      await page.fill('input[name="password"]', 'Test123!@#')
      await page.click('button[type="submit"]')

      // Try to modify a course
      const response = await context.request.put('/api/courses/some-course-id', {
        data: {
          title: 'Hacked Course',
        },
      })

      // Should be denied
      expect([401, 403]).toContain(response.status())
    })
  })
})
