/**
 * Enrollment Extend API
 * POST /api/enrollment/extend - Extend an enrollment with a payment
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { EnrollmentService } from '@/lib/services/enrollment-service'
import { logger } from '@/lib/monitoring/logger'

interface ExtendEnrollmentRequest {
  enrollmentId: string
  extensionDays: number
  paymentIntentId?: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verify user authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body: ExtendEnrollmentRequest = await request.json()

    // Validate request
    if (!body.enrollmentId || !body.extensionDays) {
      return NextResponse.json(
        { error: 'Missing required fields: enrollmentId, extensionDays' },
        { status: 400 }
      )
    }

    if (body.extensionDays < 1 || body.extensionDays > 365) {
      return NextResponse.json(
        { error: 'Extension days must be between 1 and 365' },
        { status: 400 }
      )
    }

    // Verify enrollment belongs to user
    const { data: enrollment, error: fetchError } = await supabase
      .from('enrollments')
      .select('user_id, course_id')
      .eq('id', body.enrollmentId)
      .single()

    if (fetchError || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    if (enrollment.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - enrollment does not belong to user' },
        { status: 403 }
      )
    }

    const enrollmentService = EnrollmentService.getInstance()

    // Extend the enrollment
    const result = await enrollmentService.extendEnrollment({
      enrollmentId: body.enrollmentId,
      extensionDays: body.extensionDays,
      paymentIntentId: body.paymentIntentId
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to extend enrollment' },
        { status: 500 }
      )
    }

    logger.info('Enrollment extended', { 
      userId, 
      enrollmentId: body.enrollmentId,
      extensionDays: body.extensionDays 
    })

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error) {
    logger.error('Failed to extend enrollment', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
