'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock } from 'lucide-react';

interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correct_answer: string | string[];
  points: number;
  order_index: number;
}

interface QuizPlayerProps {
  quizId: string;
  courseId: string;
  onComplete: (score: number, passed: boolean) => void;
}

export default function QuizPlayer({ quizId, courseId, onComplete }: QuizPlayerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizMetadata, setQuizMetadata] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const loadQuiz = async () => {
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (quiz) {
      setQuizMetadata(quiz);
      if (quiz.time_limit) {
        setTimeRemaining(quiz.time_limit * 60);
      }
    }

    const { data } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index', { ascending: true });

    if (data) {
      const shuffled = quiz?.randomize_questions 
        ? data.sort(() => Math.random() - 0.5)
        : data;
      setQuestions(shuffled);
    }
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Grade the quiz
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach(q => {
      totalPoints += q.points;
      const userAnswer = answers[q.id];
      
      if (q.question_type === 'multiple_choice' || q.question_type === 'true_false') {
        if (userAnswer === q.correct_answer) {
          earnedPoints += q.points;
        }
      } else if (q.question_type === 'short_answer') {
        if (userAnswer?.toLowerCase().trim() === (q.correct_answer as string).toLowerCase().trim()) {
          earnedPoints += q.points;
        }
      }
    });

    const score = (earnedPoints / totalPoints) * 100;
    const passed = score >= (quizMetadata?.passing_score || 70);

    // Save attempt
    await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: quizId,
        user_id: user.id,
        score,
        passed,
        answers,
        time_taken: quizMetadata?.time_limit 
          ? (quizMetadata.time_limit * 60) - (timeRemaining || 0)
          : null
      });

    onComplete(score, passed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="w-5 h-5" />
                <span className={timeRemaining < 300 ? 'text-red-500' : ''}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mb-8">
          <h3 className="text-xl mb-6">{currentQuestion.question_text}</h3>

          {currentQuestion.question_type === 'multiple_choice' && (
            <RadioGroup
              value={answers[currentQuestion.id]}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.question_type === 'true_false' && (
            <RadioGroup
              value={answers[currentQuestion.id]}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            >
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="True" id="true" />
                <Label htmlFor="true" className="cursor-pointer">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="False" id="false" />
                <Label htmlFor="false" className="cursor-pointer">False</Label>
              </div>
            </RadioGroup>
          )}

          {currentQuestion.question_type === 'short_answer' && (
            <Textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[120px]"
            />
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              disabled={!answers[currentQuestion.id]}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(answers).length < questions.length}
              className="bg-[#3B82F6]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
        </div>

        <div className="mt-6 flex gap-2 flex-wrap">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                answers[q.id]
                  ? 'bg-[#10B981] text-white border-[#10B981]'
                  : 'border-gray-300 hover:border-[#3B82F6]'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
