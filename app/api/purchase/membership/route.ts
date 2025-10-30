/**
 * Membership Purchase API
 * POST /api/purchase/membership - Subscribe to a membership tier
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/monitoring/logger'
import { StripePurchaseService, type MembershipTier } from '@/lib/stripe/purchase-service'

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
    const { tier, trialDays, promoCode } = body

    if (!tier) {
      return NextResponse.json(
        { error: 'Membership tier is required' },
        { status: 400 }
      )
    }

    // Validate tier
    const validTiers: MembershipTier[] = ['BASIC', 'PROFESSIONAL', 'PREMIUM']
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid membership tier' },
        { status: 400 }
      )
    }

    // Purchase membership
    const purchaseService = StripePurchaseService.getInstance()
    const result = await purchaseService.purchaseMembership({
      userId: user.id,
      tier,
      userEmail: user.email!,
      trialDays,
      promoCode,
      metadata: {
        user_email: user.email!
      }
    })

    if (!result.success) {
      logger.warn('Membership purchase failed', {
        userId: user.id,
        tier,
        error: result.error
      })

      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    logger.info('Membership purchase successful', {
      userId: user.id,
      tier,
      amount: result.data!.amount
    })

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error: any) {
    logger.error('Membership purchase API error', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
