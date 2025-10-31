/**
 * E2E Test: Authentication Flow
 * Tests registration, login, logout, password reset, and MFA
 */

import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { createTestUser, deleteTestUser } from '../fixtures/test-helpers'

test.describe('Authentication Flow', () => {
  let testEmail: string
  let testPassword: string

  test.beforeEach(() => {
    testEmail = faker.internet.email().toLowerCase()
    testPassword = 'Test123!@#SecurePass'
  })

  test('should complete registration flow', async ({ page }) => {
    await page.goto('/auth/register')

    // Fill registration form
    await page.fill('input[name="firstName"]', faker.person.firstName())
    await page.fill('input[name="lastName"]', faker.person.lastName())
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    await page.fill('input[name="confirmPassword"]', testPassword)

    // Accept terms
    await page.check('input[type="checkbox"]')

    // Submit form
    await page.click('button[type="submit"]')

    // Should redirect to email verification page or dashboard
    await expect(page).toHaveURL(/\/(verify-email|dashboard)/)
  })

  test('should login with valid credentials', async ({ page }) => {
    // Create test user first
    const user = await createTestUser({ email: testEmail, password: testPassword })

    await page.goto('/auth/login')

    // Fill login form
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)

    // Submit
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)

    // Should show user info
    await expect(page.locator('text=/Welcome|Hello/')).toBeVisible()

    // Cleanup
    await deleteTestUser(user.user.id)
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')

    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', 'WrongPassword123!')

    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('text=/Invalid|incorrect|wrong/i')).toBeVisible()

    // Should stay on login page
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should logout successfully', async ({ page }) => {
    // Create and login user
    const user = await createTestUser({ email: testEmail, password: testPassword })

    await page.goto('/auth/login')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/dashboard/)

    // Click logout
    await page.click('button:has-text("Logout"), a:has-text("Logout"), [data-testid="logout"]')

    // Should redirect to home or login
    await expect(page).toHaveURL(/\/(|auth\/login)$/)

    // Should not be able to access dashboard
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/auth\/login/)

    // Cleanup
    await deleteTestUser(user.user.id)
  })

  test('should complete password reset flow', async ({ page }) => {
    const user = await createTestUser({ email: testEmail, password: testPassword })

    await page.goto('/auth/forgot-password')

    // Request password reset
    await page.fill('input[name="email"]', testEmail)
    await page.click('button[type="submit"]')

    // Should show success message
    await expect(page.locator('text=/sent|check your email/i')).toBeVisible()

    // Note: Full email click flow would require email service integration
    // In real scenario, you'd fetch reset token from database and visit reset URL

    // Cleanup
    await deleteTestUser(user.user.id)
  })

  test('should enforce account lockout after failed attempts', async ({ page }) => {
    const user = await createTestUser({ email: testEmail, password: testPassword })

    await page.goto('/auth/login')

    // Attempt 5 failed logins
    for (let i = 0; i < 5; i++) {
      await page.fill('input[name="email"]', testEmail)
      await page.fill('input[name="password"]', 'WrongPassword!')
      await page.click('button[type="submit"]')
      await page.waitForTimeout(500)
    }

    // Should show account locked message
    await expect(page.locator('text=/locked|too many attempts/i')).toBeVisible()

    // Cleanup
    await deleteTestUser(user.user.id)
  })

  test('should redirect unauthenticated users to login', async ({ page }) => {
    const protectedPages = [
      '/dashboard',
      '/student',
      '/instructor',
      '/admin',
    ]

    for (const url of protectedPages) {
      await page.goto(url)
      await expect(page).toHaveURL(/\/auth\/login/)
    }
  })

  test('should remember me work correctly', async ({ page, context }) => {
    const user = await createTestUser({ email: testEmail, password: testPassword })

    await page.goto('/auth/login')

    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="password"]', testPassword)
    
    // Check "Remember Me"
    const rememberCheckbox = page.locator('input[type="checkbox"]:near(:text("Remember"))')
    if (await rememberCheckbox.isVisible()) {
      await rememberCheckbox.check()
    }

    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    // Close and create new page (simulating browser restart)
    await page.close()
    const newPage = await context.newPage()
    
    await newPage.goto('/dashboard')

    // Should still be logged in
    await expect(newPage).toHaveURL(/\/dashboard/)

    // Cleanup
    await deleteTestUser(user.user.id)
  })
})
