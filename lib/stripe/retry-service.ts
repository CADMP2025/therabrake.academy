/**
 * PaymentRetryService
 * 
 * Handles automatic retries for failed payments with:
 * - Exponential backoff scheduling
 * - Maximum retry attempts
 * - Retry tracking in database
 * - Email notifications
 * - Smart retry eligibility checking
 */

import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/monitoring/logger'
import { BaseService, ServiceResponse } from '@/lib/services/base-service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil'
})

interface RetryScheduleConfig {
  intervals: number[] // Minutes between retries
  maxAttempts: number
  notifyOnEachRetry: boolean
}

interface ScheduleRetryParams {
  paymentId: string
  paymentIntentId: string
  attemptNumber: number
  errorCode?: string
  errorMessage?: string
  customerId: string
}

interface RetryResult {
  paymentAttemptId: string
  nextRetryAt: string
  attemptNumber: number
}

interface ProcessRetryParams {
  limit?: number // Max retries to process in one run
}

interface RetryProcessResult {
  processed: number
  successful: number
  failed: number
  skipped: number
}

interface CancelRetryResult {
  cancelled: boolean
  reason: string
}

export class StripeRetryService extends BaseService {
  private static instance: StripeRetryService

  private constructor() {
    super()
  }

  public static getInstance(): StripeRetryService {
    if (!StripeRetryService.instance) {
      StripeRetryService.instance = new StripeRetryService()
    }
    return StripeRetryService.instance
  }

  /**
   * Default retry configuration
   * Attempts at: immediate, +1h, +6h, +24h = 4 total attempts
   */
  private getDefaultConfig(): RetryScheduleConfig {
    return {
      intervals: [60, 360, 1440], // 1 hour, 6 hours, 24 hours
      maxAttempts: 3,
      notifyOnEachRetry: true
    }
  }

  /**
   * Schedule a retry attempt for a failed payment
   */
  async scheduleRetry(
    params: ScheduleRetryParams,
    config?: Partial<RetryScheduleConfig>
  ): Promise<ServiceResponse<RetryResult>> {
    try {
      const supabase = await createClient()
      const retryConfig = { ...this.getDefaultConfig(), ...config }

      // Check if we've exceeded max attempts
      if (params.attemptNumber >= retryConfig.maxAttempts) {
        logger.warn('Max retry attempts reached', {
          paymentId: params.paymentId,
          attemptNumber: params.attemptNumber
        })
        return this.error('Max retry attempts reached', 'MAX_RETRIES_EXCEEDED')
      }

      // Calculate next retry time
      const intervalMinutes = retryConfig.intervals[params.attemptNumber - 1]
      const nextRetryAt = new Date()
      nextRetryAt.setMinutes(nextRetryAt.getMinutes() + intervalMinutes)

      // Insert retry attempt record
      const { data: attempt, error } = await supabase
        .from('payment_attempts')
        .insert({
          payment_id: params.paymentId,
          attempt_number: params.attemptNumber,
          status: 'pending',
          scheduled_at: nextRetryAt.toISOString(),
          error_code: params.errorCode,
          error_message: params.errorMessage,
          metadata: {
            payment_intent_id: params.paymentIntentId,
            interval_minutes: intervalMinutes
          }
        })
        .select()
        .single()

      if (error) {
        logger.error('Failed to schedule retry', undefined, {
          message: error.message,
          paymentId: params.paymentId
        })
        return this.error('Failed to schedule retry', 'DATABASE_ERROR')
      }

      logger.info('Retry scheduled', {
        paymentAttemptId: attempt.id,
        attemptNumber: params.attemptNumber,
        nextRetryAt: nextRetryAt.toISOString()
      })

      // Send notification if configured
      if (retryConfig.notifyOnEachRetry) {
        await this.notifyCustomerOfRetry(params.customerId, {
          attemptNumber: params.attemptNumber,
          nextRetryAt: nextRetryAt.toISOString(),
          paymentIntentId: params.paymentIntentId
        })
      }

      return this.success({
        paymentAttemptId: attempt.id,
        nextRetryAt: nextRetryAt.toISOString(),
        attemptNumber: params.attemptNumber
      })
    } catch (error: any) {
      logger.error('Error scheduling retry', error, {
        paymentId: params.paymentId
      })
      return this.error('Error scheduling retry', 'SCHEDULING_ERROR')
    }
  }

  /**
   * Process all pending retries that are due
   * Should be called by a cron job
   */
  async processRetries(
    params?: ProcessRetryParams
  ): Promise<ServiceResponse<RetryProcessResult>> {
    try {
      const supabase = await createClient()
      const limit = params?.limit || 50
      const now = new Date().toISOString()

      // Get pending retries that are due
      const { data: attempts, error } = await supabase
        .from('payment_attempts')
        .select(`
          *,
          payments!inner(
            stripe_payment_intent_id,
            user_id,
            amount
          )
        `)
        .eq('status', 'pending')
        .lte('scheduled_at', now)
        .limit(limit)

      if (error) {
        logger.error('Failed to fetch pending retries', undefined, { message: error.message })
        return this.error('Failed to fetch retries', 'DATABASE_ERROR')
      }

      const result: RetryProcessResult = {
        processed: 0,
        successful: 0,
        failed: 0,
        skipped: 0
      }

      // Process each retry
      for (const attempt of attempts || []) {
        result.processed++

        const payment = (attempt as any).payments
        const paymentIntentId = payment.stripe_payment_intent_id

        // Check if payment intent still exists and needs retry
        const shouldRetry = await this.shouldRetryPayment(paymentIntentId)
        
        if (!shouldRetry) {
          // Mark as skipped (payment may have succeeded elsewhere)
          await supabase
            .from('payment_attempts')
            .update({
              status: 'skipped',
              processed_at: new Date().toISOString(),
              metadata: {
                ...attempt.metadata,
                skip_reason: 'Payment no longer needs retry'
              }
            })
            .eq('id', attempt.id)

          result.skipped++
          continue
        }

        // Attempt to retry the payment
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
          
          // Confirm payment with the attached payment method
          const confirmed = await stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentIntent.payment_method as string
          })

          if (confirmed.status === 'succeeded') {
            // Success! Update attempt
            await supabase
              .from('payment_attempts')
              .update({
                status: 'succeeded',
                processed_at: new Date().toISOString(),
                metadata: {
                  ...attempt.metadata,
                  retry_result: 'success'
                }
              })
              .eq('id', attempt.id)

            result.successful++

            logger.info('Payment retry succeeded', {
              paymentIntentId,
              attemptNumber: attempt.attempt_number
            })
          } else {
            // Still requires action or failed
            throw new Error(`Payment still in ${confirmed.status} state`)
          }
        } catch (error: any) {
          // Retry failed
          await supabase
            .from('payment_attempts')
            .update({
              status: 'failed',
              processed_at: new Date().toISOString(),
              error_code: error.code,
              error_message: error.message,
              metadata: {
                ...attempt.metadata,
                retry_result: 'failed'
              }
            })
            .eq('id', attempt.id)

          result.failed++

          logger.warn('Payment retry failed', {
            paymentIntentId,
            attemptNumber: attempt.attempt_number,
            error: error.message
          })

          // Schedule next retry if we haven't exceeded max attempts
          const nextAttempt = attempt.attempt_number + 1
          if (nextAttempt <= this.getDefaultConfig().maxAttempts) {
            await this.scheduleRetry({
              paymentId: attempt.payment_id,
              paymentIntentId,
              attemptNumber: nextAttempt,
              errorCode: error.code,
              errorMessage: error.message,
              customerId: payment.user_id
            })
          } else {
            // Max retries exceeded, send final failure notification
            await this.notifyCustomerOfFinalFailure(payment.user_id, {
              paymentIntentId,
              amount: payment.amount
            })
          }
        }
      }

      logger.info('Processed payment retries', result)

      return this.success(result)
    } catch (error: any) {
      logger.error('Error processing retries', error)
      return this.error('Error processing retries', 'PROCESSING_ERROR')
    }
  }

  /**
   * Check if a payment should be retried
   */
  async shouldRetryPayment(paymentIntentId: string): Promise<boolean> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      // Only retry if payment requires payment method or action
      if (paymentIntent.status === 'requires_payment_method' ||
          paymentIntent.status === 'requires_confirmation') {
        
        // Check if payment method is still attached
        if (!paymentIntent.payment_method) {
          return false // No payment method to retry with
        }

        // Check for specific error codes that shouldn't be retried
        const lastError = paymentIntent.last_payment_error
        if (lastError) {
          const nonRetriableErrors = [
            'card_declined',
            'insufficient_funds',
            'lost_card',
            'stolen_card',
            'expired_card',
            'incorrect_cvc',
            'invalid_account'
          ]

          if (nonRetriableErrors.includes(lastError.code || '')) {
            return false
          }
        }

        return true
      }

      return false
    } catch (error: any) {
      logger.error('Error checking retry eligibility', error, {
        paymentIntentId
      })
      return false
    }
  }

  /**
   * Cancel all pending retries for a payment
   */
  async cancelRetry(paymentId: string): Promise<ServiceResponse<CancelRetryResult>> {
    try {
      const supabase = await createClient()

      const { error } = await supabase
        .from('payment_attempts')
        .update({
          status: 'cancelled',
          processed_at: new Date().toISOString(),
          metadata: {
            cancel_reason: 'Manually cancelled'
          }
        })
        .eq('payment_id', paymentId)
        .eq('status', 'pending')

      if (error) {
        logger.error('Failed to cancel retries', undefined, {
          message: error.message,
          paymentId
        })
        return this.error('Failed to cancel retries', 'DATABASE_ERROR')
      }

      logger.info('Cancelled pending retries', { paymentId })

      return this.success({
        cancelled: true,
        reason: 'All pending retries cancelled'
      })
    } catch (error: any) {
      logger.error('Error cancelling retries', error, {
        paymentId
      })
      return this.error('Error cancelling retries', 'CANCEL_ERROR')
    }
  }

  /**
   * Get retry schedule for a given attempt number
   */
  getRetrySchedule(attemptNumber: number, config?: Partial<RetryScheduleConfig>): Date | null {
    const retryConfig = { ...this.getDefaultConfig(), ...config }

    if (attemptNumber < 1 || attemptNumber > retryConfig.maxAttempts) {
      return null
    }

    const intervalMinutes = retryConfig.intervals[attemptNumber - 1]
    const nextRetry = new Date()
    nextRetry.setMinutes(nextRetry.getMinutes() + intervalMinutes)

    return nextRetry
  }

  /**
   * Get all retry attempts for a payment
   */
  async getRetryAttempts(paymentId: string): Promise<ServiceResponse<any[]>> {
    try {
      const supabase = await createClient()

      const { data: attempts, error } = await supabase
        .from('payment_attempts')
        .select('*')
        .eq('payment_id', paymentId)
        .order('attempt_number', { ascending: true })

      if (error) {
        logger.error('Failed to get retry attempts', undefined, {
          message: error.message,
          paymentId
        })
        return this.error('Failed to get retry attempts', 'DATABASE_ERROR')
      }

      return this.success(attempts || [])
    } catch (error: any) {
      logger.error('Error getting retry attempts', error, {
        paymentId
      })
      return this.error('Error getting retry attempts', 'FETCH_ERROR')
    }
  }

  /**
   * Notify customer about retry attempt (placeholder)
   * In production, this would integrate with your email service
   */
  private async notifyCustomerOfRetry(
    customerId: string,
    details: {
      attemptNumber: number
      nextRetryAt: string
      paymentIntentId: string
    }
  ): Promise<void> {
    // TODO: Integrate with email service
    logger.info('Would send retry notification', {
      customerId,
      attemptNumber: details.attemptNumber,
      nextRetryAt: details.nextRetryAt
    })
  }

  /**
   * Notify customer about final failure (placeholder)
   * In production, this would integrate with your email service
   */
  private async notifyCustomerOfFinalFailure(
    customerId: string,
    details: {
      paymentIntentId: string
      amount: number
    }
  ): Promise<void> {
    // TODO: Integrate with email service
    logger.info('Would send final failure notification', {
      customerId,
      paymentIntentId: details.paymentIntentId,
      amount: details.amount
    })
  }
}
