'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface QuizResultsProps {
  score: number;
  passed: boolean;
  passingScore: number;
  totalQuestions: number;
  correctAnswers: number;
  courseId: string;
  canRetake: boolean;
  attemptsUsed: number;
  maxAttempts: number;
}

export default function QuizResults({
  score,
  passed,
  passingScore,
  totalQuestions,
  correctAnswers,
  courseId,
  canRetake,
  attemptsUsed,
  maxAttempts
}: QuizResultsProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-8 text-center">
        <div className="mb-6">
          {passed ? (
            <CheckCircle2 className="w-24 h-24 mx-auto text-[#10B981]" />
          ) : (
            <XCircle className="w-24 h-24 mx-auto text-red-500" />
          )}
        </div>

        <h1 className="text-4xl font-bold mb-2">
          {Math.round(score)}%
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {passed ? 'Congratulations! You Passed!' : 'Keep Trying!'}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Questions</p>
            <p className="text-2xl font-bold">{totalQuestions}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Correct</p>
            <p className="text-2xl font-bold text-[#10B981]">{correctAnswers}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Passing Score</p>
            <p className="text-2xl font-bold">{passingScore}%</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-600">
            Attempt {attemptsUsed} of {maxAttempts}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          {passed ? (
            <Link href={`/learn/${courseId}`}>
              <Button className="bg-[#3B82F6]">
                <Award className="w-4 h-4 mr-2" />
                Continue to Certificate
              </Button>
            </Link>
          ) : canRetake ? (
            <Button onClick={() => window.location.reload()} variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          ) : (
            <p className="text-red-500">
              Maximum attempts reached. Please contact your instructor.
            </p>
          )}
          
          <Link href={`/learn/${courseId}`}>
            <Button variant="outline">
              Back to Course
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
