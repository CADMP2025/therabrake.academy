'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface QuizPlayerProps {
  quiz: any
  onComplete?: (score: number) => void
}

export default function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(quiz.time_limit_minutes * 60)
  const supabase = createClientComponentClient()

  const handleSubmit = useCallback(async () => {
    let correctAnswers = 0
    quiz.questions.forEach((q: any, index: number) => {
      if (answers[index] === q.correct_answer) {
        correctAnswers++
      }
    })

    const finalScore = (correctAnswers / quiz.questions.length) * 100

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('quiz_attempts').insert({
        quiz_id: quiz.id,
        user_id: user.id,
        score: finalScore,
        answers: answers,
        completed_at: new Date().toISOString()
      })
    }

    setScore(finalScore)
    setShowResults(true)
    onComplete?.(finalScore)

    // If passed, mark enrollment complete and trigger certificate generation
    try {
      if (finalScore >= (quiz.passing_score ?? 70)) {
        if (!user) {
          const res = await supabase.auth.getUser()
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const currentUser = res.data.user
        }
        const { data: { user: u } } = await supabase.auth.getUser()
        if (u) {
          // Find enrollment for this course
          const { data: enr } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', u.id)
            .eq('course_id', quiz.course_id)
            .maybeSingle()
          if (enr?.id) {
            await supabase
              .from('enrollments')
              .update({ status: 'completed', progress: 100, completed_at: new Date().toISOString() })
              .eq('id', enr.id)
            // Fire-and-forget certificate generation
            fetch('/api/certificates/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ enrollmentId: enr.id }),
            }).catch(() => {})
          }
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Post-quiz completion handling failed', e)
    }
  }, [quiz, answers, supabase, onComplete])

  useEffect(() => {
    if (timeLeft <= 0 && !showResults) {
      handleSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, showResults, handleSubmit])

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer })
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (showResults) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl mb-4">Your Score: {score.toFixed(1)}%</p>
        <p className="text-gray-600">
          {score >= quiz.passing_score ? 'Congratulations! You passed!' : 'Keep studying and try again.'}
        </p>
      </Card>
    )
  }

  const question = quiz.questions[currentQuestion]

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">{quiz.title}</h2>
        <div className="text-lg">
          Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="mb-4">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">{question.question_text}</h3>

        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                answers[currentQuestion] === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          variant="outline"
        >
          Previous
        </Button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <Button onClick={handleSubmit}>Submit Quiz</Button>
        ) : (
          <Button onClick={nextQuestion}>Next</Button>
        )}
      </div>
    </div>
  )
}
