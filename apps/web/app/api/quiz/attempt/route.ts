import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quizId, courseId } = body;

    if (!quizId || !courseId) {
      return NextResponse.json({ error: 'Quiz ID and Course ID are required' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check existing attempts
    const { data: existingAttempts } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    // Get quiz details for max attempts check
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('max_attempts')
      .eq('id', quizId)
      .single();

    const maxAttempts = quiz?.max_attempts || 3;

    if (existingAttempts && existingAttempts.length >= maxAttempts) {
      const lastAttempt = existingAttempts[0];
      if (lastAttempt.completed_at) {
        const lastAttemptTime = new Date(lastAttempt.completed_at).getTime();
        const now = Date.now();
        const hoursSinceLastAttempt = (now - lastAttemptTime) / (1000 * 60 * 60);

        if (hoursSinceLastAttempt < 24) {
          return NextResponse.json(
            { error: 'Please wait 24 hours before retaking this quiz' },
            { status: 429 }
          );
        }
      }
    }

    // Create new attempt
    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .insert([
        {
          quiz_id: quizId,
          user_id: session.user.id,
          course_id: courseId,
          started_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ attempt });
  } catch (error) {
    console.error('Error creating quiz attempt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
