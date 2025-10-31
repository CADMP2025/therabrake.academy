/**
 * Enrollment History API
 * GET /api/enrollment/history - Get user's enrollment history
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
    const includeExpired = searchParams.get('includeExpired') === 'true'

    const enrollmentService = EnrollmentService.getInstance()

    // Get active enrollments
    const activeResult = await enrollmentService.getActiveEnrollments(userId)

    if (!activeResult.success) {
      return NextResponse.json(
        { error: activeResult.error || 'Failed to fetch enrollment history' },
        { status: 500 }
      )
    }

    let allEnrollments = activeResult.data || []

    // Optionally include expired/revoked enrollments
    if (includeExpired) {
      const { data: expiredEnrollments, error: expiredError } = await supabase
        .from('enrollments')
        .select(`
          id,
          user_id,
          course_id,
          status,
          enrolled_at,
          expires_at,
          grace_period_ends_at,
          revoked_at,
          program_type,
          membership_tier,
          courses (
            id,
            title
          )
        `)
        .eq('user_id', userId)
        .in('status', ['expired', 'revoked'])
        .order('enrolled_at', { ascending: false })

      if (!expiredError && expiredEnrollments) {
        allEnrollments = [...allEnrollments, ...expiredEnrollments]
      }
    }

    logger.info('Enrollment history retrieved', { 
      userId, 
      count: allEnrollments.length,
      includeExpired 
    })

    return NextResponse.json({
      success: true,
      data: {
        enrollments: allEnrollments,
        total: allEnrollments.length
      }
    })

  } catch (error) {
    logger.error('Failed to get enrollment history', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
