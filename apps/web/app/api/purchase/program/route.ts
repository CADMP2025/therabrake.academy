/**
 * Program Purchase API
 * POST /api/purchase/program - Purchase a special program (So What Mindset or Leap & Launch)
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/monitoring/logger'
import { StripePurchaseService, type ProgramType } from '@/lib/stripe/purchase-service'

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
    const { program, promoCode, installments } = body

    if (!program) {
      return NextResponse.json(
        { error: 'Program type is required' },
        { status: 400 }
      )
    }

    // Validate program type
    const validPrograms: ProgramType[] = ['SO_WHAT_MINDSET', 'LEAP_AND_LAUNCH']
    if (!validPrograms.includes(program)) {
      return NextResponse.json(
        { error: 'Invalid program type' },
        { status: 400 }
      )
    }

    // Validate installments if provided
    if (installments && (installments < 2 || installments > 3)) {
      return NextResponse.json(
        { error: 'Installments must be 2 or 3' },
        { status: 400 }
      )
    }

    // Purchase program
    const purchaseService = StripePurchaseService.getInstance()
    const result = await purchaseService.purchaseProgram({
      userId: user.id,
      program,
      userEmail: user.email!,
      promoCode,
      installments,
      metadata: {
        user_email: user.email!
      }
    })

    if (!result.success) {
      logger.warn('Program purchase failed', {
        userId: user.id,
        program,
        error: result.error
      })

      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    logger.info('Program purchase successful', {
      userId: user.id,
      program,
      amount: result.data!.amount,
      installments: installments || 1
    })

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error: any) {
    logger.error('Program purchase API error', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
