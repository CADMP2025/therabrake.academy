'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import QuizPlayer from '@/components/quiz/QuizPlayer';
import QuizResults from '@/components/quiz/QuizResults';

export default function QuizPage({ params }: { params: { id: string } }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadQuizData();
  }, [params.id]);

  const loadQuizData = async () => {
    const { data } = await supabase
      .from('quizzes')
      .select('*, courses(id)')
      .eq('id', params.id)
      .single();

    if (data) {
      setQuizData(data);
    }
  };

  const handleQuizComplete = async (score: number, passed: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('id')
      .eq('quiz_id', params.id)
      .eq('user_id', user.id);

    const { count } = await supabase
      .from('quiz_questions')
      .select('*', { count: 'exact', head: true })
      .eq('quiz_id', params.id);

    const correctAnswers = Math.round((score / 100) * (count || 0));

    setResults({
      score,
      passed,
      passingScore: quizData?.passing_score || 70,
      totalQuestions: count || 0,
      correctAnswers,
      courseId: quizData?.courses?.id,
      canRetake: (attempts?.length || 0) < (quizData?.max_attempts || 3),
      attemptsUsed: (attempts?.length || 0) + 1,
      maxAttempts: quizData?.max_attempts || 3
    });

    setIsCompleted(true);

    if (passed) {
      await supabase.rpc('update_course_progress', {
        p_user_id: user.id,
        p_course_id: quizData?.courses?.id
      });
    }
  };

  if (!quizData) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {!isCompleted ? (
        <QuizPlayer
          quizId={params.id}
          courseId={quizData.courses.id}
          onComplete={handleQuizComplete}
        />
      ) : (
        <QuizResults {...results} />
      )}
    </div>
  );
}
