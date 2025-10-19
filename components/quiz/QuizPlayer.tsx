'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
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

interface Quiz {
  id: string;
  title: string;
  description: string;
  passing_score: number;
  time_limit?: number;
  questions: Question[];
}

export interface QuizPlayerProps {
  quiz: Quiz;
}

export default function QuizPlayer({ quiz }: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quiz.time_limit ? quiz.time_limit * 60 : null
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const supabase = createClient();

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correct_answer) {
        correctAnswers++;
      }
    });

    const calculatedScore = (correctAnswers / quiz.questions.length) * 100;
    setScore(calculatedScore);
    setIsSubmitted(true);

    // Save quiz attempt to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('quiz_attempts').insert({
          quiz_id: quiz.id,
          user_id: user.id,
          score: calculatedScore,
          passed: calculatedScore >= quiz.passing_score,
          answers: answers,
        });
      }
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
  };

  if (isSubmitted && score !== null) {
    const passed = score >= quiz.passing_score;
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {passed ? '🎉 Congratulations!' : '📚 Keep Learning'}
          </h2>
          <p className="text-6xl font-bold mb-4 text-primary">{score.toFixed(0)}%</p>
          <p className="text-lg mb-6">
            {passed
              ? `You passed! You need ${quiz.passing_score}% to pass.`
              : `You need ${quiz.passing_score}% to pass. Try again!`}
          </p>
          <div className="space-y-3">
            <p>Correct Answers: {Math.round((score / 100) * quiz.questions.length)} / {quiz.questions.length}</p>
            {!passed && (
              <Button onClick={() => window.location.reload()}>
                Retake Quiz
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          {timeRemaining !== null && (
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
        <Progress value={progress} />
        <p className="text-sm text-gray-600 mt-2">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </p>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.question_text}</h2>

        {currentQuestion.question_type === 'multiple_choice' && (
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          >
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}

        {currentQuestion.question_type === 'true_false' && (
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false">False</Label>
              </div>
            </div>
          </RadioGroup>
        )}

        {currentQuestion.question_type === 'short_answer' && (
          <Textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
          />
        )}
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button onClick={handleSubmit} variant="primary">
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext} variant="primary">
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
