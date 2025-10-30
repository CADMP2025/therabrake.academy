import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }
    
    // Use database function for recommended courses
    const { data: courses, error } = await supabase
      .rpc('get_recommended_courses', { 
        p_user_id: user.id,
        limit_count: limit 
      })

    if (error) throw error

    return NextResponse.json({ 
      data: courses || [],
      success: true 
    })

  } catch (error: any) {
    console.error('Recommended courses API error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch recommended courses',
        success: false 
      },
      { status: 500 }
    )
  }
}
