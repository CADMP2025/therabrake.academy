import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const courseId = session.metadata?.courseId
        
        if (!userId) break
        
        await supabase.from('payments').insert({
          user_id: userId,
          course_id: courseId || null,
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_customer_id: session.customer as string,
          amount: session.amount_total! / 100,
          currency: session.currency || 'usd',
          status: 'completed',
          product_type: courseId ? 'course' : 'subscription',
          product_id: courseId || null,
        })
        
        if (courseId) {
          await supabase.from('enrollments').insert({
            user_id: userId,
            course_id: courseId,
            status: 'active',
            progress: 0,
            enrolled_at: new Date().toISOString(),
          })
        }
        
        if (session.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string)
          await supabase.from('subscriptions').insert({
            user_id: userId,
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: session.customer as string,
            status: 'active',
            current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          })
        }
        break
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
