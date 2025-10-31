import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all user's enrollments
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses:course_id (
          id,
          title,
          duration_minutes
        )
      `)
      .eq('user_id', user.id)
      .in('status', ['active', 'completed']);

    if (enrollmentsError) throw enrollmentsError;

    // Get progress for each course
    const coursesProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const courseId = enrollment.course_id;

        // Use the progress summary function
        const { data: progressData, error: progressError } = await supabase
          .rpc('get_course_progress_summary', {
            p_user_id: user.id,
            p_course_id: courseId,
          });

        if (progressError) {
          console.error('Progress summary error:', progressError);
          return null;
        }

        const progress = progressData[0];

        // Calculate estimated completion
        let estimatedCompletion = null;
        if (progress.completed_lessons > 0 && progress.completed_lessons < progress.total_lessons) {
          const daysElapsed = Math.max(
            1,
            Math.floor(
              (Date.now() - new Date(enrollment.enrolled_at).getTime()) / (1000 * 60 * 60 * 24)
            )
          );
          const lessonsPerDay = progress.completed_lessons / daysElapsed;
          const remainingLessons = progress.total_lessons - progress.completed_lessons;
          const estimatedDays = Math.ceil(remainingLessons / lessonsPerDay);
          const estimatedDate = new Date();
          estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);
          estimatedCompletion = estimatedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        }

        return {
          courseId: courseId,
          courseTitle: enrollment.courses.title,
          totalLessons: progress.total_lessons,
          completedLessons: progress.completed_lessons,
          inProgressLessons: progress.in_progress_lessons,
          totalTimeSpent: progress.total_time_spent || 0,
          avgProgressPercentage: Math.round(progress.avg_progress_percentage || 0),
          lastAccessed: enrollment.last_accessed_at || enrollment.enrolled_at,
          estimatedCompletion,
        };
      })
    );

    const validProgress = coursesProgress.filter((p) => p !== null);

    // Calculate aggregate stats
    const totalTimeSpent = validProgress.reduce((sum, p) => sum + p.totalTimeSpent, 0);
    const totalCEHours = Math.round((totalTimeSpent / 3600) * 10) / 10;
    const activeCourses = enrollments.filter((e) => e.status === 'active').length;
    const completedCourses = enrollments.filter((e) => e.status === 'completed').length;

    // Get streak data
    const { data: streakData, error: streakError } = await supabase
      .from('learning_streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', user.id)
      .maybeSingle();

    if (streakError && streakError.code !== 'PGRST116') {
      console.error('Streak data error:', streakError);
    }

    const stats = {
      totalCourses: enrollments.length,
      activeCourses,
      completedCourses,
      totalTimeSpent,
      totalCEHours,
      currentStreak: streakData?.current_streak || 0,
      longestStreak: streakData?.longest_streak || 0,
      coursesProgress: validProgress.sort((a, b) => {
        // Sort by last accessed, most recent first
        return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
      }),
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Progress dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to load progress dashboard' },
      { status: 500 }
    );
  }
}
