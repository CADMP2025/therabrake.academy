/**
 * Stripe Webhook API Route
 * Handles incoming Stripe webhook events with signature verification
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripeWebhookService } from '@/lib/stripe/webhook-handler'
import { logger } from '@/lib/monitoring/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body as text (required for signature verification)
    const body = await request.text()
    
    // Get Stripe signature from headers
    const signature = request.headers.get('stripe-signature')
    
    if (!signature) {
      logger.error('Missing Stripe signature', new Error('No signature header'))
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const verifyResult = await stripeWebhookService.verifyWebhookSignature(body, signature)
    
    if (!verifyResult.success || !verifyResult.data) {
      logger.error('Webhook signature verification failed', new Error(verifyResult.error))
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = verifyResult.data

    logger.info('Received webhook event', {
      eventId: event.id,
      eventType: event.type
    })

    // Process webhook event
    const result = await stripeWebhookService.processWebhook(event)

    if (!result.success) {
      logger.error('Webhook processing failed', new Error(result.error), {
        eventId: event.id,
        eventType: event.type
      })
      
      // Return 200 to prevent Stripe from retrying failed events indefinitely
      // We log the error for manual investigation
      return NextResponse.json(
        { received: true, error: result.error },
        { status: 200 }
      )
    }

    logger.info('Webhook processed successfully', {
      eventId: event.id,
      eventType: event.type
    })

    return NextResponse.json(
      { received: true },
      { status: 200 }
    )
  } catch (error) {
    logger.error('Webhook endpoint error', error as Error)
    
    // Return 500 for unexpected errors so Stripe will retry
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/webhooks/stripe
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Stripe webhook endpoint is active'
  })
}
