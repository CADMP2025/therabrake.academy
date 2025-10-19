// app/api/webhooks/enrollment-created/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enrollment_id } = body

    if (!enrollment_id) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch enrollment with user and course data
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        user:profiles!enrollments_user_id_fkey (
          id,
          email,
          full_name
        ),
        course:courses!enrollments_course_id_fkey (
          id,
          title,
          description,
          instructor_id
        )
      `)
      .eq('id', enrollment_id)
      .single()

    if (error || !enrollment) {
      console.error('Enrollment fetch error:', error)
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    if (!enrollment.user || !enrollment.course) {
      return NextResponse.json(
        { error: 'Invalid enrollment data' },
        { status: 400 }
      )
    }

    // TODO: Send enrollment confirmation email
    // Once email service is fully implemented, uncomment:
    // const courseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/courses/${enrollment.course_id}`
    // await emailService.sendEnrollmentConfirmation(
    //   enrollment.user.email,
    //   enrollment.user.full_name,
    //   enrollment.course.title,
    //   courseUrl
    // )

    console.log('Enrollment created:', {
      user: enrollment.user.email,
      course: enrollment.course.title,
      enrollment_id
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Enrollment webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
