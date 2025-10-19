'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { useState, ReactNode } from 'react'

interface AuthenticatedEnrollButtonProps {
  programType: string
  productType?: string
  price: number
  priceId?: string
  className?: string
  children: ReactNode
}

export default function AuthenticatedEnrollButton({
  programType,
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
          programType,
          price,
          priceId: priceId || `STRIPE_PRICE_PREMIUM_${programType}`,
          timestamp: Date.now()
        }
        
        localStorage.setItem('enrollmentIntent', JSON.stringify(enrollmentIntent))
        router.push(`/auth/login?redirect=/enrollment?type=${productType}&plan=${programType}&price=${price}`)
        return
      }

      router.push(`/enrollment?type=${productType}&plan=${programType}&price=${price}${priceId ? `&priceId=${priceId}` : ''}`)
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
