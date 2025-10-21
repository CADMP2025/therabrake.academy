'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import QuizPlayer from '@/components/quiz/QuizPlayer'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  const loadQuizData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setQuiz(data)
    } catch (error) {
      console.error('Error loading quiz:', error)
      router.push('/404')
    } finally {
      setLoading(false)
    }
  }, [params.id, supabase, router])

  useEffect(() => {
    loadQuizData()
  }, [loadQuizData])

  if (loading) return <div>Loading quiz...</div>
  if (!quiz) return null

  return <QuizPlayer quiz={quiz} />
}
