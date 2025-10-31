/**
 * PurchaseService
 * 
 * Handles all purchase workflows:
 * - Single course purchases
 * - Membership subscriptions ($199, $349, $699)
 * - So What Mindset program ($499)
 * - Leap & Launch program ($299)
 * - Gift purchases
 * - Installment plans
 * - Promotional code application
 */

import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/monitoring/logger'
import { BaseService, ServiceResponse } from '@/lib/services/base-service'
import { StripePaymentService } from './payment-service'
import { StripeSubscriptionService } from './subscription-service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil'
})

// Pricing Configuration
export const PRICING = {
  // Memberships (monthly subscriptions)
  MEMBERSHIPS: {
    BASIC: {
      name: 'Basic Membership',
      price: 19900, // $199/month
      stripePriceId: process.env.STRIPE_PRICE_BASIC_MEMBERSHIP!,
      features: [
        'Access to all basic courses',
        'Monthly live Q&A sessions',
        'Community forum access',
        'Email support'
      ]
    },
    PROFESSIONAL: {
      name: 'Professional Membership',
      price: 34900, // $349/month
      stripePriceId: process.env.STRIPE_PRICE_PROFESSIONAL_MEMBERSHIP!,
      features: [
        'All Basic features',
        'Access to advanced courses',
        'Weekly live workshops',
        'Priority support',
        '1-on-1 monthly consultation'
      ]
    },
    PREMIUM: {
      name: 'Premium Membership',
      price: 69900, // $699/month
      stripePriceId: process.env.STRIPE_PRICE_PREMIUM_MEMBERSHIP!,
      features: [
        'All Professional features',
        'Unlimited course access',
        'Daily live sessions',
        '24/7 priority support',
        'Weekly 1-on-1 consultations',
        'Exclusive mastermind group'
      ]
    }
  },
  
  // Special Programs (one-time purchases)
  PROGRAMS: {
    SO_WHAT_MINDSET: {
      name: 'So What Mindset Program',
      price: 49900, // $499
      stripePriceId: process.env.STRIPE_PRICE_SO_WHAT_MINDSET!,
      duration: 90, // days
      features: [
        '8-week intensive program',
        'Weekly coaching calls',
        'Workbook and exercises',
        'Lifetime access to materials',
        'Certificate of completion'
      ]
    },
    LEAP_AND_LAUNCH: {
      name: 'Leap & Launch Program',
      price: 29900, // $299
      stripePriceId: process.env.STRIPE_PRICE_LEAP_AND_LAUNCH!,
      duration: 60, // days
      features: [
        '6-week action program',
        'Goal setting framework',
        'Accountability partnership',
        'Resource library access',
        'Certificate of completion'
      ]
    }
  }
} as const

export type MembershipTier = keyof typeof PRICING.MEMBERSHIPS
export type ProgramType = keyof typeof PRICING.PROGRAMS

interface PurchaseCourseParams {
  userId: string
  courseId: string
  userEmail: string
  promoCode?: string
  metadata?: Record<string, string>
}

interface PurchaseMembershipParams {
  userId: string
  tier: MembershipTier
  userEmail: string
  trialDays?: number
  promoCode?: string
  metadata?: Record<string, string>
}

interface PurchaseProgramParams {
  userId: string
  program: ProgramType
  userEmail: string
  promoCode?: string
  installments?: number // 2 or 3 installments
  metadata?: Record<string, string>
}

interface GiftPurchaseParams {
  purchaserUserId: string
  recipientEmail: string
  recipientName: string
  courseId?: string
  program?: ProgramType
  membershipTier?: MembershipTier
  membershipMonths?: number // For gift memberships
  personalMessage?: string
  deliveryDate?: string // ISO date string
  metadata?: Record<string, string>
}

interface PurchaseResult {
  clientSecret: string
  paymentIntentId?: string
  subscriptionId?: string
  amount: number
  currency: string
}

interface PromoCodeValidation {
  valid: boolean
  discountAmount?: number
  discountPercent?: number
  code?: string
  reason?: string
}

export class StripePurchaseService extends BaseService {
  private static instance: StripePurchaseService
  private paymentService: StripePaymentService
  private subscriptionService: StripeSubscriptionService

  private constructor() {
    super()
    this.paymentService = StripePaymentService.getInstance()
    this.subscriptionService = StripeSubscriptionService.getInstance()
  }

  public static getInstance(): StripePurchaseService {
    if (!StripePurchaseService.instance) {
      StripePurchaseService.instance = new StripePurchaseService()
    }
    return StripePurchaseService.instance
  }

  /**
   * Purchase a single course
   */
  async purchaseCourse(
    params: PurchaseCourseParams
  ): Promise<ServiceResponse<PurchaseResult>> {
    try {
      const supabase = await createClient()

      // Get course details
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id, title, price')
        .eq('id', params.courseId)
        .single()

      if (courseError || !course) {
        logger.error('Course not found', undefined, { courseId: params.courseId })
        return this.error('Course not found', 'COURSE_NOT_FOUND')
      }

      if (!course.price || course.price <= 0) {
        logger.error('Course has invalid price', undefined, { courseId: params.courseId })
        return this.error('Course is not available for purchase', 'INVALID_PRICE')
      }

      // Check if user already owns the course
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', params.userId)
        .eq('course_id', params.courseId)
        .eq('status', 'active')
        .single()

      if (existingEnrollment) {
        return this.error('User already owns this course', 'ALREADY_ENROLLED')
      }

      let finalPrice = course.price

      // Apply promo code if provided
      if (params.promoCode) {
        const promoValidation = await this.validatePromoCode(
          params.promoCode,
          finalPrice,
          'course'
        )

        if (promoValidation.valid && promoValidation.discountAmount) {
          finalPrice -= promoValidation.discountAmount
        }
      }

      // Create payment intent
      const paymentResult = await this.paymentService.createPaymentWithTax({
        userId: params.userId,
        amount: finalPrice,
        currency: 'usd',
        productType: 'course',
        productId: params.courseId,
        productName: course.title,
        description: `Purchase: ${course.title}`,
        metadata: {
          type: 'course_purchase',
          course_id: params.courseId,
          course_title: course.title,
          promo_code: params.promoCode || '',
          ...params.metadata
        }
      })

      if (!paymentResult.success || !paymentResult.data) {
        return this.error('Failed to create payment', 'PAYMENT_CREATION_FAILED')
      }

      logger.info('Course purchase initiated', {
        userId: params.userId,
        courseId: params.courseId,
        amount: finalPrice
      })

      return this.success({
        clientSecret: paymentResult.data.clientSecret,
        paymentIntentId: paymentResult.data.paymentIntentId,
        amount: finalPrice,
        currency: 'usd'
      })
    } catch (error: any) {
      logger.error('Error purchasing course', error, {
        userId: params.userId,
        courseId: params.courseId
      })
      return this.error('Error purchasing course', 'PURCHASE_ERROR')
    }
  }

  /**
   * Purchase a membership subscription
   */
  async purchaseMembership(
    params: PurchaseMembershipParams
  ): Promise<ServiceResponse<PurchaseResult>> {
    try {
      const membershipConfig = PRICING.MEMBERSHIPS[params.tier]
      
      if (!membershipConfig) {
        return this.error('Invalid membership tier', 'INVALID_TIER')
      }

      // Check if user already has an active subscription
      const hasActive = await this.subscriptionService.hasActiveSubscription(
        params.userId
      )

      if (hasActive) {
        return this.error('User already has an active membership', 'ALREADY_SUBSCRIBED')
      }

      let coupon: string | undefined

      // Apply promo code if provided
      if (params.promoCode) {
        const promoValidation = await this.validatePromoCode(
          params.promoCode,
          membershipConfig.price,
          'membership'
        )

        if (promoValidation.valid) {
          coupon = params.promoCode
        }
      }

      // Create subscription
      const subscriptionResult = await this.subscriptionService.createSubscription({
        userId: params.userId,
        priceId: membershipConfig.stripePriceId,
        productName: membershipConfig.name,
        productType: 'membership',
        subscriptionType: 'monthly',
        trialDays: params.trialDays,
        metadata: {
          type: 'membership',
          tier: params.tier,
          coupon: coupon || '',
          ...params.metadata
        }
      })

      if (!subscriptionResult.success || !subscriptionResult.data) {
        return this.error('Failed to create subscription', 'SUBSCRIPTION_CREATION_FAILED')
      }

      const { subscriptionId, clientSecret } = subscriptionResult.data

      logger.info('Membership purchase initiated', {
        userId: params.userId,
        tier: params.tier,
        price: membershipConfig.price
      })

      return this.success({
        clientSecret: clientSecret || '',
        subscriptionId,
        amount: membershipConfig.price,
        currency: 'usd'
      })
    } catch (error: any) {
      logger.error('Error purchasing membership', error, {
        userId: params.userId,
        tier: params.tier
      })
      return this.error('Error purchasing membership', 'PURCHASE_ERROR')
    }
  }

  /**
   * Purchase a special program (So What Mindset or Leap & Launch)
   */
  async purchaseProgram(
    params: PurchaseProgramParams
  ): Promise<ServiceResponse<PurchaseResult>> {
    try {
      const programConfig = PRICING.PROGRAMS[params.program]
      
      if (!programConfig) {
        return this.error('Invalid program type', 'INVALID_PROGRAM')
      }

      const supabase = await createClient()

      // Check if user already owns the program
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', params.userId)
        .eq('program_type', params.program)
        .eq('status', 'active')
        .single()

      if (existingEnrollment) {
        return this.error('User already owns this program', 'ALREADY_ENROLLED')
      }

      let finalPrice = programConfig.price

      // Apply promo code if provided
      if (params.promoCode) {
        const promoValidation = await this.validatePromoCode(
          params.promoCode,
          finalPrice,
          'program'
        )

        if (promoValidation.valid && promoValidation.discountAmount) {
          finalPrice -= promoValidation.discountAmount
        }
      }

      // Handle installments if requested
      if (params.installments && (params.installments === 2 || params.installments === 3)) {
        return await this.createInstallmentPlan({
          userId: params.userId,
          totalAmount: finalPrice,
          installments: params.installments,
          description: `${programConfig.name} - Installment Plan`,
          metadata: {
            type: 'program_purchase',
            program: params.program,
            program_name: programConfig.name,
            promo_code: params.promoCode || '',
            ...params.metadata
          }
        })
      }

      // Create one-time payment
      const paymentResult = await this.paymentService.createPaymentWithTax({
        userId: params.userId,
        amount: finalPrice,
        currency: 'usd',
        productType: 'program',
        productId: params.program,
        productName: programConfig.name,
        description: `Purchase: ${programConfig.name}`,
        metadata: {
          type: 'program_purchase',
          program: params.program,
          program_name: programConfig.name,
          duration_days: programConfig.duration.toString(),
          promo_code: params.promoCode || '',
          ...params.metadata
        }
      })

      if (!paymentResult.success || !paymentResult.data) {
        return this.error('Failed to create payment', 'PAYMENT_CREATION_FAILED')
      }

      logger.info('Program purchase initiated', {
        userId: params.userId,
        program: params.program,
        amount: finalPrice
      })

      return this.success({
        clientSecret: paymentResult.data.clientSecret,
        paymentIntentId: paymentResult.data.paymentIntentId,
        amount: finalPrice,
        currency: 'usd'
      })
    } catch (error: any) {
      logger.error('Error purchasing program', error, {
        userId: params.userId,
        program: params.program
      })
      return this.error('Error purchasing program', 'PURCHASE_ERROR')
    }
  }

  /**
   * Purchase a course or membership as a gift
   */
  async purchaseGift(
    params: GiftPurchaseParams
  ): Promise<ServiceResponse<PurchaseResult>> {
    try {
      const supabase = await createClient()

      let amount = 0
      let description = ''
      let giftType = ''
      let giftMetadata: Record<string, string> = {}

      // Determine gift type and amount
      if (params.courseId) {
        const { data: course } = await supabase
          .from('courses')
          .select('title, price')
          .eq('id', params.courseId)
          .single()

        if (!course || !course.price) {
          return this.error('Invalid course for gift', 'INVALID_GIFT_COURSE')
        }

        amount = course.price
        description = `Gift: ${course.title}`
        giftType = 'course'
        giftMetadata.course_id = params.courseId
        giftMetadata.course_title = course.title
      } else if (params.program) {
        const programConfig = PRICING.PROGRAMS[params.program]
        if (!programConfig) {
          return this.error('Invalid program for gift', 'INVALID_GIFT_PROGRAM')
        }

        amount = programConfig.price
        description = `Gift: ${programConfig.name}`
        giftType = 'program'
        giftMetadata.program = params.program
        giftMetadata.program_name = programConfig.name
      } else if (params.membershipTier) {
        const membershipConfig = PRICING.MEMBERSHIPS[params.membershipTier]
        if (!membershipConfig) {
          return this.error('Invalid membership for gift', 'INVALID_GIFT_MEMBERSHIP')
        }

        const months = params.membershipMonths || 1
        amount = membershipConfig.price * months
        description = `Gift: ${membershipConfig.name} (${months} months)`
        giftType = 'membership'
        giftMetadata.membership_tier = params.membershipTier
        giftMetadata.membership_months = months.toString()
      } else {
        return this.error('No gift item specified', 'MISSING_GIFT_ITEM')
      }

      // Create gift record in database
      const { data: gift, error: giftError } = await supabase
        .from('gift_purchases')
        .insert({
          purchaser_user_id: params.purchaserUserId,
          recipient_email: params.recipientEmail,
          recipient_name: params.recipientName,
          gift_type: giftType,
          amount,
          personal_message: params.personalMessage,
          delivery_date: params.deliveryDate || new Date().toISOString(),
          status: 'pending',
          metadata: giftMetadata
        })
        .select()
        .single()

      if (giftError || !gift) {
        logger.error('Failed to create gift record', undefined, {
          error: giftError?.message
        })
        return this.error('Failed to create gift', 'GIFT_CREATION_FAILED')
      }

      // Create payment intent
      const paymentResult = await this.paymentService.createPaymentWithTax({
        userId: params.purchaserUserId,
        amount,
        currency: 'usd',
        productType: giftType === 'course' ? 'course' : giftType === 'program' ? 'program' : 'membership',
        productId: params.courseId || params.program || params.membershipTier || 'gift',
        productName: description,
        description,
        metadata: {
          type: 'gift_purchase',
          gift_id: gift.id,
          gift_type: giftType,
          recipient_email: params.recipientEmail,
          recipient_name: params.recipientName,
          ...giftMetadata,
          ...params.metadata
        }
      })

      if (!paymentResult.success || !paymentResult.data) {
        return this.error('Failed to create payment', 'PAYMENT_CREATION_FAILED')
      }

      logger.info('Gift purchase initiated', {
        purchaserId: params.purchaserUserId,
        giftType,
        amount,
        recipientEmail: params.recipientEmail
      })

      return this.success({
        clientSecret: paymentResult.data.clientSecret,
        paymentIntentId: paymentResult.data.paymentIntentId,
        amount,
        currency: 'usd'
      })
    } catch (error: any) {
      logger.error('Error purchasing gift', error, {
        purchaserId: params.purchaserUserId
      })
      return this.error('Error purchasing gift', 'PURCHASE_ERROR')
    }
  }

  /**
   * Create an installment payment plan
   */
  private async createInstallmentPlan(params: {
    userId: string
    totalAmount: number
    installments: number
    description: string
    metadata: Record<string, string>
  }): Promise<ServiceResponse<PurchaseResult>> {
    try {
      const installmentAmount = Math.ceil(params.totalAmount / params.installments)
      
      // Create the first payment intent
      const paymentResult = await this.paymentService.createPaymentWithTax({
        userId: params.userId,
        amount: installmentAmount,
        currency: 'usd',
        productType: (params.metadata.type === 'course_purchase' ? 'course' : 'program') as any,
        productId: params.metadata.course_id || params.metadata.program || 'installment',
        productName: params.description,
        description: `${params.description} (1/${params.installments})`,
        metadata: {
          ...params.metadata,
          installment_plan: 'true',
          total_installments: params.installments.toString(),
          current_installment: '1',
          installment_amount: installmentAmount.toString(),
          total_amount: params.totalAmount.toString()
        }
      })

      if (!paymentResult.success || !paymentResult.data) {
        return this.error('Failed to create installment payment', 'INSTALLMENT_CREATION_FAILED')
      }

      // Store installment plan in database
      const supabase = await createClient()
      const { error: planError } = await supabase
        .from('installment_plans')
        .insert({
          user_id: params.userId,
          payment_intent_id: paymentResult.data.paymentIntentId,
          total_amount: params.totalAmount,
          installment_amount: installmentAmount,
          total_installments: params.installments,
          current_installment: 1,
          status: 'active',
          metadata: params.metadata
        })

      if (planError) {
        logger.error('Failed to store installment plan', undefined, {
          error: planError.message
        })
      }

      logger.info('Installment plan created', {
        userId: params.userId,
        totalAmount: params.totalAmount,
        installments: params.installments,
        firstPayment: installmentAmount
      })

      return this.success({
        clientSecret: paymentResult.data.clientSecret,
        paymentIntentId: paymentResult.data.paymentIntentId,
        amount: installmentAmount,
        currency: 'usd'
      })
    } catch (error: any) {
      logger.error('Error creating installment plan', error)
      return this.error('Error creating installment plan', 'INSTALLMENT_ERROR')
    }
  }

  /**
   * Validate a promotional code
   */
  async validatePromoCode(
    code: string,
    purchaseAmount: number,
    purchaseType: 'course' | 'membership' | 'program'
  ): Promise<PromoCodeValidation> {
    try {
      const supabase = await createClient()

      // Get promo code from database
      const { data: promo, error } = await supabase
        .from('promotional_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single()

      if (error || !promo) {
        return {
          valid: false,
          reason: 'Invalid promotional code'
        }
      }

      // Check expiration
      if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
        return {
          valid: false,
          reason: 'Promotional code has expired'
        }
      }

      // Check usage limit
      if (promo.max_uses && promo.times_used >= promo.max_uses) {
        return {
          valid: false,
          reason: 'Promotional code has reached its usage limit'
        }
      }

      // Check if applicable to purchase type
      if (promo.applicable_to && !promo.applicable_to.includes(purchaseType)) {
        return {
          valid: false,
          reason: `Promotional code not valid for ${purchaseType} purchases`
        }
      }

      // Check minimum purchase amount
      if (promo.minimum_purchase_amount && purchaseAmount < promo.minimum_purchase_amount) {
        return {
          valid: false,
          reason: `Minimum purchase amount of $${(promo.minimum_purchase_amount / 100).toFixed(2)} required`
        }
      }

      // Calculate discount
      let discountAmount = 0
      let discountPercent: number | undefined

      if (promo.discount_type === 'percentage') {
        discountPercent = promo.discount_value
        discountAmount = Math.floor((purchaseAmount * promo.discount_value) / 100)
      } else if (promo.discount_type === 'fixed') {
        discountAmount = promo.discount_value
      }

      // Cap discount at purchase amount
      discountAmount = Math.min(discountAmount, purchaseAmount)

      return {
        valid: true,
        discountAmount,
        discountPercent,
        code: promo.code
      }
    } catch (error: any) {
      logger.error('Error validating promo code', error, { code })
      return {
        valid: false,
        reason: 'Error validating promotional code'
      }
    }
  }

  /**
   * Get pricing information for all products
   */
  getPricing() {
    return PRICING
  }
}
