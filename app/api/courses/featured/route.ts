import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Force dynamic rendering - this prevents static optimization errors
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable caching for real-time data

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Fetch featured courses (marked as featured in database)
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:profiles!courses_instructor_id_fkey(full_name, avatar_url),
        modules(id),
        _count:enrollments(count)
      `)
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) throw error

    // Transform data to include enrollment count
    const transformedCourses = courses?.map(course => ({
      ...course,
      enrollment_count: course._count?.[0]?.count || 0,
      module_count: course.modules?.length || 0
    }))

    return NextResponse.json({ 
      data: transformedCourses || [],
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
