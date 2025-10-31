'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  Award,
  RefreshCcw,
  Home,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

interface QuizAnswer {
  question_id: string;
  user_answer: number;
  is_correct: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  question_type: 'multiple_choice' | 'true_false';
  answers: string[];
  correct_answer: number;
  explanation?: string;
  points: number;
}

interface QuizResultsProps {
  attemptId: string;
  quizId: string;
  courseId: string;
}

export default function QuizResults({ attemptId, quizId, courseId }: QuizResultsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [remainingAttempts, setRemainingAttempts] = useState(0);

  useEffect(() => {
    loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, quizId]);

  const loadResults = async () => {
    try {
      const [attemptRes, questionsRes, attemptsRes] = await Promise.all([
        fetch(`/api/quiz/attempts?quizId=${quizId}`),
        fetch(`/api/quiz/questions?quizId=${quizId}`),
        fetch(`/api/quiz/attempts?quizId=${quizId}`),
      ]);

      if (!attemptRes.ok || !questionsRes.ok || !attemptsRes.ok) {
        throw new Error('Failed to load quiz results');
      }

      const attemptData = await attemptRes.json();
      const questionsData = await questionsRes.json();
      const attemptsData = await attemptsRes.json();

      const currentAttempt = attemptData.attempts.find((a: any) => a.id === attemptId);
      if (!currentAttempt) {
        throw new Error('Attempt not found');
      }

      setAttempt(currentAttempt);
      setQuestions(questionsData.questions);

      // Calculate remaining attempts
      const totalAttempts = attemptsData.attempts.length;
      const maxAttempts = 3; // This should come from quiz settings
      setRemainingAttempts(Math.max(0, maxAttempts - totalAttempts));
    } catch (error) {
      console.error('Error loading quiz results:', error);
      toast.error('Failed to load quiz results');
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleRetake = () => {
    if (remainingAttempts > 0) {
      router.push(`/quiz/${quizId}`);
    } else {
      toast.error('No attempts remaining');
    }
  };

  const handleBackToCourse = () => {
    router.push(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading results...</p>
      </Card>
    );
  }

  if (!attempt) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">Quiz attempt not found</p>
        <Button onClick={handleBackToCourse} className="mt-4">Back to Course</Button>
      </Card>
    );
  }

  const score = attempt.score || 0;
  const passed = attempt.passed || false;
  const answers: QuizAnswer[] = attempt.answers || [];
  const correctCount = answers.filter((a) => a.is_correct).length;
  const incorrectCount = answers.length - correctCount;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-8 text-center">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
          passed ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {passed ? (
            <Award className="w-12 h-12 text-green-600" />
          ) : (
            <XCircle className="w-12 h-12 text-red-600" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {passed ? 'Congratulations!' : 'Keep Trying!'}
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          {passed 
            ? 'You have passed the quiz!' 
            : 'You did not pass this time, but you can retake it.'}
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">{score}%</div>
            <div className="text-sm text-gray-600">Final Score</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-1">{correctCount}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-1">{incorrectCount}</div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </div>
        </div>

        <Progress value={score} className="h-3 mb-2" />
        <p className="text-sm text-gray-600 mb-8">
          {passed ? 'You exceeded' : 'You needed'} 80% to pass
        </p>

        <div className="flex items-center justify-center space-x-4">
          <Button onClick={handleBackToCourse} variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
          
          {!passed && remainingAttempts > 0 && (
            <Button onClick={handleRetake}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Retake Quiz ({remainingAttempts} attempts left)
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Question Review</h2>
        <p className="text-sm text-gray-600 mb-6">
          Review your answers and see explanations for each question.
        </p>

        <div className="space-y-3">
          {questions.map((question, index) => {
            const answer = answers.find((a) => a.question_id === question.id);
            const isCorrect = answer?.is_correct || false;
            const userAnswer = answer?.user_answer ?? -1;
            const isExpanded = expandedQuestions.has(question.id);

            return (
              <div
                key={question.id}
                className={`border-2 rounded-lg transition-all ${
                  isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <button
                  onClick={() => toggleQuestion(question.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                      <p className="font-medium text-gray-900">{question.question}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="pl-9 space-y-2">
                      {question.answers.map((ans, ansIndex) => {
                        const isUserAnswer = userAnswer === ansIndex;
                        const isCorrectAnswer = question.correct_answer === ansIndex;

                        return (
                          <div
                            key={ansIndex}
                            className={`p-3 rounded-lg ${
                              isCorrectAnswer
                                ? 'bg-green-100 border-2 border-green-500'
                                : isUserAnswer
                                ? 'bg-red-100 border-2 border-red-500'
                                : 'bg-white border-2 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={isCorrectAnswer || isUserAnswer ? 'font-medium' : ''}>
                                {ans}
                              </span>
                              {isCorrectAnswer && (
                                <span className="text-xs font-medium text-green-700">Correct Answer</span>
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <span className="text-xs font-medium text-red-700">Your Answer</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {question.explanation && (
                      <div className="pl-9 mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                        <p className="text-sm text-blue-800">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
