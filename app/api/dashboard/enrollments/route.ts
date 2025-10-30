/**
 * Dashboard Enrollments API
 * GET /api/dashboard/enrollments - Get user's enrollments with status for dashboard display
 */

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
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

    // Use the database function to get enrollments with calculated status
    const { data: enrollments, error: enrollmentsError } = await supabase
      .rpc('get_user_enrollments_with_status', {
        user_id: userId
      })

    if (enrollmentsError) {
      logger.error('Failed to fetch enrollments', enrollmentsError as Error)
      return NextResponse.json(
        { error: 'Failed to fetch enrollments' },
        { status: 500 }
      )
    }

    // Categorize enrollments
    const activeEnrollments = enrollments?.filter((e: any) => 
      e.status === 'active' && !e.is_expired
    ) || []

    const expiringEnrollments = enrollments?.filter((e: any) => 
      e.status === 'active' && e.days_remaining !== null && e.days_remaining <= 7
    ) || []

    const inGracePeriodEnrollments = enrollments?.filter((e: any) => 
      e.is_in_grace_period
    ) || []

    const expiredEnrollments = enrollments?.filter((e: any) => 
      e.status === 'expired'
    ) || []

    // Get scheduled notifications
    const { data: notifications } = await supabase
      .from('scheduled_notifications')
      .select(`
        id,
        enrollment_id,
        notification_type,
        scheduled_for,
        status
      `)
      .in('enrollment_id', enrollments?.map((e: any) => e.id) || [])
      .eq('status', 'pending')
      .order('scheduled_for', { ascending: true })

    logger.info('Dashboard enrollments retrieved', { 
      userId,
      totalEnrollments: enrollments?.length || 0,
      activeCount: activeEnrollments.length,
      expiringCount: expiringEnrollments.length,
      gracePeriodCount: inGracePeriodEnrollments.length
    })

    return NextResponse.json({
      success: true,
      data: {
        enrollments: enrollments || [],
        summary: {
          total: enrollments?.length || 0,
          active: activeEnrollments.length,
          expiring: expiringEnrollments.length,
          inGracePeriod: inGracePeriodEnrollments.length,
          expired: expiredEnrollments.length
        },
        categorized: {
          active: activeEnrollments,
          expiring: expiringEnrollments,
          inGracePeriod: inGracePeriodEnrollments,
          expired: expiredEnrollments
        },
        upcomingNotifications: notifications || []
      }
    })

  } catch (error) {
    logger.error('Failed to get dashboard enrollments', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
