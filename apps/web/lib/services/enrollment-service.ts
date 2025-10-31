/**
 * EnrollmentService
 * 
 * Handles enrollment lifecycle:
 * - Access grant and revocation
 * - Expiration tracking and grace periods
 * - Course extensions
 * - Enrollment status management
 * - Expiration warning scheduling
 */

import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/monitoring/logger'
import { BaseService, ServiceResponse } from './base-service'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface EnrollmentParams {
  userId: string
  courseId?: string
  programType?: string
  membershipTier?: string
  paymentIntentId?: string
  subscriptionId?: string
  expiresAt?: Date
  gracePeriodDays?: number
  metadata?: Record<string, string>
}

export interface EnrollmentResult {
  enrollmentId: string
  status: string
  expiresAt?: string
  gracePeriodEndsAt?: string
}

export interface ExtendEnrollmentParams {
  enrollmentId: string
  extensionDays: number
  paymentIntentId?: string
  reason?: string
}

export interface EnrollmentStatus {
  enrollmentId: string
  userId: string
  courseId?: string
  programType?: string
  status: string
  enrolledAt: string
  expiresAt?: string
  gracePeriodEndsAt?: string
  daysRemaining?: number
  isExpired: boolean
  isInGracePeriod: boolean
  canExtend: boolean
}

export interface ExpiringEnrollment {
  enrollmentId: string
  userId: string
  userEmail: string
  courseId?: string
  courseName?: string
  programType?: string
  expiresAt: string
  daysRemaining: number
}

export class EnrollmentService extends BaseService {
  private static instance: EnrollmentService

  private constructor() {
    super()
  }

  public static getInstance(): EnrollmentService {
    if (!EnrollmentService.instance) {
      EnrollmentService.instance = new EnrollmentService()
    }
    return EnrollmentService.instance
  }

  /**
   * Grant course/program access to a user
   */
  async grantAccess(
    params: EnrollmentParams
  ): Promise<ServiceResponse<EnrollmentResult>> {
    try {
      // Validate that either courseId or programType is provided
      if (!params.courseId && !params.programType && !params.membershipTier) {
        return this.error('Must specify courseId, programType, or membershipTier', 'MISSING_PRODUCT')
      }

      // Calculate expiration date if not provided
      let expiresAt: string | null = null
      let gracePeriodEndsAt: string | null = null
      
      if (params.expiresAt) {
        expiresAt = params.expiresAt.toISOString()
        
        // Calculate grace period end date
        if (params.gracePeriodDays && params.gracePeriodDays > 0) {
          const gracePeriodEnd = new Date(params.expiresAt)
          gracePeriodEnd.setDate(gracePeriodEnd.getDate() + params.gracePeriodDays)
          gracePeriodEndsAt = gracePeriodEnd.toISOString()
        }
      }

      // Check for existing active enrollment
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id, status')
        .eq('user_id', params.userId)
        .eq('course_id', params.courseId || '')
        .eq('status', 'active')
        .maybeSingle()

      if (existingEnrollment) {
        logger.info('User already has active enrollment', {
          userId: params.userId,
          courseId: params.courseId,
          existingId: existingEnrollment.id
        })

        return this.success({
          enrollmentId: existingEnrollment.id,
          status: 'active',
          expiresAt: expiresAt || undefined,
          gracePeriodEndsAt: gracePeriodEndsAt || undefined
        })
      }

      // Create enrollment record
      const { data: enrollment, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: params.userId,
          course_id: params.courseId,
          program_type: params.programType,
          membership_tier: params.membershipTier,
          status: 'active',
          enrolled_at: new Date().toISOString(),
          expires_at: expiresAt,
          grace_period_ends_at: gracePeriodEndsAt,
          payment_intent_id: params.paymentIntentId,
          subscription_id: params.subscriptionId,
          metadata: params.metadata
        })
        .select()
        .single()

      if (error) {
        logger.error('Failed to create enrollment', undefined, {
          message: error.message,
          userId: params.userId
        })
        return this.error('Failed to create enrollment', 'ENROLLMENT_CREATION_FAILED')
      }

      logger.info('Access granted', {
        enrollmentId: enrollment.id,
        userId: params.userId,
        courseId: params.courseId,
        expiresAt
      })

      // Schedule expiration warnings if applicable
      if (expiresAt) {
        await this.scheduleExpirationWarnings(enrollment.id, new Date(expiresAt))
      }

      return this.success({
        enrollmentId: enrollment.id,
        status: enrollment.status,
        expiresAt: expiresAt || undefined,
        gracePeriodEndsAt: gracePeriodEndsAt || undefined
      })
    } catch (error: any) {
      logger.error('Error granting access', error, {
        userId: params.userId
      })
      return this.error('Error granting access', 'ACCESS_GRANT_ERROR')
    }
  }

  /**
   * Revoke access to a course/program
   */
  async revokeAccess(
    enrollmentId: string,
    reason?: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({
          status: 'revoked',
          revoked_at: new Date().toISOString(),
          metadata: {
            revocation_reason: reason || 'manual_revocation'
          }
        })
        .eq('id', enrollmentId)

      if (error) {
        logger.error('Failed to revoke access', undefined, {
          message: error.message,
          enrollmentId
        })
        return this.error('Failed to revoke access', 'REVOCATION_FAILED')
      }

      logger.info('Access revoked', {
        enrollmentId,
        reason
      })

      return this.success(true)
    } catch (error: any) {
      logger.error('Error revoking access', error, {
        enrollmentId
      })
      return this.error('Error revoking access', 'REVOKE_ERROR')
    }
  }

  /**
   * Extend enrollment expiration date
   */
  async extendEnrollment(
    params: ExtendEnrollmentParams
  ): Promise<ServiceResponse<EnrollmentResult>> {
    try {
      // Get current enrollment
      const { data: enrollment, error: fetchError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('id', params.enrollmentId)
        .single()

      if (fetchError || !enrollment) {
        return this.error('Enrollment not found', 'ENROLLMENT_NOT_FOUND')
      }

      // Calculate new expiration date
      const currentExpiry = enrollment.expires_at 
        ? new Date(enrollment.expires_at)
        : new Date()
      
      const newExpiry = new Date(currentExpiry)
      newExpiry.setDate(newExpiry.getDate() + params.extensionDays)

      // Calculate new grace period end if applicable
      let newGracePeriodEnd: string | null = null
      if (enrollment.grace_period_ends_at) {
        const graceDays = Math.floor(
          (new Date(enrollment.grace_period_ends_at).getTime() - currentExpiry.getTime()) 
          / (1000 * 60 * 60 * 24)
        )
        const gracePeriodEnd = new Date(newExpiry)
        gracePeriodEnd.setDate(gracePeriodEnd.getDate() + graceDays)
        newGracePeriodEnd = gracePeriodEnd.toISOString()
      }

      // Update enrollment
      const { data: updated, error: updateError } = await supabase
        .from('enrollments')
        .update({
          expires_at: newExpiry.toISOString(),
          grace_period_ends_at: newGracePeriodEnd,
          status: 'active', // Reactivate if expired
          metadata: {
            ...enrollment.metadata,
            extension_days: params.extensionDays.toString(),
            extension_payment_id: params.paymentIntentId || '',
            extension_reason: params.reason || 'purchased_extension',
            extended_at: new Date().toISOString()
          }
        })
        .eq('id', params.enrollmentId)
        .select()
        .single()

      if (updateError || !updated) {
        logger.error('Failed to extend enrollment', undefined, {
          message: updateError?.message,
          enrollmentId: params.enrollmentId
        })
        return this.error('Failed to extend enrollment', 'EXTENSION_FAILED')
      }

      logger.info('Enrollment extended', {
        enrollmentId: params.enrollmentId,
        extensionDays: params.extensionDays,
        newExpiry: newExpiry.toISOString()
      })

      // Schedule new expiration warnings
      await this.scheduleExpirationWarnings(params.enrollmentId, newExpiry)

      return this.success({
        enrollmentId: updated.id,
        status: updated.status,
        expiresAt: updated.expires_at || undefined,
        gracePeriodEndsAt: updated.grace_period_ends_at || undefined
      })
    } catch (error: any) {
      logger.error('Error extending enrollment', error, {
        enrollmentId: params.enrollmentId
      })
      return this.error('Error extending enrollment', 'EXTENSION_ERROR')
    }
  }

  /**
   * Get enrollment status for a user
   */
  async getEnrollmentStatus(
    userId: string,
    courseId?: string
  ): Promise<ServiceResponse<EnrollmentStatus[]>> {
    try {
      let query = supabase
        .from('enrollments')
        .select(`
          id,
          user_id,
          course_id,
          program_type,
          status,
          enrolled_at,
          expires_at,
          grace_period_ends_at,
          courses (
            title
          )
        `)
        .eq('user_id', userId)

      if (courseId) {
        query = query.eq('course_id', courseId)
      }

      const { data: enrollments, error } = await query

      if (error) {
        logger.error('Failed to get enrollment status', undefined, {
          message: error.message,
          userId
        })
        return this.error('Failed to get enrollment status', 'STATUS_FETCH_FAILED')
      }

      const now = new Date()
      const statuses: EnrollmentStatus[] = (enrollments || []).map((enrollment: any) => {
        const expiresAt = enrollment.expires_at ? new Date(enrollment.expires_at) : null
        const gracePeriodEndsAt = enrollment.grace_period_ends_at 
          ? new Date(enrollment.grace_period_ends_at) 
          : null

        let daysRemaining: number | undefined
        let isExpired = false
        let isInGracePeriod = false

        if (expiresAt) {
          daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          isExpired = now > expiresAt
          
          if (isExpired && gracePeriodEndsAt) {
            isInGracePeriod = now <= gracePeriodEndsAt
          }
        }

        return {
          enrollmentId: enrollment.id,
          userId: enrollment.user_id,
          courseId: enrollment.course_id,
          programType: enrollment.program_type,
          status: enrollment.status,
          enrolledAt: enrollment.enrolled_at,
          expiresAt: enrollment.expires_at,
          gracePeriodEndsAt: enrollment.grace_period_ends_at,
          daysRemaining,
          isExpired,
          isInGracePeriod,
          canExtend: isExpired || (daysRemaining !== undefined && daysRemaining < 30)
        }
      })

      return this.success(statuses)
    } catch (error: any) {
      logger.error('Error getting enrollment status', error, {
        userId
      })
      return this.error('Error getting enrollment status', 'STATUS_ERROR')
    }
  }

  /**
   * Process expired enrollments (move to expired status)
   */
  async processExpiredEnrollments(): Promise<ServiceResponse<number>> {
    try {
      const now = new Date().toISOString()

      // Update enrollments that have passed their grace period
      const { data: expiredEnrollments, error } = await supabase
        .from('enrollments')
        .update({
          status: 'expired'
        })
        .eq('status', 'active')
        .lt('grace_period_ends_at', now)
        .select()

      if (error) {
        logger.error('Failed to process expired enrollments', undefined, {
          message: error.message
        })
        return this.error('Failed to process expired enrollments', 'PROCESS_EXPIRED_FAILED')
      }

      const count = expiredEnrollments?.length || 0

      logger.info('Processed expired enrollments', {
        count
      })

      return this.success(count)
    } catch (error: any) {
      logger.error('Error processing expired enrollments', error)
      return this.error('Error processing expired enrollments', 'PROCESS_ERROR')
    }
  }

  /**
   * Get enrollments that are expiring soon (for warning emails)
   */
  async getExpiringEnrollments(
    daysThreshold: number
  ): Promise<ServiceResponse<ExpiringEnrollment[]>> {
    try {
      const now = new Date()
      const thresholdDate = new Date()
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold)

      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          user_id,
          course_id,
          program_type,
          expires_at,
          users:user_id (
            email
          ),
          courses:course_id (
            title
          )
        `)
        .eq('status', 'active')
        .gte('expires_at', now.toISOString())
        .lte('expires_at', thresholdDate.toISOString())

      if (error) {
        logger.error('Failed to get expiring enrollments', undefined, {
          message: error.message
        })
        return this.error('Failed to get expiring enrollments', 'FETCH_EXPIRING_FAILED')
      }

      const expiring: ExpiringEnrollment[] = (enrollments || []).map((enrollment: any) => {
        const expiresAt = new Date(enrollment.expires_at)
        const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        return {
          enrollmentId: enrollment.id,
          userId: enrollment.user_id,
          userEmail: enrollment.users?.email || '',
          courseId: enrollment.course_id,
          courseName: enrollment.courses?.title || '',
          programType: enrollment.program_type,
          expiresAt: enrollment.expires_at,
          daysRemaining
        }
      })

      return this.success(expiring)
    } catch (error: any) {
      logger.error('Error getting expiring enrollments', error)
      return this.error('Error getting expiring enrollments', 'EXPIRING_ERROR')
    }
  }

  /**
   * Schedule expiration warning notifications
   */
  private async scheduleExpirationWarnings(
    enrollmentId: string,
    expiresAt: Date
  ): Promise<void> {
    try {
      const now = new Date()
      const warnings = [
        { days: 7, type: '7_day_warning' },
        { days: 3, type: '3_day_warning' },
        { days: 1, type: '1_day_warning' }
      ]

      for (const warning of warnings) {
        const warningDate = new Date(expiresAt)
        warningDate.setDate(warningDate.getDate() - warning.days)

        // Only schedule if warning date is in the future
        if (warningDate > now) {
          await supabase
            .from('scheduled_notifications')
            .insert({
              enrollment_id: enrollmentId,
              notification_type: warning.type,
              scheduled_for: warningDate.toISOString(),
              status: 'pending'
            })
        }
      }

      logger.info('Scheduled expiration warnings', {
        enrollmentId,
        expiresAt: expiresAt.toISOString()
      })
    } catch (error: any) {
      logger.error('Error scheduling warnings', error, {
        enrollmentId
      })
      // Don't fail the main operation if warning scheduling fails
    }
  }

  /**
   * Check if user has access to a course
   */
  async hasAccess(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    try {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id, status, expires_at, grace_period_ends_at')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('status', 'active')
        .maybeSingle()

      if (!enrollment) {
        return false
      }

      // Check if enrollment is still valid
      const now = new Date()
      
      if (enrollment.expires_at) {
        const expiresAt = new Date(enrollment.expires_at)
        const gracePeriodEndsAt = enrollment.grace_period_ends_at 
          ? new Date(enrollment.grace_period_ends_at)
          : expiresAt

        return now <= gracePeriodEndsAt
      }

      return true
    } catch (error: any) {
      logger.error('Error checking access', error, {
        userId,
        courseId
      })
      return false
    }
  }

  /**
   * Get user's active enrollments
   */
  async getActiveEnrollments(
    userId: string
  ): Promise<ServiceResponse<any[]>> {
    try {
      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          course_id,
          program_type,
          enrolled_at,
          expires_at,
          grace_period_ends_at,
          courses (
            id,
            title,
            description,
            thumbnail_url
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('enrolled_at', { ascending: false })

      if (error) {
        logger.error('Failed to get active enrollments', undefined, {
          message: error.message,
          userId
        })
        return this.error('Failed to get active enrollments', 'FETCH_FAILED')
      }

      return this.success(enrollments || [])
    } catch (error: any) {
      logger.error('Error getting active enrollments', error, {
        userId
      })
      return this.error('Error getting active enrollments', 'FETCH_ERROR')
    }
  }
}
