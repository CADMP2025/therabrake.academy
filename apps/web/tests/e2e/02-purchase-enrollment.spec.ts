/**
 * E2E Test: Course Purchase and Enrollment Flow
 * Tests browsing courses, adding to cart, checkout, payment, and enrollment
 */

import { test, expect } from '@playwright/test'
import { 
  createTestUser, 
  createTestCourse, 
  deleteTestUser,
  deleteTestCourse,
  assertEnrollmentExists 
} from '../fixtures/test-helpers'

test.describe('Course Purchase and Enrollment', () => {
  let user: any
  let course: any
  const testPassword = 'Test123!@#'

  test.beforeEach(async () => {
    // Create test user
    user = await createTestUser({ password: testPassword })
    
    // Create test instructor
    const instructor = await createTestUser({ role: 'instructor' })
    
    // Create test course
    course = await createTestCourse(instructor.user.id, {
      title: 'E2E Test Course',
      price: 99,
      ce_hours: 5,
    })
  })

  test.afterEach(async () => {
    if (user) await deleteTestUser(user.user.id)
    if (course) await deleteTestCourse(course.id)
  })

  test('should browse and filter courses', async ({ page }) => {
    await page.goto('/courses')

    // Should see course catalog
    await expect(page.locator('h1')).toContainText(/Courses|Catalog/i)

    // Should see the test course
    await expect(page.locator(`text=${course.title}`)).toBeVisible()

    // Test filtering
    await page.click('text=/Filter|Category/')
    await page.click('text=/Trauma|CBT|Ethics/') // Select a category

    // Results should update
    await page.waitForTimeout(500)

    // Test search
    await page.fill('input[placeholder*="Search"], input[name="search"]', course.title.slice(0, 10))
    await page.waitForTimeout(500)

    // Should still see our course
    await expect(page.locator(`text=${course.title}`)).toBeVisible()
  })

  test('should view course details', async ({ page }) => {
    await page.goto(`/courses/${course.id}`)

    // Should see course information
    await expect(page.locator('h1')).toContainText(course.title)
    await expect(page.locator('text=/\\$\\d+/')).toBeVisible() // Price
    await expect(page.locator(`text=/${course.ce_hours}.*hour/i`)).toBeVisible() // CE hours

    // Should see enroll/purchase button
    await expect(page.locator('button:has-text("Enroll"), button:has-text("Purchase"), button:has-text("Buy")')).toBeVisible()
  })

  test('should complete checkout flow', async ({ page, context }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    // Go to course page
    await page.goto(`/courses/${course.id}`)

    // Click enroll/purchase
    await page.click('button:has-text("Enroll"), button:has-text("Purchase"), button:has-text("Buy")')

    // Should redirect to checkout
    await page.waitForURL(/\/checkout/)

    // Fill checkout form (if needed)
    const nameInput = page.locator('input[name="name"], input[name="cardholderName"]')
    if (await nameInput.isVisible()) {
      await nameInput.fill(`${user.profile.first_name} ${user.profile.last_name}`)
    }

    // Use Stripe test card
    const cardNumberFrame = page.frameLocator('iframe[name*="cardNumber"]')
    const cardNumber = cardNumberFrame.locator('input[name="cardnumber"], input[placeholder*="Card number"]')
    
    if (await cardNumber.isVisible()) {
      await cardNumber.fill('4242424242424242')
      
      const expiryFrame = page.frameLocator('iframe[name*="cardExpiry"]')
      await expiryFrame.locator('input').fill('1225')
      
      const cvcFrame = page.frameLocator('iframe[name*="cardCvc"]')
      await cvcFrame.locator('input').fill('123')
    }

    // Submit payment
    await page.click('button[type="submit"]:has-text("Pay"), button:has-text("Complete Purchase")')

    // Should redirect to success page or course page
    await page.waitForURL(/\/(success|courses|learn)/, { timeout: 15000 })

    // Verify enrollment was created
    await assertEnrollmentExists(user.user.id, course.id)
  })

  test('should apply promo code', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto(`/courses/${course.id}`)
    await page.click('button:has-text("Enroll"), button:has-text("Purchase")')
    await page.waitForURL(/\/checkout/)

    // Look for promo code input
    const promoInput = page.locator('input[name="promoCode"], input[placeholder*="promo"], input[placeholder*="coupon"]')
    
    if (await promoInput.isVisible()) {
      await promoInput.fill('TESTCODE10')
      await page.click('button:has-text("Apply")')
      
      // Should show discount
      await expect(page.locator('text=/discount|saved/i')).toBeVisible()
    }
  })

  test('should enroll with membership subscription', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto('/pricing')

    // Click subscribe on a membership tier
    await page.click('button:has-text("Subscribe"):first, button:has-text("Get Started"):first')

    await page.waitForURL(/\/checkout/)

    // Complete subscription checkout (similar to course purchase)
    // ...subscription-specific steps would go here
  })

  test('should show enrolled status after purchase', async ({ page }) => {
    // Manually enroll user
    const { enrollUserInCourse } = await import('../fixtures/test-helpers')
    await enrollUserInCourse(user.user.id, course.id)

    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto(`/courses/${course.id}`)

    // Should show enrolled status instead of purchase button
    await expect(page.locator('text=/enrolled|start learning|continue/i')).toBeVisible()
    await expect(page.locator('button:has-text("Purchase"), button:has-text("Buy")')).not.toBeVisible()
  })

  test('should handle payment failure gracefully', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto(`/courses/${course.id}`)
    await page.click('button:has-text("Enroll"), button:has-text("Purchase")')
    await page.waitForURL(/\/checkout/)

    // Use declined test card
    const cardNumberFrame = page.frameLocator('iframe[name*="cardNumber"]')
    const cardNumber = cardNumberFrame.locator('input[name="cardnumber"], input[placeholder*="Card number"]')
    
    if (await cardNumber.isVisible()) {
      await cardNumber.fill('4000000000000002') // Declined card
      
      const expiryFrame = page.frameLocator('iframe[name*="cardExpiry"]')
      await expiryFrame.locator('input').fill('1225')
      
      const cvcFrame = page.frameLocator('iframe[name*="cardCvc"]')
      await cvcFrame.locator('input').fill('123')
    }

    await page.click('button[type="submit"]:has-text("Pay")')

    // Should show error message
    await expect(page.locator('text=/declined|failed|error/i')).toBeVisible({ timeout: 10000 })
  })
})
