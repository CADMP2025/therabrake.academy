/**
 * Check Access API
 * GET /api/enrollment/check-access - Check if user has access to a course
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

    if (!courseId) {
      return NextResponse.json(
        { error: 'Missing required parameter: courseId' },
        { status: 400 }
      )
    }

    const enrollmentService = EnrollmentService.getInstance()

    // Check if user has access
    const hasAccess = await enrollmentService.hasAccess(userId, courseId)

    logger.info('Access check completed', { 
      userId, 
      courseId,
      hasAccess 
    })

    return NextResponse.json({
      success: true,
      data: {
        hasAccess,
        userId,
        courseId
      }
    })

  } catch (error) {
    logger.error('Failed to check access', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
