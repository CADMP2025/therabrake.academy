import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    // Handle the event based on type
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful checkout
        console.log('Checkout completed:', event.data.object)
        break
      case 'payment_intent.succeeded':
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error.message)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
