'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import QuizPlayer from '@/components/quiz/QuizPlayer';

export default function QuizPage({ params }: { params: { id: string } }) {
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient(); // NO await for client components

  useEffect(() => {
    loadQuizData();
  }, [params.id]);

  async function loadQuizData() {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*, questions(*)')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setQuizData(data);
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
          <button 
            onClick={() => router.back()}
            className="text-primary hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <QuizPlayer quiz={quizData} />;
}
