import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { lessonId, percentage } = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      progress_percentage: percentage,
      completed: percentage >= 90,
      last_position: 0,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,lesson_id'
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get all lessons in course
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, modules!inner(course_id)')
    .eq('modules.course_id', courseId);

  if (!lessons) {
    return NextResponse.json({ progress: [] });
  }

  const lessonIds = lessons.map(l => l.id);

  // Get progress for all lessons
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', user.id)
    .in('lesson_id', lessonIds);

  // Calculate overall progress
  const totalLessons = lessons.length;
  const completedLessons = progress?.filter(p => p.completed).length || 0;
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return NextResponse.json({ 
    progress: progress || [],
    overall: overallProgress,
    completed: completedLessons,
    total: totalLessons
  });
}
