import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface QuizAnswer {
  question_id: string;
  user_answer: number;
  is_correct: boolean;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attemptId, quizId, courseId, answers, score, passed } = body;

    if (!attemptId || !quizId || !courseId || !answers || score === undefined || passed === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update the attempt with results
    const { data: attempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .update({
        answers: answers,
        score: score,
        passed: passed,
        completed_at: new Date().toISOString(),
      })
      .eq('id', attemptId)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (attemptError) throw attemptError;

    // If quiz is passed, update course progress
    if (passed) {
      const { data: quiz } = await supabase
        .from('quizzes')
        .select('lesson_id')
        .eq('id', quizId)
        .single();

      if (quiz?.lesson_id) {
        // Mark lesson as completed
        await supabase
          .from('lesson_progress')
          .upsert({
            user_id: session.user.id,
            course_id: courseId,
            lesson_id: quiz.lesson_id,
            completed: true,
            completed_at: new Date().toISOString(),
          });

        // Check if all lessons are completed and update course progress
        const { data: lessons } = await supabase
          .from('lessons')
          .select('id')
          .eq('course_id', courseId);

        const { data: completedLessons } = await supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', session.user.id)
          .eq('course_id', courseId)
          .eq('completed', true);

        if (lessons && completedLessons && lessons.length === completedLessons.length) {
          await supabase
            .from('course_progress')
            .upsert({
              user_id: session.user.id,
              course_id: courseId,
              completed: true,
              completed_at: new Date().toISOString(),
              progress_percentage: 100,
            });
        }
      }
    }

    // Send notification email
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email/quiz-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          quizId,
          attemptId,
          score,
          passed,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send quiz result email:', emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({ attempt });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
