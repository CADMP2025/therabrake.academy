/**
 * Unit Tests - Enrollment Service
 * Test business logic for course enrollments
 */

import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}))

describe('Enrollment Service', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      rpc: jest.fn(),
    }
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  describe('enrollUserInCourse', () => {
    test('should create enrollment with valid data', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()

      mockSupabase.single.mockResolvedValueOnce({
        data: {
          id: faker.string.uuid(),
          user_id: userId,
          course_id: courseId,
          enrolled_at: new Date().toISOString(),
          status: 'active',
        },
        error: null,
      })

      const { enrollUserInCourse } = await import('@/lib/services/enrollment')
      const result = await enrollUserInCourse(userId, courseId)

      expect(result).toBeTruthy()
      expect(result.user_id).toBe(userId)
      expect(result.course_id).toBe(courseId)
      expect(result.status).toBe('active')
    })

    test('should prevent duplicate enrollments', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()

      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: '23505', message: 'duplicate key value' },
      })

      const { enrollUserInCourse } = await import('@/lib/services/enrollment')
      
      await expect(
        enrollUserInCourse(userId, courseId)
      ).rejects.toThrow(/duplicate|already enrolled/i)
    })

    test('should validate user exists before enrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()

      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: '23503', message: 'foreign key constraint' },
      })

      const { enrollUserInCourse } = await import('@/lib/services/enrollment')
      
      await expect(
        enrollUserInCourse(userId, courseId)
      ).rejects.toThrow(/user.*not found/i)
    })

    test('should validate course exists before enrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = 'invalid-course-id'

      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: '23503', message: 'course not found' },
      })

      const { enrollUserInCourse } = await import('@/lib/services/enrollment')
      
      await expect(
        enrollUserInCourse(userId, courseId)
      ).rejects.toThrow(/course.*not found/i)
    })
  })

  describe('checkEnrollmentAccess', () => {
    test('should return true for active enrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()

      mockSupabase.single.mockResolvedValueOnce({
        data: {
          status: 'active',
          expires_at: null,
        },
        error: null,
      })

      const { checkEnrollmentAccess } = await import('@/lib/services/enrollment')
      const hasAccess = await checkEnrollmentAccess(userId, courseId)

      expect(hasAccess).toBe(true)
    })

    test('should return false for expired enrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()
      const pastDate = new Date('2020-01-01').toISOString()

      mockSupabase.single.mockResolvedValueOnce({
        data: {
          status: 'active',
          expires_at: pastDate,
        },
        error: null,
      })

      const { checkEnrollmentAccess } = await import('@/lib/services/enrollment')
      const hasAccess = await checkEnrollmentAccess(userId, courseId)

      expect(hasAccess).toBe(false)
    })

    test('should return false for suspended enrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()

      mockSupabase.single.mockResolvedValueOnce({
        data: {
          status: 'suspended',
          expires_at: null,
        },
        error: null,
      })

      const { checkEnrollmentAccess } = await import('@/lib/services/enrollment')
      const hasAccess = await checkEnrollmentAccess(userId, courseId)

      expect(hasAccess).toBe(false)
    })

    test('should return false for non-existent enrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()

      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116', message: 'not found' },
      })

      const { checkEnrollmentAccess } = await import('@/lib/services/enrollment')
      const hasAccess = await checkEnrollmentAccess(userId, courseId)

      expect(hasAccess).toBe(false)
    })
  })

  describe('calculateCourseProgress', () => {
    test('should calculate progress correctly with completed lessons', async () => {
      const enrollmentId = faker.string.uuid()

      mockSupabase.rpc.mockResolvedValueOnce({
        data: {
          total_lessons: 10,
          completed_lessons: 7,
          progress_percentage: 70,
        },
        error: null,
      })

      const { calculateCourseProgress } = await import('@/lib/services/enrollment')
      const progress = await calculateCourseProgress(enrollmentId)

      expect(progress.total_lessons).toBe(10)
      expect(progress.completed_lessons).toBe(7)
      expect(progress.progress_percentage).toBe(70)
    })

    test('should return 0% for course with no lessons', async () => {
      const enrollmentId = faker.string.uuid()

      mockSupabase.rpc.mockResolvedValueOnce({
        data: {
          total_lessons: 0,
          completed_lessons: 0,
          progress_percentage: 0,
        },
        error: null,
      })

      const { calculateCourseProgress } = await import('@/lib/services/enrollment')
      const progress = await calculateCourseProgress(enrollmentId)

      expect(progress.progress_percentage).toBe(0)
    })

    test('should return 100% for fully completed course', async () => {
      const enrollmentId = faker.string.uuid()

      mockSupabase.rpc.mockResolvedValueOnce({
        data: {
          total_lessons: 15,
          completed_lessons: 15,
          progress_percentage: 100,
        },
        error: null,
      })

      const { calculateCourseProgress } = await import('@/lib/services/enrollment')
      const progress = await calculateCourseProgress(enrollmentId)

      expect(progress.progress_percentage).toBe(100)
      expect(progress.completed_lessons).toBe(progress.total_lessons)
    })
  })

  describe('unenrollUser', () => {
    test('should soft delete enrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()

      mockSupabase.single.mockResolvedValueOnce({
        data: {
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        },
        error: null,
      })

      const { unenrollUser } = await import('@/lib/services/enrollment')
      const result = await unenrollUser(userId, courseId)

      expect(result.status).toBe('cancelled')
      expect(result.cancelled_at).toBeTruthy()
    })

    test('should preserve enrollment data after unenrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()
      const progress = 75

      mockSupabase.single.mockResolvedValueOnce({
        data: {
          status: 'cancelled',
          progress_percentage: progress,
          cancelled_at: new Date().toISOString(),
        },
        error: null,
      })

      const { unenrollUser } = await import('@/lib/services/enrollment')
      const result = await unenrollUser(userId, courseId)

      expect(result.progress_percentage).toBe(progress)
    })
  })

  describe('grantCertificateAccess', () => {
    test('should grant certificate for completed course', async () => {
      const enrollmentId = faker.string.uuid()

      mockSupabase.single.mockResolvedValueOnce({
        data: {
          certificate_granted: true,
          certificate_issued_at: new Date().toISOString(),
        },
        error: null,
      })

      const { grantCertificateAccess } = await import('@/lib/services/enrollment')
      const result = await grantCertificateAccess(enrollmentId)

      expect(result.certificate_granted).toBe(true)
      expect(result.certificate_issued_at).toBeTruthy()
    })

    test('should reject certificate for incomplete course', async () => {
      const enrollmentId = faker.string.uuid()

      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Course not completed' },
      })

      const { grantCertificateAccess } = await import('@/lib/services/enrollment')
      
      await expect(
        grantCertificateAccess(enrollmentId)
      ).rejects.toThrow(/not completed/i)
    })
  })
})
