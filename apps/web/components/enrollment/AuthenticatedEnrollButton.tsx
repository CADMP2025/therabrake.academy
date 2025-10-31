'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { useState, ReactNode } from 'react'

interface AuthenticatedEnrollButtonProps {
  programType?: string
  courseId?: string
  productType?: string
  price: number
  priceId?: string
  className?: string
  children: ReactNode
}

export default function AuthenticatedEnrollButton({
  programType,
  courseId,
  productType = 'premium',
  price,
  priceId,
  className = '',
  children
}: AuthenticatedEnrollButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleEnroll = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        const enrollmentIntent = {
          type: productType,
          programType: programType || courseId,
          courseId: courseId,
          price,
          priceId: priceId || (programType ? `STRIPE_PRICE_PREMIUM_${programType}` : undefined),
          timestamp: Date.now()
        }
        
        localStorage.setItem('enrollmentIntent', JSON.stringify(enrollmentIntent))
        
        let redirectUrl = '/enrollment?'
        if (courseId) {
          redirectUrl += `course=${courseId}&price=${price}`
        } else if (programType) {
          redirectUrl += `type=${productType}&plan=${programType}&price=${price}`
        }
        
        router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`)
        return
      }

      let enrollmentUrl = '/enrollment?'
      if (courseId) {
        enrollmentUrl += `course=${courseId}&price=${price}`
      } else if (programType) {
        enrollmentUrl += `type=${productType}&plan=${programType}&price=${price}`
      }
      if (priceId) {
        enrollmentUrl += `&priceId=${priceId}`
      }
      
      router.push(enrollmentUrl)
    } catch (error) {
      console.error('Enrollment error:', error)
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handleEnroll} disabled={isLoading} className={className}>
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2 inline" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}
