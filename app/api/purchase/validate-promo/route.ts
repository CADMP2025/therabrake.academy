/**
 * Promotional Code Validation API
 * POST /api/purchase/validate-promo - Validate a promotional code
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/monitoring/logger'
import { StripePurchaseService } from '@/lib/stripe/purchase-service'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user (optional for promo validation)
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const { code, amount, type } = body

    if (!code || !amount || !type) {
      return NextResponse.json(
        { error: 'Code, amount, and type are required' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['course', 'membership', 'program']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid purchase type' },
        { status: 400 }
      )
    }

    // Validate promotional code
    const purchaseService = StripePurchaseService.getInstance()
    const validation = await purchaseService.validatePromoCode(
      code,
      amount,
      type
    )

    if (!validation.valid) {
      logger.info('Promo code validation failed', {
        code,
        reason: validation.reason,
        userId: user?.id
      })

      return NextResponse.json({
        valid: false,
        reason: validation.reason
      })
    }

    logger.info('Promo code validated', {
      code,
      discountAmount: validation.discountAmount,
      userId: user?.id
    })

    return NextResponse.json({
      valid: true,
      discountAmount: validation.discountAmount,
      discountPercent: validation.discountPercent,
      code: validation.code
    })

  } catch (error: any) {
    logger.error('Promo validation API error', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
