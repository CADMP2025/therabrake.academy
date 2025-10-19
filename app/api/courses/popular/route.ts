import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Force dynamic rendering - this prevents static optimization errors
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable caching for real-time data

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Fetch popular courses (most enrollments)
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:profiles!courses_instructor_id_fkey(full_name, avatar_url),
        modules(id),
        enrollments(id)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Sort by enrollment count and limit to top 6
    const sortedCourses = courses
      ?.map(course => ({
        ...course,
        enrollment_count: course.enrollments?.length || 0,
        module_count: course.modules?.length || 0
      }))
      .sort((a, b) => b.enrollment_count - a.enrollment_count)
      .slice(0, 6)

    return NextResponse.json({ 
      data: sortedCourses || [],
      success: true 
    })

  } catch (error: any) {
    console.error('Popular courses API error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch popular courses',
        success: false 
      },
      { status: 500 }
    )
  }
}
