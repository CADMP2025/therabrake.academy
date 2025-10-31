/**
 * Stripe Refund Service
 * Handles refund processing, partial/full refunds, and chargeback management
 */

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/monitoring/logger'
import { BaseService, ServiceResponse } from '@/lib/services/base-service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil'
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface CreateRefundParams {
  chargeId?: string
  paymentIntentId?: string
  amount?: number // in cents, omit for full refund
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  metadata?: Record<string, string>
}

export interface RefundResult {
  refundId: string
  amount: number
  status: string
}

export class StripeRefundService extends BaseService {
  private static instance: StripeRefundService

  private constructor() {
    super()
  }

  static getInstance(): StripeRefundService {
    if (!StripeRefundService.instance) {
      StripeRefundService.instance = new StripeRefundService()
    }
    return StripeRefundService.instance
  }

  /**
   * Create refund
   */
  async createRefund(
    params: CreateRefundParams
  ): Promise<ServiceResponse<RefundResult>> {
    try {
      // Create refund via Stripe
      const refund = await stripe.refunds.create({
        charge: params.chargeId,
        payment_intent: params.paymentIntentId,
        amount: params.amount,
        reason: params.reason,
        metadata: params.metadata
      })

      logger.info('Created refund', {
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status
      })

      return this.success({
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status || 'pending'
      })
    } catch (error) {
      logger.error('Failed to create refund', error as Error)
      return this.error('Failed to create refund', 'REFUND_CREATION_FAILED')
    }
  }

  /**
   * Process full refund
   */
  async processFullRefund(
    paymentIntentId: string,
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  ): Promise<ServiceResponse<RefundResult>> {
    try {
      // Get payment from database
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single()

      if (paymentError || !payment) {
        return this.error('Payment not found', 'PAYMENT_NOT_FOUND')
      }

      // Create full refund
      const refundResult = await this.createRefund({
        paymentIntentId,
        reason,
        metadata: {
          user_id: payment.user_id,
          product_type: payment.product_type,
          product_id: payment.product_id
        }
      })

      if (!refundResult.success || !refundResult.data) {
        return refundResult
      }

      logger.info('Processed full refund', {
        paymentIntentId,
        refundId: refundResult.data.refundId
      })

      return refundResult
    } catch (error) {
      logger.error('Failed to process full refund', error as Error)
      return this.error('Failed to process refund', 'FULL_REFUND_FAILED')
    }
  }

  /**
   * Process partial refund
   */
  async processPartialRefund(
    paymentIntentId: string,
    amount: number,
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  ): Promise<ServiceResponse<RefundResult>> {
    try {
      // Get payment from database
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single()

      if (paymentError || !payment) {
        return this.error('Payment not found', 'PAYMENT_NOT_FOUND')
      }

      // Validate amount
      if (amount > payment.amount) {
        return this.error('Refund amount exceeds payment amount', 'INVALID_REFUND_AMOUNT')
      }

      // Create partial refund
      const refundResult = await this.createRefund({
        paymentIntentId,
        amount,
        reason,
        metadata: {
          user_id: payment.user_id,
          product_type: payment.product_type,
          product_id: payment.product_id,
          partial_refund: 'true'
        }
      })

      if (!refundResult.success || !refundResult.data) {
        return refundResult
      }

      logger.info('Processed partial refund', {
        paymentIntentId,
        refundId: refundResult.data.refundId,
        amount
      })

      return refundResult
    } catch (error) {
      logger.error('Failed to process partial refund', error as Error)
      return this.error('Failed to process refund', 'PARTIAL_REFUND_FAILED')
    }
  }

  /**
   * Get refund details
   */
  async getRefund(
    refundId: string
  ): Promise<ServiceResponse<Stripe.Refund>> {
    try {
      const refund = await stripe.refunds.retrieve(refundId)
      return this.success(refund)
    } catch (error) {
      logger.error('Failed to retrieve refund', error as Error)
      return this.error('Failed to retrieve refund', 'REFUND_RETRIEVAL_FAILED')
    }
  }

  /**
   * List refunds for payment
   */
  async listRefunds(
    chargeId?: string,
    paymentIntentId?: string
  ): Promise<ServiceResponse<Stripe.Refund[]>> {
    try {
      const refunds = await stripe.refunds.list({
        charge: chargeId,
        payment_intent: paymentIntentId,
        limit: 100
      })

      return this.success(refunds.data)
    } catch (error) {
      logger.error('Failed to list refunds', error as Error)
      return this.error('Failed to list refunds', 'REFUND_LIST_FAILED')
    }
  }

  /**
   * Cancel pending refund
   */
  async cancelRefund(
    refundId: string
  ): Promise<ServiceResponse<Stripe.Refund>> {
    try {
      const refund = await stripe.refunds.cancel(refundId)

      logger.info('Canceled refund', { refundId })

      return this.success(refund)
    } catch (error) {
      logger.error('Failed to cancel refund', error as Error)
      return this.error('Failed to cancel refund', 'REFUND_CANCELLATION_FAILED')
    }
  }

  /**
   * Get refund status from database
   */
  async getRefundStatus(
    paymentId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('refunds')
        .select('*')
        .eq('payment_id', paymentId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return this.success(data)
    } catch (error) {
      logger.error('Failed to get refund status', error as Error)
      return this.error('Failed to get refund status', 'REFUND_STATUS_FAILED')
    }
  }

  /**
   * Check if payment is refundable
   */
  async isRefundable(
    paymentIntentId: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      // Check if payment succeeded and not fully refunded
      const isRefundable = 
        paymentIntent.status === 'succeeded' &&
        paymentIntent.amount > (paymentIntent.amount_received - (paymentIntent as any).amount_refunded || 0)

      return this.success(isRefundable)
    } catch (error) {
      logger.error('Failed to check refundability', error as Error)
      return this.error('Failed to check refund eligibility', 'REFUND_CHECK_FAILED')
    }
  }

  /**
   * Calculate refundable amount
   */
  async getRefundableAmount(
    paymentIntentId: string
  ): Promise<ServiceResponse<number>> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      const refundedAmount = (paymentIntent as any).amount_refunded || 0
      const refundableAmount = paymentIntent.amount - refundedAmount

      return this.success(refundableAmount)
    } catch (error) {
      logger.error('Failed to calculate refundable amount', error as Error)
      return this.error('Failed to calculate refundable amount', 'REFUND_CALCULATION_FAILED')
    }
  }

  /**
   * Handle chargeback (dispute lost)
   * This is called when a dispute is lost
   */
  async handleChargeback(
    disputeId: string
  ): Promise<ServiceResponse<void>> {
    try {
      // Update dispute status in database
      await supabase
        .from('disputes')
        .update({
          status: 'lost',
          resolved_at: new Date().toISOString()
        })
        .eq('stripe_dispute_id', disputeId)

      // Get associated payment
      const { data: dispute } = await supabase
        .from('disputes')
        .select('payment_id, user_id')
        .eq('stripe_dispute_id', disputeId)
        .single()

      if (dispute) {
        // Update payment status
        await supabase
          .from('payments')
          .update({ status: 'refunded' })
          .eq('id', dispute.payment_id)

        // Revoke access (handled by enrollment service)
        logger.info('Chargeback processed, access should be revoked', {
          disputeId,
          paymentId: dispute.payment_id
        })
      }

      logger.info('Handled chargeback', { disputeId })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle chargeback', error as Error)
      return this.error('Failed to handle chargeback', 'CHARGEBACK_HANDLING_FAILED')
    }
  }

  /**
   * Get refund statistics for user
   */
  async getRefundStats(
    userId: string
  ): Promise<ServiceResponse<{
    totalRefunds: number
    totalAmount: number
    refundCount: number
  }>> {
    try {
      const { data, error } = await supabase
        .from('refunds')
        .select('amount')
        .eq('user_id', userId)
        .eq('status', 'succeeded')

      if (error) throw error

      const totalAmount = data.reduce((sum, refund) => sum + refund.amount, 0)
      const refundCount = data.length

      return this.success({
        totalRefunds: totalAmount,
        totalAmount,
        refundCount
      })
    } catch (error) {
      logger.error('Failed to get refund stats', error as Error)
      return this.error('Failed to get refund statistics', 'REFUND_STATS_FAILED')
    }
  }
}

export const stripeRefundService = StripeRefundService.getInstance()
