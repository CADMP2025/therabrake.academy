import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

export async function POST(req: NextRequest) {
  try {
    const { courseId, userId, successUrl, cancelUrl } = await req.json()

    if (!courseId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('status', 'active')
      .single()

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: profile.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: `${course.ce_hours} CE Hours - Texas LPC Board Approved`,
              images: course.thumbnail_url ? [course.thumbnail_url] : []
            },
            unit_amount: Math.round(course.price * 100)
          },
          quantity: 1
        }
      ],
      metadata: {
        courseId,
        userId,
        courseTitle: course.title,
        ceHours: course.ce_hours.toString()
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_intent_data: {
        metadata: { courseId, userId }
      }
    })

    await supabase.from('payments').insert({
      user_id: userId,
      course_id: courseId,
      amount: course.price,
      status: 'pending',
      stripe_session_id: session.id,
      payment_method: 'stripe'
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
