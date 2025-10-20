// app/api/stripe/create-checkout-session/route.ts
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil'
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to continue' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId, productType, courseId, programType, price, planName } = body

    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: 'User ID mismatch' },
        { status: 403 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    // ========================================
    // NEW: GET AFFILIATE CLICK ID FROM COOKIE
    // ========================================
    const cookieStore = cookies()
    const affiliateClickId = cookieStore.get('affiliate_click_id')?.value
    const affiliateRef = cookieStore.get('affiliate_ref')?.value
    
    console.log('Affiliate tracking:', { affiliateClickId, affiliateRef })
    // ========================================

    const metadata: any = {
      userId,
      productType,
      email: profile?.email || session.user.email,
      affiliate_click_id: affiliateClickId || '', // NEW: Add to metadata
      affiliateCode: affiliateRef || '' // NEW: Add ref code for your existing system
    }

    let priceId: string
    let successUrl: string

    switch (productType) {
      case 'course':
        if (!courseId) {
          return NextResponse.json({ error: 'Course ID required' }, { status: 400 })
        }
        
        const { data: course } = await supabase
          .from('courses')
          .select('title, stripe_price_id')
          .eq('id', courseId)
          .single()

        if (!course || !course.stripe_price_id) {
          return NextResponse.json({ error: 'Course not found or price not configured' }, { status: 404 })
        }

        metadata.courseId = courseId
        priceId = course.stripe_price_id
        successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/learn/${courseId}`
        break

      case 'premium':
        if (!programType) {
          return NextResponse.json({ error: 'Program type required' }, { status: 400 })
        }

        metadata.programType = programType
        
        if (programType === 'LEAP_AND_LAUNCH') {
          priceId = process.env.STRIPE_PRICE_PREMIUM_LEAP_LAUNCH!
          successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/programs/leap-launch`
        } else if (programType === 'SO_WHAT_MINDSET') {
          priceId = process.env.STRIPE_PRICE_PREMIUM_SOWHAT_MINDSET!
          successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/programs/so-what`
        } else {
          return NextResponse.json({ error: 'Invalid program type' }, { status: 400 })
        }
        break

      case 'membership':
        if (!planName) {
          return NextResponse.json({ error: 'Plan name required' }, { status: 400 })
        }

        metadata.membershipType = planName
        
        const priceIdMap: Record<string, string> = {
          'ce_1y': process.env.STRIPE_PRICE_CE_MEMBERSHIP_1Y!,
          'ce_2y': process.env.STRIPE_PRICE_CE_MEMBERSHIP_2Y!,
          'ce_5y': process.env.STRIPE_PRICE_CE_MEMBERSHIP_5Y!,
          'pd_1y': process.env.STRIPE_PRICE_PERSONAL_DEV_1Y!,
          'pd_2y': process.env.STRIPE_PRICE_PERSONAL_DEV_2Y!,
          'pd_5y': process.env.STRIPE_PRICE_PERSONAL_DEV_5Y!
        }
        
        priceId = priceIdMap[planName]
        successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/membership`
        break

      default:
        return NextResponse.json({ error: 'Invalid product type' }, { status: 400 })
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID not configured' }, { status: 500 })
    }

    // ========================================
    // CREATE STRIPE CHECKOUT SESSION
    // Now includes affiliate tracking in metadata
    // ========================================
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: profile?.email || session.user.email,
      client_reference_id: userId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: productType === 'membership' && planName?.includes('1y') ? 'subscription' : 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses`,
      metadata, // This now includes affiliate_click_id and affiliateCode
      payment_intent_data: productType !== 'membership' ? { metadata } : undefined,
      subscription_data: productType === 'membership' ? { metadata } : undefined
    })

    // Log successful checkout session creation with affiliate info
    if (affiliateClickId) {
      console.log(`✅ Checkout session created with affiliate tracking:`, {
        sessionId: checkoutSession.id,
        affiliateClickId,
        userId,
        productType
      })
    }

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    })

  } catch (error: any) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}