// components/courses/CourseEnrollButton.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEnrollmentIntent } from '@/hooks/useEnrollmentIntent'

interface CourseEnrollButtonProps {
  courseId: string
  courseTitle: string
  price: number
  hours: number
  className?: string
}

export default function CourseEnrollButton({
  courseId,
  courseTitle,
  price,
  hours,
  className = ''
}: CourseEnrollButtonProps) {
  const router = useRouter()
  const { storeIntent } = useEnrollmentIntent()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    checkAuthAndEnrollment()
  }, [courseId])

  const checkAuthAndEnrollment = async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setIsAuthenticated(false)
        setIsEnrolled(false)
        setIsLoading(false)
        return
      }

      setIsAuthenticated(true)

      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('status', 'active')
        .single()

      setIsEnrolled(!!enrollment)
    } catch (error) {
      console.error('Error checking enrollment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = () => {
    if (isLoading) return

    if (isEnrolled) {
      router.push(`/learn/${courseId}`)
      return
    }

    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    router.push(`/enrollment?course=${courseId}`)
  }

  const handleAuthChoice = (choice: 'login' | 'register') => {
    storeIntent(courseId, courseTitle, price, hours)
    
    if (choice === 'login') {
      router.push(`/auth/login?redirect=enrollment&course=${courseId}`)
    } else {
      router.push(`/auth/register?redirect=enrollment&course=${courseId}`)
    }
  }

  if (isLoading) {
    return (
      <button
        disabled
        className={`flex items-center justify-center bg-gray-300 text-gray-500 cursor-not-allowed ${className}`}
      >
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Checking...
      </button>
    )
  }

  if (isEnrolled) {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center justify-center bg-green-500 text-white hover:bg-green-600 transition ${className}`}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Continue Course
      </button>
    )
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center justify-center bg-primary text-white hover:bg-primary-dark transition font-medium ${className}`}
      >
        {!isAuthenticated && <Lock className="w-4 h-4 mr-2" />}
        Enroll Now
      </button>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Create Account to Enroll
            </h3>
            <p className="text-gray-600 mb-6">
              Sign up to enroll in <span className="font-semibold">{courseTitle}</span> and start earning CE credits.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">What you'll get:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Track your progress across all devices</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Earn Texas LPC-approved CE certificates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Access course materials anytime, anywhere</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{hours} CE hours for ${price.toFixed(2)}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleAuthChoice('register')}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition font-semibold"
              >
                Create Account
              </button>
              <button
                onClick={() => handleAuthChoice('login')}
                className="w-full bg-white text-primary border-2 border-primary py-3 rounded-lg hover:bg-blue-50 transition font-semibold"
              >
                Already Have an Account? Sign In
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full text-gray-600 py-2 hover:text-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
