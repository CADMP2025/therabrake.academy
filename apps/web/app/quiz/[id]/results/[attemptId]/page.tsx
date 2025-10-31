import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import QuizResults from '@/components/quiz/QuizResults';

interface PageProps {
  params: {
    id: string;
    attemptId: string;
  };
}

export default async function QuizResultsPage({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // Verify the attempt belongs to the user
  const { data: attempt } = await supabase
    .from('quiz_attempts')
    .select('*, quiz:quizzes(lesson_id, lessons(course_id))')
    .eq('id', params.attemptId)
    .eq('user_id', session.user.id)
    .single();

  if (!attempt) {
    redirect('/dashboard');
  }

  const courseId = attempt.quiz?.lessons?.course_id || '';

  return (
    <div className="container mx-auto py-8">
      <QuizResults
        attemptId={params.attemptId}
        quizId={params.id}
        courseId={courseId}
      />
    </div>
  );
}
