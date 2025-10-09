import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email/email-service';
import { searchService } from '@/lib/search/search-service';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Verify webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret');
    if (webhookSecret !== process.env.WEBHOOK_SECRET_ENROLLMENT) {
      console.error('Webhook authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const enrollmentId = payload.record.id;

    // Fetch full enrollment data with related user and course
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .select(`
        id,
        user_id,
        course_id,
        enrolled_at,
        user:users(email, full_name),
        course:courses(
          title,
          description,
          thumbnail_url,
          ce_hours,
          instructor_id,
          instructor:users!courses_instructor_id_fkey(email, full_name)
        )
      `)
      .eq('id', enrollmentId)
      .single();

    if (error) {
      console.error('Failed to fetch enrollment data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch enrollment', details: error.message },
        { status: 500 }
      );
    }

    if (!enrollment || !enrollment.user || !enrollment.course) {
      console.error('Incomplete enrollment data');
      return NextResponse.json(
        { error: 'Incomplete enrollment data' },
        { status: 400 }
      );
    }

    // Send enrollment confirmation email to student
    try {
      const courseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/courses/${enrollment.course_id}`;
      
      await emailService.sendEmail({
        to: enrollment.user.email,
        subject: `Enrollment Confirmed: ${enrollment.course.title}`,
        template: 'enrollment-confirmation',
        data: {
          studentName: enrollment.user.full_name,
          courseTitle: enrollment.course.title,
          courseDescription: enrollment.course.description,
          courseThumbnail: enrollment.course.thumbnail_url,
          ceHours: enrollment.course.ce_hours,
          courseUrl,
          enrolledDate: new Date(enrollment.enrolled_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }
      });

      console.log(`Enrollment confirmation sent to ${enrollment.user.email}`);
    } catch (emailError) {
      console.error('Failed to send enrollment confirmation:', emailError);
      // Don't fail the webhook if email fails
    }

    // Send notification email to instructor
    try {
      if (enrollment.course.instructor?.email) {
        await emailService.sendEmail({
          to: enrollment.course.instructor.email,
          subject: `New Enrollment: ${enrollment.course.title}`,
          template: 'instructor-new-enrollment',
          data: {
            instructorName: enrollment.course.instructor.full_name,
            studentName: enrollment.user.full_name,
            courseTitle: enrollment.course.title,
            enrolledDate: new Date(enrollment.enrolled_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/instructor/dashboard`
          }
        });

        console.log(`Instructor notification sent to ${enrollment.course.instructor.email}`);
      }
    } catch (emailError) {
      console.error('Failed to send instructor notification:', emailError);
      // Don't fail the webhook if email fails
    }

    // Update course enrollment count in Meilisearch
    try {
      // Get current enrollment count
      const { count } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', enrollment.course_id);

      // Update the course document in Meilisearch
      await searchService.updateDocument('courses', enrollment.course_id, {
        enrollment_count: count || 0,
        last_enrolled_at: enrollment.enrolled_at
      });

      console.log(`Updated course ${enrollment.course_id} enrollment count to ${count}`);
    } catch (searchError) {
      console.error('Failed to update Meilisearch:', searchError);
      // Don't fail the webhook if search update fails
    }

    return NextResponse.json({
      success: true,
      enrollmentId,
      message: 'Enrollment processed successfully'
    });

  } catch (error) {
    console.error('Enrollment webhook error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
