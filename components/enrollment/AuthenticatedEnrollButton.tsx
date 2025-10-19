'use client'

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect, useCallback } from 'react'
import { Loader2, Lock } from 'lucide-react'

interface EnrollButtonProps {
  courseId?: string
  programType?: 'LEAP_AND_LAUNCH' | 'SO_WHAT_MINDSET'
  productType: 'course' | 'premium' | 'membership'
  price: number
  planName?: string
  className?: string
  children: React.ReactNode
}

export default function AuthenticatedEnrollButton({
  courseId,
  programType,
  productType,
  price,
  planName,
  className = '',
  children
}: EnrollButtonProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setIsAuthenticated(!!session)
  }, [supabase])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleEnrollClick = async () => {
    setIsLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        const enrollmentIntent = {
          courseId,
          programType,
          productType,
          price,
          planName,
          timestamp: Date.now()
        }
        sessionStorage.setItem('enrollmentIntent', JSON.stringify(enrollmentIntent))
        router.push(`/auth/register?redirectTo=${encodeURIComponent(window.location.pathname)}`)
        return
      }

      proceedToCheckout(session.user.id)
    } catch (error) {
      console.error('Enrollment error:', error)
      setIsLoading(false)
    }
  }

  const proceedToCheckout = async (userId: string) => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productType,
          courseId,
          programType,
          price,
          planName
        })
      })

      if (!response.ok) throw new Error('Failed to create checkout session')

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleEnrollClick}
      disabled={isLoading}
      className={`${className} ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } inline-flex items-center justify-center gap-2`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {!isAuthenticated && <Lock className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  )
}
