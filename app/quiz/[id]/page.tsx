'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import QuizPlayer from '@/components/quiz/QuizPlayer';
import { Card } from '@/components/ui/card';

interface Quiz {
  id: string;
  title: string;
  passing_score: number;
  time_limit?: number;
  max_attempts?: number;
  lesson_id: string;
}

interface Lesson {
  course_id: string;
  course: {
    title: string;
  };
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  const loadQuizData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select(`
          *,
          lesson:lessons (
            course_id,
            course:courses (
              title
            )
          )
        `)
        .eq('id', params.id)
        .single();

      if (quizError) throw quizError;
      
      setQuiz(quizData);
      setLesson(quizData.lesson);
    } catch (error) {
      console.error('Error loading quiz:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [params.id, supabase, router]);

  useEffect(() => {
    loadQuizData();
  }, [loadQuizData]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </Card>
      </div>
    );
  }

  if (!quiz || !lesson) return null;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
        <p className="text-gray-600">{lesson.course.title}</p>
      </div>
      
      <QuizPlayer
        quizId={quiz.id}
        courseId={lesson.course_id}
        quizTitle={quiz.title}
        passingScore={quiz.passing_score || 80}
        timeLimit={quiz.time_limit || undefined}
        maxAttempts={quiz.max_attempts || 3}
      />
    </div>
  );
}
