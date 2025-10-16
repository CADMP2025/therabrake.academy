'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader2, Award, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function EnrollmentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [enrollmentData, setEnrollmentData] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId) {
      verifyEnrollment()
    } else {
      setError('Missing session information')
      setIsLoading(false)
    }
  }, [sessionId])

  const verifyEnrollment = async () => {
    const supabase = createClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            ce_hours,
            thumbnail_url
          )
        `)
        .eq('stripe_session_id', sessionId)
        .eq('user_id', user.id)
        .single()

      if (paymentError || !payment) {
        throw new Error('Enrollment not found')
      }

      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('payment_id', payment.id)
        .single()

      if (enrollmentError) {
        throw new Error('Enrollment verification failed')
      }

      setEnrollmentData({
        payment,
        enrollment,
        course: payment.courses
      })
    } catch (err: any) {
      console.error('Verification error:', err)
      setError(err.message || 'Failed to verify enrollment')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Verifying your enrollment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Enrollment Successful!</h1>
          <p className="text-xl text-gray-600">Welcome to {enrollmentData?.course?.title}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start gap-6 mb-6">
            {enrollmentData?.course?.thumbnail_url && (
              <img
                src={enrollmentData.course.thumbnail_url}
                alt={enrollmentData?.course?.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{enrollmentData?.course?.title}</h2>
              <p className="text-gray-600 mb-4">{enrollmentData?.course?.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center text-green-600">
                  <Award className="w-4 h-4 mr-1" />
                  <span>{enrollmentData?.course?.ce_hours} CE Hours</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>Texas LPC Approved</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Start Learning</p>
                  <p className="text-sm text-gray-600">Access your course materials and begin your first lesson</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Complete Quizzes</p>
                  <p className="text-sm text-gray-600">Pass quizzes with 70% or higher to earn CE credits</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Get Your Certificate</p>
                  <p className="text-sm text-gray-600">Download your Texas LPC Board-approved CE certificate upon completion</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              href={`/learn/${enrollmentData?.course?.id}`}
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition font-semibold flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Start Course
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-semibold text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800">
            �� A confirmation email with your receipt has been sent to your email address
          </p>
        </div>
      </div>
    </div>
  )
}
