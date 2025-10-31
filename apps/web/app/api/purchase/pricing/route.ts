/**
 * Pricing API
 * GET /api/purchase/pricing - Get pricing information for all products
 */

import { NextResponse } from 'next/server'
import { logger } from '@/lib/monitoring/logger'
import { StripePurchaseService } from '@/lib/stripe/purchase-service'

export async function GET() {
  try {
    const purchaseService = StripePurchaseService.getInstance()
    const pricing = purchaseService.getPricing()

    return NextResponse.json({
      success: true,
      data: pricing
    })

  } catch (error: any) {
    logger.error('Pricing API error', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
