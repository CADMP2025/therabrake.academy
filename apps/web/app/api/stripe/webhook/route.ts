// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
        console.log(`Invoice event: ${event.type}`)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const courseId = session.metadata?.courseId
  const affiliateCode = session.metadata?.affiliateCode || null
  const affiliateClickId = session.metadata?.affiliate_click_id || null // NEW: Get click ID

  if (!userId) {
    console.error('Missing userId in checkout session metadata')
    return
  }

  // Handle course purchase
  if (courseId) {
    // Create enrollment
    const { data: enrollmentData, error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        enrollment_status: 'active',
        enrolled_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (enrollmentError) {
      console.error('Error creating enrollment:', enrollmentError)
      return // Exit early if enrollment fails
    }

    // Record payment
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: userId,
        course_id: courseId,
        amount: (session.amount_total || 0) / 100,
        currency: session.currency || 'usd',
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_checkout_session_id: session.id,
        status: 'completed',
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Error creating payment record:', paymentError)
      return
    }

    // ========================================
    // NEW: AFFILIATE CONVERSION TRACKING
    // ========================================
    if (affiliateClickId) {
      try {
        // Record the affiliate conversion using the database function
        const { error: conversionError } = await supabaseAdmin
          .rpc('record_affiliate_conversion', {
            p_click_id: affiliateClickId,
            p_enrollment_id: enrollmentData.id,
            p_payment_id: payment.id,
            p_sale_amount: (session.amount_total || 0) / 100,
            p_commission_rate: 10.0 // 10% commission rate
          })

        if (conversionError) {
          console.error('Affiliate conversion error:', conversionError)
        } else {
          console.log(`✅ Affiliate conversion recorded: Click ${affiliateClickId} -> Payment ${payment.id}`)
        }
      } catch (error) {
        console.error('Failed to record affiliate conversion:', error)
      }
    }
    // ========================================
    // END AFFILIATE CONVERSION TRACKING
    // ========================================

    // ========================================
    // REVENUE SPLIT CALCULATION
    // ========================================
    await calculateAndRecordRevenueSplit(
      courseId, 
      userId, 
      payment.id, 
      session, 
      affiliateCode
    )
  }

  // Handle subscription purchase
  if (session.mode === 'subscription' && session.subscription) {
    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: userId,
        stripe_subscription_id: session.subscription as string,
        stripe_customer_id: session.customer as string,
        status: 'active',
        plan_id: session.metadata?.priceId || '',
      })

    if (subError) {
      console.error('Error creating subscription:', subError)
    }
  }
}

/**
 * Calculate and record revenue splits for course purchases
 * Handles instructor earnings and affiliate commissions
 */
async function calculateAndRecordRevenueSplit(
  courseId: string,
  studentId: string,
  paymentId: string,
  session: Stripe.Checkout.Session,
  affiliateCode: string | null
) {
  try {
    // Fetch course and instructor details
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select(`
        id,
        title,
        price,
        instructor_id,
        is_premium_program
      `)
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      console.error('Course not found for revenue split:', courseError)
      return
    }

    // Get instructor payment settings
    const { data: paymentSettings } = await supabaseAdmin
      .from('instructor_payment_settings')
      .select('*')
      .eq('instructor_id', course.instructor_id)
      .single()

    // Calculate amounts
    const grossAmount = (session.amount_total || 0) / 100 // Convert from cents to dollars
    const stripeFee = (grossAmount * 0.029) + 0.30 // Stripe's standard fee: 2.9% + $0.30
    const netAmount = grossAmount - stripeFee

    // Determine instructor revenue percentage
    const instructorPercentage = course.is_premium_program
      ? (paymentSettings?.program_revenue_percentage || 60) / 100  // 60% for premium programs
      : (paymentSettings?.course_revenue_percentage || 70) / 100   // 70% for standard courses

    // Handle affiliate commission
    let affiliateInstructorId: string | null = null
    let affiliateCommission = 0

    if (affiliateCode) {
      const { data: affiliateLink } = await supabaseAdmin
        .from('instructor_affiliate_links')
        .select('instructor_id, is_active')
        .eq('unique_code', affiliateCode)
        .eq('is_active', true)
        .single()

      // Only pay affiliate commission if it's a different instructor than the course creator
      if (affiliateLink && affiliateLink.instructor_id !== course.instructor_id) {
        affiliateInstructorId = affiliateLink.instructor_id

        // Get affiliate commission percentage (default 15%)
        const affiliatePercentage = (paymentSettings?.affiliate_commission_percentage || 15) / 100
        affiliateCommission = netAmount * affiliatePercentage
      }
    }

    // Calculate final splits
    const instructorEarnings = (netAmount - affiliateCommission) * instructorPercentage
    const platformRevenue = netAmount - instructorEarnings - affiliateCommission

    console.log('Revenue Split Breakdown:', {
      gross: grossAmount,
      stripeFee: stripeFee,
      net: netAmount,
      instructor: instructorEarnings,
      affiliate: affiliateCommission,
      platform: platformRevenue,
      courseTitle: course.title
    })

    // Record course creator earnings
    const { error: earningsError } = await supabaseAdmin
      .from('instructor_earnings')
      .insert({
        instructor_id: course.instructor_id,
        payment_id: paymentId,
        course_id: courseId,
        student_id: studentId,
        gross_sale_amount: grossAmount,
        platform_fee: platformRevenue,
        instructor_earnings: instructorEarnings,
        earnings_type: 'direct_sale',
        referred_by: affiliateInstructorId,
        payout_status: 'pending',
        earned_at: new Date().toISOString()
      })

    if (earningsError) {
      console.error('Failed to record instructor earnings:', earningsError)
    } else {
      console.log(`✅ Recorded earnings for instructor ${course.instructor_id}: $${instructorEarnings.toFixed(2)}`)
    }

    // Record affiliate commission if applicable
    if (affiliateInstructorId && affiliateCommission > 0) {
      const { error: affiliateError } = await supabaseAdmin
        .from('instructor_earnings')
        .insert({
          instructor_id: affiliateInstructorId,
          payment_id: paymentId,
          course_id: courseId,
          student_id: studentId,
          gross_sale_amount: grossAmount,
          platform_fee: 0,
          instructor_earnings: affiliateCommission,
          earnings_type: 'affiliate_commission',
          referred_by: null,
          payout_status: 'pending',
          earned_at: new Date().toISOString()
        })

      if (affiliateError) {
        console.error('Failed to record affiliate commission:', affiliateError)
      } else {
        console.log(`✅ Recorded affiliate commission for instructor ${affiliateInstructorId}: $${affiliateCommission.toFixed(2)}`)
      }

      // Update affiliate link statistics
      const { error: statsError } = await supabaseAdmin.rpc('increment_affiliate_stats', {
        link_code: affiliateCode,
        revenue_amount: grossAmount,
        commission_amount: affiliateCommission
      })

      if (statsError) {
        console.error('Failed to update affiliate stats:', statsError)
      }
    }

  } catch (error) {
    console.error('Error in revenue split calculation:', error)
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('Missing userId in subscription metadata')
    return
  }

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      status: subscription.status,
      plan_id: subscription.items.data[0].price.id,
    }, {
      onConflict: 'stripe_subscription_id'
    })

  if (error) {
    console.error('Error updating subscription:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({ 
      status: 'canceled', 
      canceled_at: new Date().toISOString() 
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('Error deleting subscription:', error)
  }
}