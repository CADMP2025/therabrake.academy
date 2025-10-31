/**
 * Unit Tests - Enrollment Service
 * Test business logic for course enrollments
 */

import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'
import { EnrollmentService } from '@/lib/services/enrollment-service'

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}))

describe('Enrollment Service', () => {
  let mockSupabase: any
  let service: EnrollmentService

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn(),
      maybeSingle: jest.fn(),
      rpc: jest.fn(),
    }
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
    service = EnrollmentService.getInstance()
  })

  describe('grantAccess', () => {
    test('should error when no product specified', async () => {
      const res = await service.grantAccess({ userId: faker.string.uuid() })
  expect(res.success).toBe(false)
      expect(res.code).toBe('MISSING_PRODUCT')
    })

    test('should return existing active enrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()

      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { id: faker.string.uuid(), status: 'active' },
        error: null,
      })

      const res = await service.grantAccess({ userId, courseId })
  expect(res.success).toBe(true)
      expect(res.data?.status).toBe('active')
    })

    test('should create enrollment when none exists', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()

      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: faker.string.uuid(), status: 'active' },
        error: null,
      })

      const res = await service.grantAccess({ userId, courseId })
  expect(res.success).toBe(true)
      expect(res.data?.status).toBe('active')
    })
  })

  describe('hasAccess', () => {
    test('should return true for active enrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()

      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { status: 'active', expires_at: null },
        error: null,
      })

      const hasAccess = await service.hasAccess(userId, courseId)

      expect(hasAccess).toBe(true)
    })

    test('should return false for expired enrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()
      const pastDate = new Date('2020-01-01').toISOString()

      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { status: 'active', expires_at: pastDate, grace_period_ends_at: pastDate },
        error: null,
      })

      const hasAccess = await service.hasAccess(userId, courseId)

      expect(hasAccess).toBe(false)
    })

    test('should return false for suspended enrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()

      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: { status: 'suspended', expires_at: null },
        error: null,
      })

      const hasAccess = await service.hasAccess(userId, courseId)

      expect(hasAccess).toBe(false)
    })

    test('should return false for non-existent enrollment', async () => {
      const userId = faker.string.uuid()
      const courseId = faker.string.uuid()

      mockSupabase.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      })

      const hasAccess = await service.hasAccess(userId, courseId)

      expect(hasAccess).toBe(false)
    })
  })

  describe('extendEnrollment', () => {
    test('should extend expiration date', async () => {
      const enrollmentId = faker.string.uuid()
      const current = new Date()
      const existing = { id: enrollmentId, expires_at: current.toISOString(), grace_period_ends_at: null, metadata: {} }

      mockSupabase.single
        .mockResolvedValueOnce({ data: existing, error: null }) // fetch current
        .mockResolvedValueOnce({ data: { ...existing, status: 'active' }, error: null }) // update select single

      const res = await service.extendEnrollment({ enrollmentId, extensionDays: 7 })
  expect(res.success).toBe(true)
      expect(res.data?.status).toBe('active')
    })
  })

  describe('revokeAccess', () => {
    test('should mark enrollment as revoked', async () => {
      mockSupabase.eq.mockReturnThis()
      mockSupabase.update.mockReturnThis()
      const res = await service.revokeAccess(faker.string.uuid(), 'test')
      // Since we did not set error, we expect success
  expect(res.success).toBe(true)
    })
  })

  describe('getEnrollmentStatus', () => {
    test('should compute status flags', async () => {
      const now = new Date()
      const future = new Date(now.getTime() + 3 * 24 * 3600 * 1000).toISOString()
      mockSupabase.select.mockReturnThis()
      mockSupabase.eq.mockReturnThis()
      mockSupabase.order.mockReturnThis()
      ;(mockSupabase as any).from.mockReturnThis()
      // Return list of enrollments
      mockSupabase.select.mockResolvedValueOnce({
        data: [
          { id: 'e1', user_id: 'u', status: 'active', enrolled_at: now.toISOString(), expires_at: future, grace_period_ends_at: null },
        ],
        error: null,
      })

      const res = await service.getEnrollmentStatus('u')
  expect(res.success).toBe(true)
      expect(res.data?.[0].canExtend).toBe(true)
    })
  })
})
