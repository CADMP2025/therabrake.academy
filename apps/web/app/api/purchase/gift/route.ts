/**
 * Gift Purchase API
 * POST /api/purchase/gift - Purchase a course, program, or membership as a gift
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/monitoring/logger'
import { StripePurchaseService } from '@/lib/stripe/purchase-service'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      recipientEmail,
      recipientName,
      courseId,
      program,
      membershipTier,
      membershipMonths,
      personalMessage,
      deliveryDate
    } = body

    // Validate required fields
    if (!recipientEmail || !recipientName) {
      return NextResponse.json(
        { error: 'Recipient email and name are required' },
        { status: 400 }
      )
    }

    // Validate that at least one gift item is specified
    if (!courseId && !program && !membershipTier) {
      return NextResponse.json(
        { error: 'Must specify courseId, program, or membershipTier' },
        { status: 400 }
      )
    }

    // Purchase gift
    const purchaseService = StripePurchaseService.getInstance()
    const result = await purchaseService.purchaseGift({
      purchaserUserId: user.id,
      recipientEmail,
      recipientName,
      courseId,
      program,
      membershipTier,
      membershipMonths: membershipMonths || 1,
      personalMessage,
      deliveryDate,
      metadata: {
        purchaser_email: user.email!
      }
    })

    if (!result.success) {
      logger.warn('Gift purchase failed', {
        purchaserId: user.id,
        recipientEmail,
        error: result.error
      })

      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    logger.info('Gift purchase successful', {
      purchaserId: user.id,
      recipientEmail,
      amount: result.data!.amount
    })

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error: any) {
    logger.error('Gift purchase API error', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
