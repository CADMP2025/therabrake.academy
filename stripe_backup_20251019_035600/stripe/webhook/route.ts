import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  const supabase = createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { courseId, userId, courseTitle, ceHours } = session.metadata || {}

        if (!courseId || !userId) {
          throw new Error('Missing metadata in checkout session')
        }

        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .update({
            status: 'completed',
            stripe_payment_id: session.payment_intent as string,
            completed_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id)
          .select()
          .single()

        if (paymentError) {
          console.error('Payment update error:', paymentError)
          throw paymentError
        }

        const { error: enrollmentError } = await supabase
          .from('enrollments')
          .insert({
            user_id: userId,
            course_id: courseId,
            payment_id: payment.id,
            status: 'active',
            enrolled_at: new Date().toISOString(),
            progress: 0
          })

        if (enrollmentError) {
          console.error('Enrollment creation error:', enrollmentError)
          throw enrollmentError
        }

        await supabase.from('audit_logs').insert({
          user_id: userId,
          action: 'enrollment_created',
          resource_type: 'enrollment',
          resource_id: courseId,
          details: {
            course_title: courseTitle,
            ce_hours: ceHours,
            payment_id: payment.id,
            amount: session.amount_total ? session.amount_total / 100 : 0
          }
        })

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        await supabase
          .from('payments')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await supabase
          .from('payments')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_id', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
