/**
 * Enrollment Status API
 * GET /api/enrollment/status - Get user's enrollment status for a course or all enrollments
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { EnrollmentService } from '@/lib/services/enrollment-service'
import { logger } from '@/lib/monitoring/logger'

export async function GET(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams
    const courseId = searchParams.get('courseId')

    const enrollmentService = EnrollmentService.getInstance()

    // Get enrollment status
    const result = await enrollmentService.getEnrollmentStatus(userId, courseId || undefined)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch enrollment status' },
        { status: 500 }
      )
    }

    logger.info('Enrollment status retrieved', { userId, courseId })

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error) {
    logger.error('Failed to get enrollment status', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
