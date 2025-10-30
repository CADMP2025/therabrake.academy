/**
 * Course Purchase API
 * POST /api/purchase/course - Purchase a single course
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
    const { courseId, promoCode } = body

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    // Purchase course
    const purchaseService = StripePurchaseService.getInstance()
    const result = await purchaseService.purchaseCourse({
      userId: user.id,
      courseId,
      userEmail: user.email!,
      promoCode,
      metadata: {
        user_email: user.email!
      }
    })

    if (!result.success) {
      logger.warn('Course purchase failed', {
        userId: user.id,
        courseId,
        error: result.error
      })

      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    logger.info('Course purchase successful', {
      userId: user.id,
      courseId,
      amount: result.data!.amount
    })

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error: any) {
    logger.error('Course purchase API error', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
