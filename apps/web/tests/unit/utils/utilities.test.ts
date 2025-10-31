/**
 * Unit Tests - Progress Tracking Service
 * Test business logic for tracking student progress
 */

describe('Progress Tracking Service', () => {
  describe('calculateWatchTime', () => {
    test('should calculate watch time correctly', () => {
      const startTime = new Date('2025-01-01T10:00:00Z')
      const endTime = new Date('2025-01-01T10:30:00Z')

      const { calculateWatchTime } = require('@/lib/services/progress')
      const duration = calculateWatchTime(startTime, endTime)

      expect(duration).toBe(1800) // 30 minutes in seconds
    })

    test('should handle same start and end time', () => {
      const time = new Date()

      const { calculateWatchTime } = require('@/lib/services/progress')
      const duration = calculateWatchTime(time, time)

      expect(duration).toBe(0)
    })
  })

  describe('calculateLearningStreak', () => {
    test('should calculate current streak correctly', () => {
      const activities = [
        { date: '2025-01-05' },
        { date: '2025-01-04' },
        { date: '2025-01-03' },
        { date: '2025-01-01' }, // Gap breaks streak
        { date: '2024-12-31' },
      ]

      const { calculateLearningStreak } = require('@/lib/services/progress')
      const streak = calculateLearningStreak(activities)

      expect(streak.current).toBe(3)
      expect(streak.longest).toBeGreaterThanOrEqual(3)
    })

    test('should return 0 for no activity', () => {
      const { calculateLearningStreak } = require('@/lib/services/progress')
      const streak = calculateLearningStreak([])

      expect(streak.current).toBe(0)
      expect(streak.longest).toBe(0)
    })
  })

  describe('markLessonComplete', () => {
    test('should mark lesson as complete with timestamp', () => {
      const lessonId = 'lesson-123'
      const userId = 'user-456'

      const { markLessonComplete } = require('@/lib/services/progress')
      const result = markLessonComplete(userId, lessonId)

      expect(result.completed).toBe(true)
      expect(result.completed_at).toBeTruthy()
    })

    test('should update course progress percentage', () => {
      const { markLessonComplete, getCourseProgress } = require('@/lib/services/progress')
      
      markLessonComplete('user-1', 'lesson-1')
      markLessonComplete('user-1', 'lesson-2')
      
      const progress = getCourseProgress('user-1', 'course-1')
      
      expect(progress.completed_lessons).toBe(2)
    })
  })

  describe('saveVideoProgress', () => {
    test('should save playback position', () => {
      const { saveVideoProgress, getVideoProgress } = require('@/lib/services/progress')
      
      saveVideoProgress('user-1', 'video-1', 120, 300)
      const progress = getVideoProgress('user-1', 'video-1')

      expect(progress.position).toBe(120)
      expect(progress.duration).toBe(300)
      expect(progress.percentage).toBe(40)
    })

    test('should track total watch time', () => {
      const { saveVideoProgress, getTotalWatchTime } = require('@/lib/services/progress')
      
      saveVideoProgress('user-1', 'video-1', 120, 300)
      saveVideoProgress('user-1', 'video-2', 180, 600)
      
      const totalTime = getTotalWatchTime('user-1')
      
      expect(totalTime).toBe(300) // 120 + 180
    })
  })
})

/**
 * Unit Tests - Validation Utilities
 */
describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    test('should accept valid email addresses', () => {
      const { validateEmail } = require('@/lib/utils/validation')
      
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true)
    })

    test('should reject invalid email addresses', () => {
      const { validateEmail } = require('@/lib/utils/validation')
      
      expect(validateEmail('notanemail')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    test('should accept strong passwords', () => {
      const { validatePassword } = require('@/lib/utils/validation')
      
      expect(validatePassword('Password123!')).toBe(true)
      expect(validatePassword('C0mpl3x@Pass')).toBe(true)
    })

    test('should reject weak passwords', () => {
      const { validatePassword } = require('@/lib/utils/validation')
      
      expect(validatePassword('short')).toBe(false)
      expect(validatePassword('nouppercaseordigits')).toBe(false)
      expect(validatePassword('NoDigits!')).toBe(false)
    })

    test('should require minimum 8 characters', () => {
      const { validatePassword } = require('@/lib/utils/validation')
      
      expect(validatePassword('Pass1!')).toBe(false)
      expect(validatePassword('Password1!')).toBe(true)
    })
  })

  describe('sanitizeInput', () => {
    test('should remove HTML tags', () => {
      const { sanitizeInput } = require('@/lib/utils/validation')
      
      const input = '<script>alert("xss")</script>Hello'
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).toContain('Hello')
    })

    test('should escape special characters', () => {
      const { sanitizeInput } = require('@/lib/utils/validation')
      
      const input = '<div>Test & "quotes"</div>'
      const sanitized = sanitizeInput(input)
      
      expect(sanitized).not.toContain('<div>')
      expect(sanitized).toContain('Test')
    })
  })

  describe('validateCoursePrice', () => {
    test('should accept valid prices', () => {
      const { validateCoursePrice } = require('@/lib/utils/validation')
      
      expect(validateCoursePrice(0)).toBe(true) // Free
      expect(validateCoursePrice(49.99)).toBe(true)
      expect(validateCoursePrice(299)).toBe(true)
    })

    test('should reject invalid prices', () => {
      const { validateCoursePrice } = require('@/lib/utils/validation')
      
      expect(validateCoursePrice(-10)).toBe(false)
      expect(validateCoursePrice(10000)).toBe(false) // Too high
    })
  })
})

/**
 * Unit Tests - Date Helpers
 */
describe('Date Utilities', () => {
  describe('formatDuration', () => {
    test('should format seconds to HH:MM:SS', () => {
      const { formatDuration } = require('@/lib/utils/date')
      
      expect(formatDuration(3661)).toBe('01:01:01')
      expect(formatDuration(125)).toBe('00:02:05')
      expect(formatDuration(59)).toBe('00:00:59')
    })

    test('should handle zero duration', () => {
      const { formatDuration } = require('@/lib/utils/date')
      
      expect(formatDuration(0)).toBe('00:00:00')
    })
  })

  describe('calculateTimeRemaining', () => {
    test('should calculate time until deadline', () => {
      const { calculateTimeRemaining } = require('@/lib/utils/date')
      
      const now = new Date('2025-01-01T10:00:00Z')
      const deadline = new Date('2025-01-01T11:30:00Z')
      
      const remaining = calculateTimeRemaining(now, deadline)
      
      expect(remaining.hours).toBe(1)
      expect(remaining.minutes).toBe(30)
    })

    test('should return 0 for past deadlines', () => {
      const { calculateTimeRemaining } = require('@/lib/utils/date')
      
      const now = new Date('2025-01-01T12:00:00Z')
      const deadline = new Date('2025-01-01T10:00:00Z')
      
      const remaining = calculateTimeRemaining(now, deadline)
      
      expect(remaining.hours).toBe(0)
      expect(remaining.minutes).toBe(0)
    })
  })

  describe('isWithinDateRange', () => {
    test('should check if date is within range', () => {
      const { isWithinDateRange } = require('@/lib/utils/date')
      
      const date = new Date('2025-01-15')
      const start = new Date('2025-01-01')
      const end = new Date('2025-01-31')
      
      expect(isWithinDateRange(date, start, end)).toBe(true)
    })

    test('should return false for dates outside range', () => {
      const { isWithinDateRange } = require('@/lib/utils/date')
      
      const date = new Date('2025-02-15')
      const start = new Date('2025-01-01')
      const end = new Date('2025-01-31')
      
      expect(isWithinDateRange(date, start, end)).toBe(false)
    })
  })
})
