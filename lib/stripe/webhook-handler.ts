/**
 * Stripe Webhook Handler Service
 * Processes all Stripe webhook events with idempotency and error handling
 */

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/monitoring/logger'
import { BaseService, ServiceResponse } from '@/lib/services/base-service'
import { EnrollmentService } from '@/lib/services/enrollment-service'
import { EnrollmentEmailService } from '@/lib/services/enrollment-email-service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil'
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface WebhookEvent {
  id: string
  type: string
  data: any
  created: number
}

export class StripeWebhookService extends BaseService {
  private static instance: StripeWebhookService

  private constructor() {
    super()
  }

  static getInstance(): StripeWebhookService {
    if (!StripeWebhookService.instance) {
      StripeWebhookService.instance = new StripeWebhookService()
    }
    return StripeWebhookService.instance
  }

  /**
   * Verify webhook signature
   */
  async verifyWebhookSignature(
    payload: string | Buffer,
    signature: string
  ): Promise<ServiceResponse<Stripe.Event>> {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )

      return this.success(event)
    } catch (error) {
      logger.error('Webhook signature verification failed', error as Error)
      return this.error('Invalid webhook signature', 'INVALID_SIGNATURE')
    }
  }

  /**
   * Check if event has already been processed (idempotency)
   */
  private async isEventProcessed(eventId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('stripe_webhook_events')
      .select('processed')
      .eq('stripe_event_id', eventId)
      .single()

    return data?.processed === true
  }

  /**
   * Mark event as processed
   */
  private async markEventProcessed(
    eventId: string,
    eventType: string,
    eventData: any
  ): Promise<void> {
    await supabase
      .from('stripe_webhook_events')
      .upsert({
        stripe_event_id: eventId,
        event_type: eventType,
        event_data: eventData,
        processed: true,
        processed_at: new Date().toISOString()
      })
  }

  /**
   * Record processing attempt
   */
  private async recordProcessingAttempt(
    eventId: string,
    error?: string
  ): Promise<void> {
    await supabase.rpc('increment_webhook_processing_attempts', {
      p_event_id: eventId,
      p_error: error
    })
  }

  /**
   * Process webhook event
   */
  async processWebhook(event: Stripe.Event): Promise<ServiceResponse<void>> {
    try {
      // Check if already processed
      const alreadyProcessed = await this.isEventProcessed(event.id)
      if (alreadyProcessed) {
        logger.info('Event already processed, skipping', { eventId: event.id })
        return this.success(undefined)
      }

      // Route to appropriate handler
      let result: ServiceResponse<void>
      
      switch (event.type) {
        // Payment Intent Events
        case 'payment_intent.succeeded':
          result = await this.handlePaymentIntentSucceeded(event)
          break
        case 'payment_intent.payment_failed':
          result = await this.handlePaymentIntentFailed(event)
          break
        case 'payment_intent.canceled':
          result = await this.handlePaymentIntentCanceled(event)
          break

        // Subscription Events
        case 'customer.subscription.created':
          result = await this.handleSubscriptionCreated(event)
          break
        case 'customer.subscription.updated':
          result = await this.handleSubscriptionUpdated(event)
          break
        case 'customer.subscription.deleted':
          result = await this.handleSubscriptionDeleted(event)
          break

        // Charge Events
        case 'charge.refunded':
          result = await this.handleChargeRefunded(event)
          break
        case 'charge.dispute.created':
          result = await this.handleDisputeCreated(event)
          break
        case 'charge.dispute.updated':
          result = await this.handleDisputeUpdated(event)
          break
        case 'charge.dispute.closed':
          result = await this.handleDisputeClosed(event)
          break

        // Customer Events
        case 'customer.created':
          result = await this.handleCustomerCreated(event)
          break
        case 'customer.updated':
          result = await this.handleCustomerUpdated(event)
          break

        // Payment Method Events
        case 'payment_method.attached':
          result = await this.handlePaymentMethodAttached(event)
          break

        default:
          logger.info('Unhandled webhook event type', { type: event.type })
          result = this.success(undefined)
      }

      if (result.success) {
        await this.markEventProcessed(event.id, event.type, event.data)
      } else {
        await this.recordProcessingAttempt(event.id, result.error)
      }

      return result
    } catch (error) {
      logger.error('Webhook processing failed', error as Error, {
        eventId: event.id,
        eventType: event.type
      })
      await this.recordProcessingAttempt(event.id, (error as Error).message)
      return this.error('Webhook processing failed', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle payment_intent.succeeded
   */
  private async handlePaymentIntentSucceeded(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent

    try {
      // Update payment record
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'succeeded',
          stripe_charge_id: paymentIntent.latest_charge as string,
          paid_at: new Date(paymentIntent.created * 1000).toISOString(),
          receipt_url: (paymentIntent as any).charges?.data[0]?.receipt_url,
          payment_method_id: paymentIntent.payment_method as string
        })
        .eq('stripe_payment_intent_id', paymentIntent.id)

      if (updateError) throw updateError

      // Grant course access or membership
      await this.grantAccess(paymentIntent)

      // Send confirmation email
      await this.sendPaymentConfirmationEmail(paymentIntent)

      logger.info('Payment succeeded', {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount
      })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle payment success', error as Error)
      return this.error('Failed to process payment success', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle payment_intent.payment_failed
   */
  private async handlePaymentIntentFailed(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent

    try {
      // Update payment record
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'failed',
          failure_code: paymentIntent.last_payment_error?.code,
          failure_message: paymentIntent.last_payment_error?.message
        })
        .eq('stripe_payment_intent_id', paymentIntent.id)

      if (updateError) throw updateError

      // Create payment attempt record
      await supabase.from('payment_attempts').insert({
        payment_id: (await this.getPaymentId(paymentIntent.id))!,
        user_id: paymentIntent.metadata.user_id,
        status: 'failed',
        error_code: paymentIntent.last_payment_error?.code,
        error_message: paymentIntent.last_payment_error?.message,
        error_type: paymentIntent.last_payment_error?.type
      })

      // Send failure notification email
      await this.sendPaymentFailureEmail(paymentIntent)

      // Schedule retry if applicable
      await this.schedulePaymentRetry(paymentIntent)

      logger.info('Payment failed', {
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message
      })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle payment failure', error as Error)
      return this.error('Failed to process payment failure', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle payment_intent.canceled
   */
  private async handlePaymentIntentCanceled(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent

    try {
      await supabase
        .from('payments')
        .update({ status: 'canceled' })
        .eq('stripe_payment_intent_id', paymentIntent.id)

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle payment cancellation', error as Error)
      return this.error('Failed to process payment cancellation', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle customer.subscription.created
   */
  private async handleSubscriptionCreated(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const subscription = event.data.object as Stripe.Subscription

    try {
      const { error } = await supabase.from('subscriptions').insert({
        user_id: subscription.metadata.user_id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        stripe_price_id: subscription.items.data[0].price.id,
        stripe_product_id: subscription.items.data[0].price.product as string,
        status: subscription.status,
        subscription_type: subscription.metadata.subscription_type || 'monthly',
        product_name: subscription.metadata.product_name,
        product_type: subscription.metadata.product_type || 'membership',
        amount: subscription.items.data[0].price.unit_amount!,
        currency: subscription.currency,
        current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        trial_start: (subscription as any).trial_start ? new Date((subscription as any).trial_start * 1000).toISOString() : null,
        trial_end: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000).toISOString() : null,
        metadata: subscription.metadata
      })

      if (error) throw error

      // Grant subscription access
      await this.grantSubscriptionAccess(subscription)

      // Send subscription confirmation email
      await this.sendSubscriptionConfirmationEmail(subscription)

      logger.info('Subscription created', { subscriptionId: subscription.id })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle subscription creation', error as Error)
      return this.error('Failed to process subscription creation', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle customer.subscription.updated
   */
  private async handleSubscriptionUpdated(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const subscription = event.data.object as Stripe.Subscription

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          cancel_at_period_end: (subscription as any).cancel_at_period_end || false,
          canceled_at: (subscription as any).canceled_at ? new Date((subscription as any).canceled_at * 1000).toISOString() : null
        })
        .eq('stripe_subscription_id', subscription.id)

      if (error) throw error

      // Update access based on status
      if (subscription.status === 'active') {
        await this.grantSubscriptionAccess(subscription)
      } else if (['canceled', 'unpaid', 'past_due'].includes(subscription.status)) {
        await this.revokeSubscriptionAccess(subscription)
      }

      logger.info('Subscription updated', {
        subscriptionId: subscription.id,
        status: subscription.status
      })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle subscription update', error as Error)
      return this.error('Failed to process subscription update', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle customer.subscription.deleted
   */
  private async handleSubscriptionDeleted(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const subscription = event.data.object as Stripe.Subscription

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          cancellation_reason: (subscription as any).cancellation_details?.reason
        })
        .eq('stripe_subscription_id', subscription.id)

      if (error) throw error

      // Revoke subscription access
      await this.revokeSubscriptionAccess(subscription)

      // Send cancellation confirmation email
      await this.sendSubscriptionCancellationEmail(subscription)

      logger.info('Subscription deleted', { subscriptionId: subscription.id })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle subscription deletion', error as Error)
      return this.error('Failed to process subscription deletion', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle charge.refunded
   */
  private async handleChargeRefunded(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const charge = event.data.object as Stripe.Charge

    try {
      // Get payment ID
      const paymentId = await this.getPaymentIdByCharge(charge.id)
      if (!paymentId) {
        throw new Error('Payment not found for charge')
      }

      // Create refund record
      const { data: payment } = await supabase
        .from('payments')
        .select('user_id')
        .eq('id', paymentId)
        .single()

      await supabase.from('refunds').insert({
        payment_id: paymentId,
        user_id: payment!.user_id,
        stripe_refund_id: charge.refunds!.data[0].id,
        stripe_charge_id: charge.id,
        amount: charge.amount_refunded,
        currency: charge.currency,
        status: 'succeeded',
        reason: charge.refunds!.data[0].reason || 'requested_by_customer',
        refunded_at: new Date().toISOString()
      })

      // Update payment status
      await supabase
        .from('payments')
        .update({ status: 'refunded' })
        .eq('id', paymentId)

      // Revoke access if full refund
      if (charge.amount_refunded === charge.amount) {
        await this.revokeAccessForRefund(paymentId)
      }

      // Send refund confirmation email
      await this.sendRefundConfirmationEmail(charge)

      logger.info('Charge refunded', {
        chargeId: charge.id,
        amount: charge.amount_refunded
      })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle charge refund', error as Error)
      return this.error('Failed to process refund', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle charge.dispute.created
   */
  private async handleDisputeCreated(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const dispute = event.data.object as Stripe.Dispute

    try {
      const paymentId = await this.getPaymentIdByCharge(dispute.charge as string)
      if (!paymentId) throw new Error('Payment not found')

      const { data: payment } = await supabase
        .from('payments')
        .select('user_id')
        .eq('id', paymentId)
        .single()

      await supabase.from('disputes').insert({
        payment_id: paymentId,
        user_id: payment!.user_id,
        stripe_dispute_id: dispute.id,
        stripe_charge_id: dispute.charge as string,
        amount: dispute.amount,
        currency: dispute.currency,
        status: dispute.status,
        reason: dispute.reason,
        evidence_due_by: new Date(dispute.evidence_details!.due_by! * 1000).toISOString()
      })

      // Send dispute notification to admin
      await this.sendDisputeNotification(dispute)

      logger.info('Dispute created', { disputeId: dispute.id })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle dispute creation', error as Error)
      return this.error('Failed to process dispute', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle charge.dispute.updated
   */
  private async handleDisputeUpdated(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const dispute = event.data.object as Stripe.Dispute

    try {
      await supabase
        .from('disputes')
        .update({
          status: dispute.status,
          evidence_submitted: !!dispute.evidence_details?.submission_count
        })
        .eq('stripe_dispute_id', dispute.id)

      logger.info('Dispute updated', { disputeId: dispute.id, status: dispute.status })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle dispute update', error as Error)
      return this.error('Failed to process dispute update', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle charge.dispute.closed
   */
  private async handleDisputeClosed(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const dispute = event.data.object as Stripe.Dispute

    try {
      await supabase
        .from('disputes')
        .update({
          status: dispute.status,
          resolved_at: new Date().toISOString()
        })
        .eq('stripe_dispute_id', dispute.id)

      logger.info('Dispute closed', {
        disputeId: dispute.id,
        status: dispute.status
      })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle dispute closure', error as Error)
      return this.error('Failed to process dispute closure', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle customer.created
   */
  private async handleCustomerCreated(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const customer = event.data.object as Stripe.Customer

    try {
      await supabase.from('stripe_customers').insert({
        user_id: customer.metadata.user_id,
        stripe_customer_id: customer.id,
        email: customer.email!,
        name: customer.name,
        phone: customer.phone,
        metadata: customer.metadata
      })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle customer creation', error as Error)
      return this.error('Failed to process customer creation', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle customer.updated
   */
  private async handleCustomerUpdated(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const customer = event.data.object as Stripe.Customer

    try {
      await supabase
        .from('stripe_customers')
        .update({
          email: customer.email!,
          name: customer.name,
          phone: customer.phone,
          default_payment_method_id: customer.invoice_settings?.default_payment_method as string
        })
        .eq('stripe_customer_id', customer.id)

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle customer update', error as Error)
      return this.error('Failed to process customer update', 'PROCESSING_ERROR')
    }
  }

  /**
   * Handle payment_method.attached
   */
  private async handlePaymentMethodAttached(
    event: Stripe.Event
  ): Promise<ServiceResponse<void>> {
    const paymentMethod = event.data.object as Stripe.PaymentMethod

    try {
      await supabase
        .from('stripe_customers')
        .update({
          default_payment_method_id: paymentMethod.id,
          default_payment_method_type: paymentMethod.type,
          default_payment_method_last4: (paymentMethod.card as any)?.last4,
          default_payment_method_brand: (paymentMethod.card as any)?.brand
        })
        .eq('stripe_customer_id', paymentMethod.customer as string)

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to handle payment method attachment', error as Error)
      return this.error('Failed to process payment method', 'PROCESSING_ERROR')
    }
  }

  // Helper methods
  private async getPaymentId(paymentIntentId: string): Promise<string | null> {
    const { data } = await supabase
      .from('payments')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single()
    return data?.id || null
  }

  private async getPaymentIdByCharge(chargeId: string): Promise<string | null> {
    const { data } = await supabase
      .from('payments')
      .select('id')
      .eq('stripe_charge_id', chargeId)
      .single()
    return data?.id || null
  }

  private async grantAccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      const metadata = paymentIntent.metadata
      const userId = metadata.user_id
      const purchaseType = metadata.type

      if (!userId) {
        logger.warn('No user_id in payment intent metadata', { paymentIntentId: paymentIntent.id })
        return
      }

      const enrollmentService = EnrollmentService.getInstance()
      const emailService = EnrollmentEmailService.getInstance()

      // Get customer details for email
      const customer = await stripe.customers.retrieve(paymentIntent.customer as string) as Stripe.Customer
      const userEmail = customer.email || metadata.user_email
      const userName = customer.name || metadata.user_name || 'Student'

      // Grant access based on purchase type
      if (purchaseType === 'course_purchase' && metadata.course_id) {
        // Course purchase
        const durationDays = metadata.duration_days ? parseInt(metadata.duration_days) : undefined
        const expiresAt = durationDays ? new Date(Date.now() + durationDays * 86400000) : undefined

        const result = await enrollmentService.grantAccess({
          userId,
          courseId: metadata.course_id,
          paymentIntentId: paymentIntent.id,
          expiresAt,
          gracePeriodDays: 7
        })

        if (result.success && userEmail) {
          await emailService.sendEnrollmentConfirmation({
            userEmail,
            userName,
            courseName: metadata.course_name || 'Course',
            enrolledAt: new Date().toISOString(),
            expiresAt: result.data?.expiresAt,
            accessUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${metadata.course_id}`
          })
        }

        logger.info('Course access granted', { 
          userId, 
          courseId: metadata.course_id,
          enrollmentId: result.data?.enrollmentId 
        })

      } else if (purchaseType === 'enrollment_extension' && metadata.enrollment_id) {
        // Enrollment extension purchase
        const extensionDays = metadata.extension_days ? parseInt(metadata.extension_days) : 30

        const result = await enrollmentService.extendEnrollment({
          enrollmentId: metadata.enrollment_id,
          extensionDays,
          paymentIntentId: paymentIntent.id
        })

        if (result.success) {
          logger.info('Enrollment extended via purchase', { 
            userId, 
            enrollmentId: metadata.enrollment_id,
            extensionDays,
            newExpiresAt: result.data?.expiresAt
          })
        }


      } else if (purchaseType === 'program_purchase' && metadata.program_type) {
        // Program purchase
        const durationDays = metadata.duration_days ? parseInt(metadata.duration_days) : 365 // Default 1 year
        const expiresAt = new Date(Date.now() + durationDays * 86400000)

        const result = await enrollmentService.grantAccess({
          userId,
          programType: metadata.program_type as 'SO_WHAT_MINDSET' | 'LEAP_AND_LAUNCH',
          paymentIntentId: paymentIntent.id,
          expiresAt,
          gracePeriodDays: 7
        })

        if (result.success && userEmail) {
          await emailService.sendEnrollmentConfirmation({
            userEmail,
            userName,
            programName: metadata.program_name || 'Program',
            enrolledAt: new Date().toISOString(),
            expiresAt: result.data?.expiresAt,
            accessUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
          })
        }

        logger.info('Program access granted', { 
          userId, 
          programType: metadata.program_type,
          enrollmentId: result.data?.enrollmentId 
        })
      }

    } catch (error) {
      logger.error('Failed to grant access', error as Error, { 
        paymentIntentId: paymentIntent.id 
      })
    }
  }

  private async grantSubscriptionAccess(subscription: Stripe.Subscription): Promise<void> {
    try {
      const metadata = subscription.metadata
      const userId = metadata.user_id
      const membershipTier = metadata.membership_tier as 'BASIC' | 'PROFESSIONAL' | 'PREMIUM'

      if (!userId || !membershipTier) {
        logger.warn('Missing user_id or membership_tier in subscription metadata', { 
          subscriptionId: subscription.id 
        })
        return
      }

      const enrollmentService = EnrollmentService.getInstance()
      const emailService = EnrollmentEmailService.getInstance()

      // Get customer details
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
      const userEmail = customer.email || metadata.user_email
      const userName = customer.name || metadata.user_name || 'Member'

      // Membership subscriptions don't expire - they're active as long as subscription is active
      const result = await enrollmentService.grantAccess({
        userId,
        membershipTier,
        subscriptionId: subscription.id,
        expiresAt: undefined, // No expiration for active subscriptions
        gracePeriodDays: 0 // No grace period for subscriptions
      })

      if (result.success && userEmail) {
        await emailService.sendEnrollmentConfirmation({
          userEmail,
          userName,
          programName: `${membershipTier} Membership`,
          enrolledAt: new Date(subscription.created * 1000).toISOString(),
          expiresAt: undefined, // Lifetime while subscribed
          accessUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
        })
      }

      logger.info('Subscription access granted', { 
        userId, 
        membershipTier,
        subscriptionId: subscription.id,
        enrollmentId: result.data?.enrollmentId 
      })

    } catch (error) {
      logger.error('Failed to grant subscription access', error as Error, { 
        subscriptionId: subscription.id 
      })
    }
  }

  private async revokeSubscriptionAccess(subscription: Stripe.Subscription): Promise<void> {
    try {
      const metadata = subscription.metadata
      const userId = metadata.user_id

      if (!userId) {
        logger.warn('No user_id in subscription metadata', { subscriptionId: subscription.id })
        return
      }

      const enrollmentService = EnrollmentService.getInstance()

      // Find the enrollment associated with this subscription
      const { data: enrollment, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('subscription_id', subscription.id)
        .eq('status', 'active')
        .single()

      if (error || !enrollment) {
        logger.warn('No active enrollment found for subscription', { 
          subscriptionId: subscription.id,
          userId 
        })
        return
      }

      // Revoke access with reason
      let reason = 'Subscription canceled'
      if (subscription.status === 'unpaid') reason = 'Subscription payment failed'
      if (subscription.status === 'past_due') reason = 'Subscription past due'

      const result = await enrollmentService.revokeAccess(enrollment.id, reason)

      logger.info('Subscription access revoked', { 
        userId,
        subscriptionId: subscription.id,
        enrollmentId: enrollment.id,
        reason 
      })

    } catch (error) {
      logger.error('Failed to revoke subscription access', error as Error, { 
        subscriptionId: subscription.id 
      })
    }
  }

  private async revokeAccessForRefund(paymentId: string): Promise<void> {
    try {
      const enrollmentService = EnrollmentService.getInstance()

      // Find the enrollment associated with this payment
      const { data: enrollment, error } = await supabase
        .from('enrollments')
        .select('id, user_id, course_id')
        .eq('payment_intent_id', paymentId)
        .eq('status', 'active')
        .single()

      if (error || !enrollment) {
        logger.warn('No active enrollment found for refunded payment', { paymentId })
        return
      }

      // Revoke access due to refund
      const result = await enrollmentService.revokeAccess(
        enrollment.id,
        'Full refund issued'
      )

      logger.info('Access revoked for refund', { 
        paymentId,
        enrollmentId: enrollment.id,
        userId: enrollment.user_id 
      })

    } catch (error) {
      logger.error('Failed to revoke access for refund', error as Error, { 
        paymentId 
      })
    }
  }

  private async schedulePaymentRetry(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Implementation in payment retry service
    logger.info('Scheduling payment retry', { paymentIntentId: paymentIntent.id })
  }

  private async sendPaymentConfirmationEmail(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    logger.info('Sending payment confirmation email', { paymentIntentId: paymentIntent.id })
  }

  private async sendPaymentFailureEmail(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    logger.info('Sending payment failure email', { paymentIntentId: paymentIntent.id })
  }

  private async sendSubscriptionConfirmationEmail(subscription: Stripe.Subscription): Promise<void> {
    logger.info('Sending subscription confirmation email', { subscriptionId: subscription.id })
  }

  private async sendSubscriptionCancellationEmail(subscription: Stripe.Subscription): Promise<void> {
    logger.info('Sending subscription cancellation email', { subscriptionId: subscription.id })
  }

  private async sendRefundConfirmationEmail(charge: Stripe.Charge): Promise<void> {
    logger.info('Sending refund confirmation email', { chargeId: charge.id })
  }

  private async sendDisputeNotification(dispute: Stripe.Dispute): Promise<void> {
    logger.info('Sending dispute notification', { disputeId: dispute.id })
  }
}

export const stripeWebhookService = StripeWebhookService.getInstance()
