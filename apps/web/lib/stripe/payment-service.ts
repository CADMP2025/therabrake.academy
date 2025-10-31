/**
 * Stripe Payment Service
 * Handles payment intent creation, confirmation, and processing
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

export interface CreatePaymentIntentParams {
  userId: string
  amount: number // in cents
  currency?: string
  productType: 'course' | 'membership' | 'program' | 'extension'
  productId: string
  productName: string
  description?: string
  metadata?: Record<string, string>
}

export interface PaymentResult {
  paymentIntentId: string
  clientSecret: string
  status: string
}

export class StripePaymentService extends BaseService {
  private static instance: StripePaymentService

  private constructor() {
    super()
  }

  static getInstance(): StripePaymentService {
    if (!StripePaymentService.instance) {
      StripePaymentService.instance = new StripePaymentService()
    }
    return StripePaymentService.instance
  }

  /**
   * Create or get Stripe customer for user
   */
  async getOrCreateCustomer(
    userId: string,
    email: string,
    name?: string
  ): Promise<ServiceResponse<string>> {
    try {
      // Check if customer exists
      const { data: existingCustomer } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single()

      if (existingCustomer) {
        return this.success(existingCustomer.stripe_customer_id)
      }

      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { user_id: userId }
      })

      // Save to database
      await supabase.from('stripe_customers').insert({
        user_id: userId,
        stripe_customer_id: customer.id,
        email,
        name
      })

      logger.info('Created Stripe customer', { customerId: customer.id })

      return this.success(customer.id)
    } catch (error) {
      logger.error('Failed to create customer', error as Error)
      return this.error('Failed to create customer', 'CUSTOMER_CREATION_FAILED')
    }
  }

  /**
   * Create payment intent
   */
  async createPaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<ServiceResponse<PaymentResult>> {
    try {
      // Get user info
      const { data: user } = await supabase.auth.admin.getUserById(params.userId)
      if (!user || !user.user) {
        return this.error('User not found', 'USER_NOT_FOUND')
      }

      // Get or create Stripe customer
      const customerResult = await this.getOrCreateCustomer(
        params.userId,
        user.user.email!,
        user.user.user_metadata?.name
      )

      if (!customerResult.success || !customerResult.data) {
        return this.error(customerResult.error!, customerResult.code)
      }

      const customerId = customerResult.data

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: params.amount,
        currency: params.currency || 'usd',
        customer: customerId,
        description: params.description,
        metadata: {
          user_id: params.userId,
          product_type: params.productType,
          product_id: params.productId,
          product_name: params.productName,
          ...params.metadata
        },
        automatic_payment_methods: {
          enabled: true
        }
      })

      // Save to database
      await supabase.from('payments').insert({
        user_id: params.userId,
        stripe_payment_intent_id: paymentIntent.id,
        stripe_customer_id: customerId,
        amount: params.amount,
        currency: params.currency || 'usd',
        status: 'pending',
        product_type: params.productType,
        product_id: params.productId,
        product_name: params.productName,
        description: params.description,
        metadata: params.metadata || {}
      })

      logger.info('Created payment intent', {
        paymentIntentId: paymentIntent.id,
        amount: params.amount,
        productName: params.productName
      })

      return this.success({
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
        status: paymentIntent.status
      })
    } catch (error) {
      logger.error('Failed to create payment intent', error as Error)
      return this.error('Failed to create payment', 'PAYMENT_CREATION_FAILED')
    }
  }

  /**
   * Confirm payment intent
   */
  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<ServiceResponse<Stripe.PaymentIntent>> {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      })

      logger.info('Confirmed payment intent', { paymentIntentId })

      return this.success(paymentIntent)
    } catch (error) {
      logger.error('Failed to confirm payment', error as Error)
      return this.error('Failed to confirm payment', 'PAYMENT_CONFIRMATION_FAILED')
    }
  }

  /**
   * Cancel payment intent
   */
  async cancelPayment(
    paymentIntentId: string,
    cancellationReason?: string
  ): Promise<ServiceResponse<void>> {
    try {
      await stripe.paymentIntents.cancel(paymentIntentId, {
        cancellation_reason: cancellationReason as any
      })

      // Update database
      await supabase
        .from('payments')
        .update({ status: 'canceled' })
        .eq('stripe_payment_intent_id', paymentIntentId)

      logger.info('Canceled payment intent', { paymentIntentId })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to cancel payment', error as Error)
      return this.error('Failed to cancel payment', 'PAYMENT_CANCELLATION_FAILED')
    }
  }

  /**
   * Attach payment method to customer
   */
  async attachPaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<ServiceResponse<void>> {
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      })

      // Set as default
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      })

      logger.info('Attached payment method', { customerId, paymentMethodId })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to attach payment method', error as Error)
      return this.error('Failed to attach payment method', 'PAYMENT_METHOD_ATTACH_FAILED')
    }
  }

  /**
   * Get payment intent
   */
  async getPaymentIntent(
    paymentIntentId: string
  ): Promise<ServiceResponse<Stripe.PaymentIntent>> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      return this.success(paymentIntent)
    } catch (error) {
      logger.error('Failed to retrieve payment intent', error as Error)
      return this.error('Failed to retrieve payment', 'PAYMENT_RETRIEVAL_FAILED')
    }
  }

  /**
   * List payment methods for customer
   */
  async listPaymentMethods(
    customerId: string
  ): Promise<ServiceResponse<Stripe.PaymentMethod[]>> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      })

      return this.success(paymentMethods.data)
    } catch (error) {
      logger.error('Failed to list payment methods', error as Error)
      return this.error('Failed to list payment methods', 'PAYMENT_METHODS_LIST_FAILED')
    }
  }

  /**
   * Detach payment method from customer
   */
  async detachPaymentMethod(
    paymentMethodId: string
  ): Promise<ServiceResponse<void>> {
    try {
      await stripe.paymentMethods.detach(paymentMethodId)

      logger.info('Detached payment method', { paymentMethodId })

      return this.success(undefined)
    } catch (error) {
      logger.error('Failed to detach payment method', error as Error)
      return this.error('Failed to detach payment method', 'PAYMENT_METHOD_DETACH_FAILED')
    }
  }

  /**
   * Calculate sales tax (Texas)
   */
  calculateSalesTax(amount: number, state: string): number {
    // Texas sales tax rate: 6.25% state + up to 2% local = 8.25% max
    if (state.toLowerCase() === 'texas' || state.toLowerCase() === 'tx') {
      return Math.round(amount * 0.0825) // 8.25%
    }
    return 0
  }

  /**
   * Create payment with tax calculation
   */
  async createPaymentWithTax(
    params: CreatePaymentIntentParams & { state?: string }
  ): Promise<ServiceResponse<PaymentResult>> {
    try {
      // Calculate tax
      const tax = this.calculateSalesTax(params.amount, params.state || '')
      const totalAmount = params.amount + tax

      // Create payment intent with total amount
      const result = await this.createPaymentIntent({
        ...params,
        amount: totalAmount,
        metadata: {
          ...params.metadata,
          subtotal: params.amount.toString(),
          tax: tax.toString(),
          state: params.state || 'unknown'
        }
      })

      return result
    } catch (error) {
      logger.error('Failed to create payment with tax', error as Error)
      return this.error('Failed to create payment', 'PAYMENT_TAX_CALCULATION_FAILED')
    }
  }
}

export const stripePaymentService = StripePaymentService.getInstance()
