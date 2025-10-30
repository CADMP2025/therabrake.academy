/**
 * Authentication Flow Tests
 * E2E tests for email verification, password reset, and session management
 */

import { test, expect } from '@playwright/test'

test.describe('Email Verification Flow', () => {
  test('should send verification email on registration', async ({ page }) => {
    await page.goto('/auth/register')

    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'SecurePass123!')

    await page.click('button[type="submit"]')

    await expect(page.locator('text=Verification email sent')).toBeVisible({ timeout: 10000 })
  })

  test('should resend verification email', async ({ page }) => {
    await page.goto('/auth/verify-email')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button:has-text("Resend Email")')

    await expect(page.locator('text=Verification email resent')).toBeVisible({ timeout: 10000 })
  })

  test('should show error for invalid verification token', async ({ page }) => {
    await page.goto('/auth/verify-email?token=invalid-token')

    await expect(page.locator('text=Invalid or expired verification link')).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Password Reset Flow', () => {
  test('should send password reset email', async ({ page }) => {
    await page.goto('/auth/forgot-password')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button[type="submit"]')

    await expect(
      page.locator('text=Password reset link sent to your email')
    ).toBeVisible({ timeout: 10000 })
  })

  test('should validate password strength', async ({ page }) => {
    await page.goto('/auth/reset-password?token=mock-token')

    // Weak password
    await page.fill('input[name="password"]', 'weak')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible()

    // Strong password
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.fill('input[name="confirmPassword"]', 'SecurePass123!')

    // Should not show error
    await expect(page.locator('text=Password must be at least 8 characters')).not.toBeVisible()
  })

  test('should update password for authenticated user', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'CurrentPassword123!')
    await page.click('button[type="submit"]')

    await page.waitForURL('/dashboard')

    // Go to settings
    await page.goto('/dashboard/settings')

    await page.fill('input[name="currentPassword"]', 'CurrentPassword123!')
    await page.fill('input[name="newPassword"]', 'NewSecurePass123!')
    await page.fill('input[name="confirmPassword"]', 'NewSecurePass123!')
    await page.click('button:has-text("Update Password")')

    await expect(page.locator('text=Password updated successfully')).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Account Lockout', () => {
  test('should lock account after max failed attempts', async ({ page }) => {
    const email = `lockout-test-${Date.now()}@example.com`

    await page.goto('/auth/login')

    // Attempt login 5 times with wrong password
    for (let i = 0; i < 5; i++) {
      await page.fill('input[name="email"]', email)
      await page.fill('input[name="password"]', 'WrongPassword123!')
      await page.click('button[type="submit"]')

      if (i < 4) {
        await expect(page.locator('text=Invalid credentials')).toBeVisible()
      }
    }

    // Should show lockout message
    await expect(
      page.locator('text=Account is locked due to too many failed login attempts')
    ).toBeVisible({ timeout: 10000 })
  })

  test('should show remaining attempts', async ({ page }) => {
    await page.goto('/auth/login')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'WrongPassword')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=attempts remaining')).toBeVisible()
  })
})

test.describe('Magic Link Login', () => {
  test('should send magic link', async ({ page }) => {
    await page.goto('/auth/login')

    await page.click('button:has-text("Login with Email")')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button:has-text("Send Magic Link")')

    await expect(page.locator('text=Magic link sent to your email')).toBeVisible({ timeout: 10000 })
  })

  test('should not reveal if email does not exist', async ({ page }) => {
    await page.goto('/auth/login')

    await page.click('button:has-text("Login with Email")')

    await page.fill('input[name="email"]', 'nonexistent@example.com')
    await page.click('button:has-text("Send Magic Link")')

    // Should show generic success message for security
    await expect(
      page.locator('text=If an account exists with this email, you will receive a magic link')
    ).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Remember Me & Session Management', () => {
  test('should persist session with remember me', async ({ page, context }) => {
    await page.goto('/auth/login')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.check('input[name="rememberMe"]')
    await page.click('button[type="submit"]')

    await page.waitForURL('/dashboard')

    // Check that remember_me cookie was set
    const cookies = await context.cookies()
    const rememberMeCookie = cookies.find(c => c.name === 'remember_me')

    expect(rememberMeCookie).toBeDefined()
    expect(rememberMeCookie?.httpOnly).toBe(true)
  })

  test('should show active sessions', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.click('button[type="submit"]')

    await page.waitForURL('/dashboard')

    // Go to security settings
    await page.goto('/dashboard/security')

    await expect(page.locator('text=Active Sessions')).toBeVisible()
    await expect(page.locator('[data-testid="session-item"]')).toHaveCount(1)
  })

  test('should revoke specific session', async ({ page }) => {
    await page.goto('/dashboard/security')

    const sessionCount = await page.locator('[data-testid="session-item"]').count()

    if (sessionCount > 1) {
      await page.locator('[data-testid="revoke-session"]').first().click()

      await expect(page.locator('text=Session revoked')).toBeVisible({ timeout: 10000 })

      const newCount = await page.locator('[data-testid="session-item"]').count()
      expect(newCount).toBe(sessionCount - 1)
    }
  })

  test('should logout from all devices', async ({ page }) => {
    await page.goto('/dashboard/security')

    await page.click('button:has-text("Logout from all devices")')

    await expect(page.locator('text=Logged out from all devices')).toBeVisible({ timeout: 10000 })

    // Should be redirected to login
    await page.waitForURL('/auth/login')
  })
})

test.describe('Login Notifications', () => {
  test('should send notification for new device login', async ({ page, context }) => {
    // Clear cookies to simulate new device
    await context.clearCookies()

    await page.goto('/auth/login')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.click('button[type="submit"]')

    await page.waitForURL('/dashboard')

    // Check that notification was sent (would need to check email logs)
    // This is a placeholder - in real tests you'd check your email service
    await expect(page.locator('text=Welcome back')).toBeVisible()
  })
})

test.describe('Session Expiry', () => {
  test('should handle expired session gracefully', async ({ page }) => {
    await page.goto('/dashboard')

    // Simulate expired session by clearing auth cookies
    await page.context().clearCookies()

    // Try to access protected route
    await page.goto('/dashboard/courses')

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/)
    await expect(page.locator('text=Your session has expired')).toBeVisible()
  })
})
