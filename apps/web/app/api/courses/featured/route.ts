import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Force dynamic rendering - this prevents static optimization errors
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable caching for real-time data

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Use database function for featured courses
    const { data: courses, error } = await supabase
      .rpc('get_featured_courses', { limit_count: limit })

    if (error) throw error

    return NextResponse.json({ 
      data: courses || [],
      success: true 
    })

  } catch (error: any) {
    console.error('Featured courses API error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch featured courses',
        success: false 
      },
      { status: 500 }
    )
  }
}
