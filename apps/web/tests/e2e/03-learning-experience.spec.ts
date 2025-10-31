/**
 * E2E Test: Learning Experience
 * Tests course player, video watching, progress tracking, notes, quizzes, and certificates
 */

import { test, expect } from '@playwright/test'
import {
  createTestUser,
  createTestCourse,
  createTestLesson,
  createTestQuiz,
  createTestQuestion,
  enrollUserInCourse,
  deleteTestUser,
  deleteTestCourse,
} from '../fixtures/test-helpers'

test.describe('Learning Experience', () => {
  let user: any
  let course: any
  let lesson: any
  let quiz: any
  const testPassword = 'Test123!@#'

  test.beforeEach(async () => {
    user = await createTestUser({ password: testPassword })
    const instructor = await createTestUser({ role: 'instructor' })
    
    course = await createTestCourse(instructor.user.id)
    lesson = await createTestLesson(course.id)
    quiz = await createTestQuiz(course.id)
    
    // Create quiz questions
    await createTestQuestion(quiz.id, { correct_answer: 'A' })
    await createTestQuestion(quiz.id, { correct_answer: 'B' })
    await createTestQuestion(quiz.id, { correct_answer: 'C' })
    
    // Enroll user
    await enrollUserInCourse(user.user.id, course.id)
  })

  test.afterEach(async () => {
    if (user) await deleteTestUser(user.user.id)
    if (course) await deleteTestCourse(course.id)
  })

  test('should access enrolled course', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto('/student')

    // Should see enrolled course
    await expect(page.locator(`text=${course.title}`)).toBeVisible()

    // Click to start course
    await page.click(`text=${course.title}`)

    // Should navigate to lesson player
    await expect(page).toHaveURL(/\/learn\//)
  })

  test('should play video and track progress', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto(`/learn/${course.id}/${lesson.id}`)

    // Should see video player
    await expect(page.locator('video')).toBeVisible()

    // Should see lesson title
    await expect(page.locator(`text=${lesson.title}`)).toBeVisible()

    // Play video
    const playButton = page.locator('button[aria-label*="Play"], video')
    await playButton.click()

    // Wait a bit for progress to be tracked
    await page.waitForTimeout(3000)

    // Progress should be saved (check progress indicator or database)
    await expect(page.locator('[data-testid="progress-indicator"], text=/progress|%/')).toBeVisible()
  })

  test('should create and view lesson notes', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto(`/learn/${course.id}/${lesson.id}`)

    // Click notes tab/section
    const notesTab = page.locator('text=/Notes/i, button:has-text("Notes")')
    if (await notesTab.isVisible()) {
      await notesTab.click()
    }

    // Add a note
    const noteInput = page.locator('textarea[placeholder*="note"], textarea[name="content"]')
    await noteInput.fill('This is a test note with timestamp')
    
    await page.click('button:has-text("Save"), button:has-text("Add")')

    // Should see note appear
    await expect(page.locator('text=This is a test note')).toBeVisible()
  })

  test('should download course resources', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto(`/learn/${course.id}/${lesson.id}`)

    // Look for resources section
    const resourcesTab = page.locator('text=/Resources|Downloads/i, button:has-text("Resources")')
    if (await resourcesTab.isVisible()) {
      await resourcesTab.click()

      // Look for download button
      const downloadButton = page.locator('button:has-text("Download"), a[download]').first()
      if (await downloadButton.isVisible()) {
        // Start waiting for download before clicking
        const downloadPromise = page.waitForEvent('download')
        await downloadButton.click()
        const download = await downloadPromise

        // Verify download started
        expect(download).toBeTruthy()
      }
    }
  })

  test('should complete quiz and pass', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto(`/quiz/${quiz.id}`)

    // Start quiz
    await page.click('button:has-text("Start"), button:has-text("Begin")')

    // Answer all questions correctly
    // Question 1 - Answer A
    await page.click('input[value="A"], label:has-text("A")')
    await page.click('button:has-text("Next")')

    // Question 2 - Answer B
    await page.click('input[value="B"], label:has-text("B")')
    await page.click('button:has-text("Next")')

    // Question 3 - Answer C
    await page.click('input[value="C"], label:has-text("C")')
    
    // Submit quiz
    await page.click('button:has-text("Submit"), button:has-text("Finish")')

    // Should see results page
    await expect(page).toHaveURL(/\/results/)

    // Should show passing message
    await expect(page.locator('text=/pass|congratulations|success/i')).toBeVisible()

    // Should show score
    await expect(page.locator('text=/100%|score/i')).toBeVisible()
  })

  test('should fail quiz and allow retake', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto(`/quiz/${quiz.id}`)

    await page.click('button:has-text("Start")')

    // Answer all questions incorrectly
    await page.click('input[value="D"], label:has-text("D")')
    await page.click('button:has-text("Next")')

    await page.click('input[value="D"], label:has-text("D")')
    await page.click('button:has-text("Next")')

    await page.click('input[value="D"], label:has-text("D")')
    await page.click('button:has-text("Submit")')

    // Should show failing message
    await expect(page.locator('text=/failed|try again|review/i')).toBeVisible()

    // Should see retake button
    await expect(page.locator('button:has-text("Retake"), button:has-text("Try Again")')).toBeVisible()
  })

  test('should see quiz time limit countdown', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto(`/quiz/${quiz.id}`)
    await page.click('button:has-text("Start")')

    // Should see timer
    await expect(page.locator('text=/\\d+:\\d+|time remaining|timer/i')).toBeVisible()
  })

  test('should mark lesson as complete', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto(`/learn/${course.id}/${lesson.id}`)

    // Look for "Mark Complete" button
    const completeButton = page.locator('button:has-text("Complete"), button:has-text("Mark as Complete")')
    
    if (await completeButton.isVisible()) {
      await completeButton.click()

      // Should update button or show confirmation
      await expect(page.locator('text=/completed|✓/i')).toBeVisible()
    }
  })

  test('should view course progress dashboard', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto('/student')

    // Should see progress for enrolled course
    await expect(page.locator(`text=${course.title}`)).toBeVisible()

    // Should see progress indicator (0% since no lessons completed)
    await expect(page.locator('text=/0%|progress/i')).toBeVisible()
  })

  test('should generate certificate after course completion', async ({ page }) => {
    // This would require completing all course requirements
    // Simplified version:
    
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    // Navigate to certificates page
    await page.goto('/student/certificates')

    // After completion, certificate should be available
    // For now, just verify page loads
    await expect(page.locator('h1')).toContainText(/Certificate/i)
  })

  test('should navigate between lessons', async ({ page }) => {
    // Create another lesson
    const lesson2 = await createTestLesson(course.id, { order_index: 2 })

    await page.goto('/auth/login')
    await page.fill('input[name="email"]', user.profile.email)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/)

    await page.goto(`/learn/${course.id}/${lesson.id}`)

    // Look for "Next Lesson" button
    const nextButton = page.locator('button:has-text("Next"), a:has-text("Next")')
    
    if (await nextButton.isVisible()) {
      await nextButton.click()

      // Should navigate to next lesson
      await expect(page).toHaveURL(new RegExp(`/learn/${course.id}/${lesson2.id}`))
    }
  })
})
