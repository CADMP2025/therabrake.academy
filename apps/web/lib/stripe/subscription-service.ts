/**
 * Stripe Subscription Service
 * Handles subscription creation, updates, cancellation, and management
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

export interface CreateSubscriptionParams {
  userId: string
  priceId: string
  productName: string
  productType?: string
  subscriptionType: 'monthly' | 'annual' | 'lifetime'
  trialDays?: number
  metadata?: Record<string, string>
}

export interface SubscriptionResult {
  subscriptionId: string
  clientSecret?: string
  status: string
}

export class StripeSubscriptionService extends BaseService {
  private static instance: StripeSubscriptionService

  private constructor() {
    super()
  }

  static getInstance(): StripeSubscriptionService {
    if (!StripeSubscriptionService.instance) {
      StripeSubscriptionService.instance = new StripeSubscriptionService()
    }
    return StripeSubscriptionService.instance
  }

  /**
   * Create subscription
   */
  async createSubscription(
    params: CreateSubscriptionParams
  ): Promise<ServiceResponse<SubscriptionResult>> {
    try {
      // Get user info
      const { data: user } = await supabase.auth.admin.getUserById(params.userId)
      if (!user || !user.user) {
        return this.error('User not found', 'USER_NOT_FOUND')
      }

      // Get or create Stripe customer
      const { data: existingCustomer } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', params.userId)
        .single()

      let customerId: string

      if (existingCustomer) {
        customerId = existingCustomer.stripe_customer_id
      } else {
        const customer = await stripe.customers.create({
          email: user.user.email!,
          name: user.user.user_metadata?.name,
          metadata: { user_id: params.userId }
        })

        await supabase.from('stripe_customers').insert({
          user_id: params.userId,
          stripe_customer_id: customer.id,
          email: user.user.email!,
          name: user.user.user_metadata?.name
        })

        customerId = customer.id
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: params.priceId }],
        trial_period_days: params.trialDays,
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          user_id: params.userId,
          product_name: params.productName,
          product_type: params.productType || 'membership',
          subscription_type: params.subscriptionType,
          ...params.metadata
        }
      })

      // Get client secret from payment intent
      const invoice = subscription.latest_invoice as Stripe.Invoice
      const paymentIntent = (invoice as any)?.payment_intent as Stripe.PaymentIntent
      const clientSecret = paymentIntent?.client_secret

      logger.info('Created subscription', {
        subscriptionId: subscription.id,
        status: subscription.status
      })

      return this.success({
        subscriptionId: subscription.id,
        clientSecret: clientSecret || undefined,
        status: subscription.status
      })
    } catch (error) {
      logger.error('Failed to create subscription', error as Error)
      return this.error('Failed to create subscription', 'SUBSCRIPTION_CREATION_FAILED')
    }
  }

  /**
   * Update subscription (change plan)
   */
  async updateSubscription(
    subscriptionId: string,
    newPriceId: string,
    prorationBehavior: 'create_prorations' | 'none' | 'always_invoice' = 'create_prorations'
  ): Promise<ServiceResponse<Stripe.Subscription>> {
    try {
      // Get current subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      
      // Update with new price
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId
        }],
        proration_behavior: prorationBehavior
      })

      logger.info('Updated subscription', {
        subscriptionId,
        newPriceId,
        prorationBehavior
      })

      return this.success(updatedSubscription)
    } catch (error) {
      logger.error('Failed to update subscription', error as Error)
      return this.error('Failed to update subscription', 'SUBSCRIPTION_UPDATE_FAILED')
    }
  }

  /**
   * Cancel subscription (at period end)
   */
  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true,
    cancellationReason?: string
  ): Promise<ServiceResponse<Stripe.Subscription>> {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd,
        cancellation_details: cancellationReason ? {
          comment: cancellationReason
        } : undefined
      })

      // Update database
      await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: cancelAtPeriodEnd,
          cancellation_reason: cancellationReason
        })
        .eq('stripe_subscription_id', subscriptionId)

      logger.info('Canceled subscription', {
        subscriptionId,
        cancelAtPeriodEnd,
        reason: cancellationReason
      })

      return this.success(subscription)
    } catch (error) {
      logger.error('Failed to cancel subscription', error as Error)
      return this.error('Failed to cancel subscription', 'SUBSCRIPTION_CANCELLATION_FAILED')
    }
  }

  /**
   * Cancel subscription immediately
   */
  async cancelSubscriptionImmediately(
    subscriptionId: string
  ): Promise<ServiceResponse<Stripe.Subscription>> {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId)

      logger.info('Canceled subscription immediately', { subscriptionId })

      return this.success(subscription)
    } catch (error) {
      logger.error('Failed to cancel subscription immediately', error as Error)
      return this.error('Failed to cancel subscription', 'SUBSCRIPTION_IMMEDIATE_CANCEL_FAILED')
    }
  }

  /**
   * Reactivate canceled subscription
   */
  async reactivateSubscription(
    subscriptionId: string
  ): Promise<ServiceResponse<Stripe.Subscription>> {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      })

      // Update database
      await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: false,
          cancellation_reason: null
        })
        .eq('stripe_subscription_id', subscriptionId)

      logger.info('Reactivated subscription', { subscriptionId })

      return this.success(subscription)
    } catch (error) {
      logger.error('Failed to reactivate subscription', error as Error)
      return this.error('Failed to reactivate subscription', 'SUBSCRIPTION_REACTIVATION_FAILED')
    }
  }

  /**
   * Pause subscription
   */
  async pauseSubscription(
    subscriptionId: string,
    resumeAt?: Date
  ): Promise<ServiceResponse<Stripe.Subscription>> {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        pause_collection: {
          behavior: 'mark_uncollectible',
          resumes_at: resumeAt ? Math.floor(resumeAt.getTime() / 1000) : undefined
        }
      })

      logger.info('Paused subscription', {
        subscriptionId,
        resumeAt: resumeAt?.toISOString()
      })

      return this.success(subscription)
    } catch (error) {
      logger.error('Failed to pause subscription', error as Error)
      return this.error('Failed to pause subscription', 'SUBSCRIPTION_PAUSE_FAILED')
    }
  }

  /**
   * Resume paused subscription
   */
  async resumeSubscription(
    subscriptionId: string
  ): Promise<ServiceResponse<Stripe.Subscription>> {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        pause_collection: null as any
      })

      logger.info('Resumed subscription', { subscriptionId })

      return this.success(subscription)
    } catch (error) {
      logger.error('Failed to resume subscription', error as Error)
      return this.error('Failed to resume subscription', 'SUBSCRIPTION_RESUME_FAILED')
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(
    subscriptionId: string
  ): Promise<ServiceResponse<Stripe.Subscription>> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['latest_invoice', 'customer']
      })

      return this.success(subscription)
    } catch (error) {
      logger.error('Failed to retrieve subscription', error as Error)
      return this.error('Failed to retrieve subscription', 'SUBSCRIPTION_RETRIEVAL_FAILED')
    }
  }

  /**
   * List customer subscriptions
   */
  async listCustomerSubscriptions(
    customerId: string,
    status?: 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'all'
  ): Promise<ServiceResponse<Stripe.Subscription[]>> {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status,
        expand: ['data.latest_invoice']
      })

      return this.success(subscriptions.data)
    } catch (error) {
      logger.error('Failed to list subscriptions', error as Error)
      return this.error('Failed to list subscriptions', 'SUBSCRIPTION_LIST_FAILED')
    }
  }

  /**
   * Get upcoming invoice for subscription
   */
  async getUpcomingInvoice(
    subscriptionId: string
  ): Promise<ServiceResponse<Stripe.Invoice>> {
    try {
      const invoice = await (stripe.invoices as any).retrieveUpcoming({
        subscription: subscriptionId
      })

      return this.success(invoice)
    } catch (error) {
      logger.error('Failed to retrieve upcoming invoice', error as Error)
      return this.error('Failed to retrieve upcoming invoice', 'UPCOMING_INVOICE_FAILED')
    }
  }

  /**
   * Update subscription payment method
   */
  async updatePaymentMethod(
    subscriptionId: string,
    paymentMethodId: string
  ): Promise<ServiceResponse<Stripe.Subscription>> {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        default_payment_method: paymentMethodId
      })

      logger.info('Updated subscription payment method', {
        subscriptionId,
        paymentMethodId
      })

      return this.success(subscription)
    } catch (error) {
      logger.error('Failed to update payment method', error as Error)
      return this.error('Failed to update payment method', 'PAYMENT_METHOD_UPDATE_FAILED')
    }
  }

  /**
   * Apply coupon to subscription
   */
  async applyCoupon(
    subscriptionId: string,
    couponId: string
  ): Promise<ServiceResponse<Stripe.Subscription>> {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        coupon: couponId
      } as any)

      logger.info('Applied coupon to subscription', {
        subscriptionId,
        couponId
      })

      return this.success(subscription)
    } catch (error) {
      logger.error('Failed to apply coupon', error as Error)
      return this.error('Failed to apply coupon', 'COUPON_APPLICATION_FAILED')
    }
  }

  /**
   * Remove coupon from subscription
   */
  async removeCoupon(
    subscriptionId: string
  ): Promise<ServiceResponse<Stripe.Subscription>> {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        coupon: ''
      } as any)

      logger.info('Removed coupon from subscription', { subscriptionId })

      return this.success(subscription)
    } catch (error) {
      logger.error('Failed to remove coupon', error as Error)
      return this.error('Failed to remove coupon', 'COUPON_REMOVAL_FAILED')
    }
  }

  /**
   * Get subscription from database
   */
  async getSubscriptionFromDB(
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      return this.success(data)
    } catch (error) {
      logger.error('Failed to get subscription from DB', error as Error)
      return this.error('Failed to get subscription', 'SUBSCRIPTION_DB_RETRIEVAL_FAILED')
    }
  }

  /**
   * Check if user has active subscription
   */
  async hasActiveSubscription(
    userId: string,
    productType?: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      let query = supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .in('status', ['active', 'trialing'])

      if (productType) {
        query = query.eq('product_type', productType)
      }

      const { data, error } = await query.limit(1).single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return this.success(!!data)
    } catch (error) {
      logger.error('Failed to check active subscription', error as Error)
      return this.error('Failed to check subscription', 'SUBSCRIPTION_CHECK_FAILED')
    }
  }
}

export const stripeSubscriptionService = StripeSubscriptionService.getInstance()
