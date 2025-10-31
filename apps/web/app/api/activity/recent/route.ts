import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: activity, error } = await supabase
      .from('daily_activity_log')
      .select('activity_date, lessons_accessed, time_spent, videos_watched, notes_created')
      .eq('user_id', user.id)
      .order('activity_date', { ascending: false })
      .limit(14)

    if (error) throw error

    return NextResponse.json({ success: true, activity })
  } catch (err) {
    console.error('Recent activity error:', err)
    return NextResponse.json({ error: 'Failed to load recent activity' }, { status: 500 })
  }
}
