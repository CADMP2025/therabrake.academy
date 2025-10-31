/**
 * Application constants shared across platforms
 */

export const APP_NAME = 'TheraBrake Academy'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Pause, Process, Progress. Professional continuing education and personal development courses.'

// API endpoints
export const API_VERSION = 'v1'

// Course levels
export const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const
export type CourseLevel = typeof COURSE_LEVELS[number]

// User roles
export const USER_ROLES = ['student', 'instructor', 'admin'] as const
export type UserRole = typeof USER_ROLES[number]

// Enrollment status
export const ENROLLMENT_STATUS = ['active', 'completed', 'expired'] as const
export type EnrollmentStatus = typeof ENROLLMENT_STATUS[number]

// Course status
export const COURSE_STATUS = ['draft', 'published', 'archived'] as const
export type CourseStatus = typeof COURSE_STATUS[number]

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

// Video player
export const VIDEO_SAVE_INTERVAL = 10000 // 10 seconds
export const VIDEO_COMPLETION_THRESHOLD = 0.98 // 98%

// Progress tracking
export const MIN_PROGRESS_UPDATE_INTERVAL = 5 // seconds

// Certificate requirements
export const MIN_COMPLETION_FOR_CERTIFICATE = 0.95 // 95%
export const TX_LPC_MIN_QUIZ_QUESTIONS = 10

// Texas LPC requirements
export const TX_LPC_REQUIREMENTS = {
  TOTAL_CE_HOURS: 24,
  ETHICS_HOURS: 6,
  DIVERSITY_HOURS: 3,
  SUPERVISION_HOURS: 6, // for supervisors
  JURISPRUDENCE_CREDIT: 1,
  QUALIFYING_PROVIDER_PERCENTAGE: 0.5,
  MAX_CARRYFORWARD_HOURS: 10,
  RECORD_RETENTION_YEARS: 3,
}

// Contact info
export const CONTACT_EMAIL = 'support@therabrake.academy'
export const CONTACT_PHONE = '1-800-THERABRAKE'

// Social media
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/therabrakeacademy',
  twitter: 'https://twitter.com/therabrake',
  linkedin: 'https://linkedin.com/company/therabrake-academy',
  instagram: 'https://instagram.com/therabrakeacademy',
}
