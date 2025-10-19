'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEnrollmentIntent } from '@/hooks/useEnrollmentIntent'
import { CheckCircle, Clock, Award, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function EnrollmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { intent, clearIntent } = useEnrollmentIntent()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [courseData, setCourseData] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const courseId = searchParams.get('course') || intent?.courseId

  useEffect(() => {
    initializeEnrollment()
  }, [courseId])

  const initializeEnrollment = async () => {
    if (!courseId) {
      setError('No course selected')
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        router.push(`/auth/login?redirect=enrollment&course=${courseId}`)
        return
      }

      setUser(authUser)

      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id, status')
        .eq('user_id', authUser.id)
        .eq('course_id', courseId)
        .eq('status', 'active')
        .single()

      if (existingEnrollment) {
        router.push(`/learn/${courseId}`)
        return
      }

      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()

      if (courseError || !course) {
        setError('Course not found')
        setIsLoading(false)
        return
      }

      setCourseData(course)
    } catch (err: any) {
      console.error('Enrollment initialization error:', err)
      setError(err.message || 'Failed to load enrollment details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnrollment = async () => {
    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          userId: user.id,
          successUrl: `https://therabrake.academy/enrollment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `https://therabrake.academy/courses/${courseId}`
        })
      })

      const { url, error: stripeError } = await response.json()

      if (stripeError) {
        throw new Error(stripeError)
      }

      clearIntent()

      if (url) {
        window.location.href = url
      }
    } catch (err: any) {
      console.error('Enrollment error:', err)
      setError(err.message || 'Failed to process enrollment')
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading enrollment details...</p>
        </div>
      </div>
    )
  }

  if (error && !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/courses/professional"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enroll in Course</h1>
          <p className="text-gray-600">Review your enrollment details and complete payment</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{courseData?.title}</h2>
              <p className="text-gray-600">{courseData?.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <Clock className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-sm text-gray-600">CE Hours</p>
              <p className="text-xl font-bold text-gray-900">{courseData?.ce_hours}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <Award className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-sm text-gray-600">Texas LPC Approved</p>
              <p className="text-xl font-bold text-gray-900">Yes</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <CheckCircle className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-sm text-gray-600">Certificate</p>
              <p className="text-xl font-bold text-gray-900">Included</p>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What's Included:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Lifetime access to course materials</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Interactive quizzes and assessments</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Downloadable resources and materials</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Texas LPC Board-approved CE certificate</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Access on all devices (web & mobile)</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Course Price:</span>
              <span className="text-2xl font-bold text-gray-900">${courseData?.price}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Per CE Hour:</span>
              <span>${(courseData?.price / courseData?.ce_hours).toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 mr-3 w-4 h-4"
              />
              <span className="text-sm text-gray-700">
                I agree to TheraBrake's{' '}
                <Link href="/terms" className="text-primary hover:underline" target="_blank">
                  Terms of Service
                </Link>
                , understand CE requirements (70% quiz pass rate), and agree to maintain
                CE records per Texas LPC Board requirements.
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleEnrollment}
              disabled={!agreeToTerms || isProcessing}
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Processing...
                </>
              ) : (
                <>Complete Enrollment - ${courseData?.price}</>
              )}
            </button>
            <Link
              href={`/courses/${courseId}`}
              className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>🔒 Secure payment processing powered by Stripe</p>
          <p className="mt-1">Your payment information is encrypted and secure</p>
        </div>
      </div>
    </div>
  )
}
