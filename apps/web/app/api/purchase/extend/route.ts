/**
 * Extension Purchase API
 * POST /api/purchase/extend - Purchase an enrollment extension
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'
import { logger } from '@/lib/monitoring/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil'
})

interface ExtensionPurchaseRequest {
  enrollmentId: string
  extensionDays: number
  // Optional: if user wants to specify custom price
  customPriceId?: string
}

// Pricing: $1 per day, minimum 7 days, maximum 365 days
const PRICE_PER_DAY = 100 // $1.00 in cents
const MIN_EXTENSION_DAYS = 7
const MAX_EXTENSION_DAYS = 365

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verify user authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const userEmail = session.user.email!
    const body: ExtensionPurchaseRequest = await request.json()

    // Validate request
    if (!body.enrollmentId || !body.extensionDays) {
      return NextResponse.json(
        { error: 'Missing required fields: enrollmentId, extensionDays' },
        { status: 400 }
      )
    }

    if (body.extensionDays < MIN_EXTENSION_DAYS || body.extensionDays > MAX_EXTENSION_DAYS) {
      return NextResponse.json(
        { error: `Extension days must be between ${MIN_EXTENSION_DAYS} and ${MAX_EXTENSION_DAYS}` },
        { status: 400 }
      )
    }

    // Verify enrollment exists and belongs to user
    const { data: enrollment, error: fetchError } = await supabase
      .from('enrollments')
      .select(`
        id,
        user_id,
        course_id,
        status,
        expires_at,
        grace_period_ends_at,
        courses (
          id,
          title
        )
      `)
      .eq('id', body.enrollmentId)
      .single()

    if (fetchError || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    if (enrollment.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - enrollment does not belong to user' },
        { status: 403 }
      )
    }

    // Calculate price
    const amount = body.extensionDays * PRICE_PER_DAY

    // Get or create Stripe customer
    const { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    let customerId = existingCustomer?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          user_id: userId
        }
      })
      customerId = customer.id

      // Save customer ID
      await supabase
        .from('stripe_customers')
        .insert({
          user_id: userId,
          stripe_customer_id: customerId,
          email: userEmail
        })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customerId,
      metadata: {
        type: 'enrollment_extension',
        user_id: userId,
        user_email: userEmail,
        enrollment_id: body.enrollmentId,
        course_id: enrollment.course_id || '',
        course_name: (enrollment.courses as any)?.title || 'Course',
        extension_days: body.extensionDays.toString()
      },
      automatic_payment_methods: {
        enabled: true
      }
    })

    logger.info('Extension purchase created', {
      userId,
      enrollmentId: body.enrollmentId,
      extensionDays: body.extensionDays,
      amount,
      paymentIntentId: paymentIntent.id
    })

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount,
        extensionDays: body.extensionDays
      }
    })

  } catch (error) {
    logger.error('Failed to create extension purchase', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
