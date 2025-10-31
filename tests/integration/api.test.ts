/**
 * API Integration Tests
 * Tests all API endpoints with authentication, validation, and error handling
 */

import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'
import {
  createTestUser,
  createTestCourse,
  enrollUserInCourse,
  deleteTestUser,
  createAuthenticatedRequest,
} from '../fixtures/test-helpers'

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

describe('API Integration Tests', () => {
  let authToken: string
  let user: any
  let course: any

  beforeAll(async () => {
    user = await createTestUser()
    const instructor = await createTestUser({ role: 'instructor' })
    course = await createTestCourse(instructor.user.id)

    // Get auth token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data } = await supabase.auth.signInWithPassword({
      email: user.profile.email,
      password: 'Test123!@#',
    })
    
    authToken = data.session?.access_token!
  })

  afterAll(async () => {
    if (user) await deleteTestUser(user.user.id)
  })

  describe('Authentication APIs', () => {
    test('POST /api/auth/login should authenticate user', async () => {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.profile.email,
          password: 'Test123!@#',
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('session')
      expect(data).toHaveProperty('user')
    })

    test('POST /api/auth/login should reject invalid credentials', async () => {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.profile.email,
          password: 'WrongPassword!',
        }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data).toHaveProperty('error')
    })

    test('POST /api/auth/password-reset should send reset email', async () => {
      const response = await fetch(`${API_BASE}/api/auth/password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.profile.email,
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.message).toMatch(/sent|email/i)
    })

    test('GET /api/auth/sessions should return user sessions', async () => {
      const response = await fetch(`${API_BASE}/api/auth/sessions`, {
        headers: createAuthenticatedRequest(authToken),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data.sessions)).toBe(true)
    })
  })

  describe('Course APIs', () => {
    test('GET /api/courses should return course list', async () => {
      const response = await fetch(`${API_BASE}/api/courses`)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data.courses)).toBe(true)
      expect(data).toHaveProperty('total')
    })

    test('GET /api/courses should support filtering', async () => {
      const response = await fetch(
        `${API_BASE}/api/courses?category=Trauma&minPrice=0&maxPrice=100`
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data.courses)).toBe(true)
    })

    test('GET /api/courses/featured should return featured courses', async () => {
      const response = await fetch(`${API_BASE}/api/courses/featured`)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data.courses)).toBe(true)
    })

    test('GET /api/courses/tags should return available tags', async () => {
      const response = await fetch(`${API_BASE}/api/courses/tags`, {
        headers: createAuthenticatedRequest(authToken),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data.tags)).toBe(true)
    })
  })

  describe('Enrollment APIs', () => {
    beforeAll(async () => {
      await enrollUserInCourse(user.user.id, course.id)
    })

    test('GET /api/enrollment/status should return enrollment status', async () => {
      const response = await fetch(
        `${API_BASE}/api/enrollment/status?courseId=${course.id}`,
        {
          headers: createAuthenticatedRequest(authToken),
        }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.enrolled).toBe(true)
      expect(data).toHaveProperty('enrollment')
    })

    test('GET /api/enrollment/check-access should verify access', async () => {
      const response = await fetch(
        `${API_BASE}/api/enrollment/check-access?courseId=${course.id}`,
        {
          headers: createAuthenticatedRequest(authToken),
        }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.hasAccess).toBe(true)
    })

    test('GET /api/enrollment/history should return enrollment history', async () => {
      const response = await fetch(`${API_BASE}/api/enrollment/history`, {
        headers: createAuthenticatedRequest(authToken),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data.enrollments)).toBe(true)
    })
  })

  describe('Progress APIs', () => {
    test('GET /api/progress/dashboard should return user progress', async () => {
      const response = await fetch(`${API_BASE}/api/progress/dashboard`, {
        headers: createAuthenticatedRequest(authToken),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('activeCourses')
      expect(data).toHaveProperty('totalTimeSpent')
      expect(data).toHaveProperty('currentStreak')
    })

    test('POST /api/progress/video should save video progress', async () => {
      const response = await fetch(`${API_BASE}/api/progress/video`, {
        method: 'POST',
        headers: createAuthenticatedRequest(authToken),
        body: JSON.stringify({
          lessonId: 'test-lesson-id',
          position: 120,
          duration: 300,
        }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    test('GET /api/progress should return progress for a course', async () => {
      const response = await fetch(
        `${API_BASE}/api/progress?courseId=${course.id}`,
        {
          headers: createAuthenticatedRequest(authToken),
        }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('progress')
    })
  })

  describe('Quiz APIs', () => {
    test('GET /api/quiz/questions should return quiz questions', async () => {
      const response = await fetch(
        `${API_BASE}/api/quiz/questions?quizId=test-quiz-id`,
        {
          headers: createAuthenticatedRequest(authToken),
        }
      )

      expect([200, 404]).toContain(response.status)
    })

    test('POST /api/quiz/attempt should create quiz attempt', async () => {
      const response = await fetch(`${API_BASE}/api/quiz/attempt`, {
        method: 'POST',
        headers: createAuthenticatedRequest(authToken),
        body: JSON.stringify({
          quizId: 'test-quiz-id',
        }),
      })

      expect([200, 400, 404]).toContain(response.status)
    })

    test('POST /api/quiz/submit should grade quiz', async () => {
      const response = await fetch(`${API_BASE}/api/quiz/submit`, {
        method: 'POST',
        headers: createAuthenticatedRequest(authToken),
        body: JSON.stringify({
          attemptId: 'test-attempt-id',
          answers: { 1: 'A', 2: 'B' },
        }),
      })

      expect([200, 400, 404]).toContain(response.status)
    })

    test('GET /api/quiz/attempts should return attempt history', async () => {
      const response = await fetch(
        `${API_BASE}/api/quiz/attempts?quizId=test-quiz-id`,
        {
          headers: createAuthenticatedRequest(authToken),
        }
      )

      expect([200, 404]).toContain(response.status)
    })
  })

  describe('Purchase APIs', () => {
    test('GET /api/purchase/pricing should return pricing info', async () => {
      const response = await fetch(`${API_BASE}/api/purchase/pricing`)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('courses')
      expect(data).toHaveProperty('memberships')
    })

    test('POST /api/purchase/validate-promo should validate promo codes', async () => {
      const response = await fetch(`${API_BASE}/api/purchase/validate-promo`, {
        method: 'POST',
        headers: createAuthenticatedRequest(authToken),
        body: JSON.stringify({
          code: 'TESTCODE',
        }),
      })

      expect([200, 404]).toContain(response.status)
    })
  })

  describe('Support APIs', () => {
    test('GET /api/support/faqs should return FAQs', async () => {
      const response = await fetch(`${API_BASE}/api/support/faqs`)

      expect([200, 404]).toContain(response.status)
    })

    test('POST /api/support/tickets should create support ticket', async () => {
      const response = await fetch(`${API_BASE}/api/support/tickets`, {
        method: 'POST',
        headers: createAuthenticatedRequest(authToken),
        body: JSON.stringify({
          subject: 'Test ticket',
          message: 'This is a test support ticket',
          category: 'technical',
        }),
      })

      expect([200, 201]).toContain(response.status)
    })
  })

  describe('Error Handling', () => {
    test('Should return 401 for protected endpoints without auth', async () => {
      const response = await fetch(`${API_BASE}/api/progress/dashboard`)

      expect(response.status).toBe(401)
    })

    test('Should return 400 for invalid request body', async () => {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Missing required fields
        }),
      })

      expect(response.status).toBe(400)
    })

    test('Should return 404 for non-existent resources', async () => {
      const response = await fetch(
        `${API_BASE}/api/courses/nonexistent-id-12345`
      )

      expect(response.status).toBe(404)
    })
  })
})
