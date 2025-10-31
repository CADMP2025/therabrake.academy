'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'

interface CourseEnrollButtonProps {
  courseId: string
  price: number
}

export default function CourseEnrollButton({ courseId, price }: CourseEnrollButtonProps) {
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const checkAuthAndEnrollment = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

      setIsEnrolled(!!data)
    } catch (error) {
      console.error('Error checking enrollment:', error)
    } finally {
      setLoading(false)
    }
  }, [courseId, supabase])

  useEffect(() => {
    checkAuthAndEnrollment()
  }, [checkAuthAndEnrollment])

  const handleEnroll = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (price > 0) {
      router.push(`/checkout?course=${courseId}`)
    } else {
      try {
        await supabase.from('enrollments').insert({
          user_id: user.id,
          course_id: courseId,
          status: 'active'
        })
        setIsEnrolled(true)
        router.push(`/courses/${courseId}/learn`)
      } catch (error) {
        console.error('Error enrolling:', error)
      }
    }
  }

  if (loading) return <Button disabled>Loading...</Button>

  if (isEnrolled) {
    return (
      <Button onClick={() => router.push(`/courses/${courseId}/learn`)}>
        Continue Learning
      </Button>
    )
  }

  return (
    <Button onClick={handleEnroll}>
      {price > 0 ? `Enroll - $${price}` : 'Enroll Free'}
    </Button>
  )
}
