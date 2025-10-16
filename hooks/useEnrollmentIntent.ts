// hooks/useEnrollmentIntent.ts
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export interface EnrollmentIntent {
  courseId: string
  courseTitle: string
  price: number
  hours: number
  timestamp: number
}

export function useEnrollmentIntent() {
  const router = useRouter()
  const [intent, setIntent] = useState<EnrollmentIntent | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('enrollmentIntent')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setIntent(parsed)
        } else {
          sessionStorage.removeItem('enrollmentIntent')
        }
      } catch (e) {
        sessionStorage.removeItem('enrollmentIntent')
      }
    }
  }, [])

  const storeIntent = (courseId: string, courseTitle: string, price: number, hours: number) => {
    const intentData: EnrollmentIntent = {
      courseId,
      courseTitle,
      price,
      hours,
      timestamp: Date.now()
    }
    sessionStorage.setItem('enrollmentIntent', JSON.stringify(intentData))
    setIntent(intentData)
  }

  const clearIntent = () => {
    sessionStorage.removeItem('enrollmentIntent')
    setIntent(null)
  }

  const redirectToLogin = (courseId: string, courseTitle: string, price: number, hours: number) => {
    storeIntent(courseId, courseTitle, price, hours)
    router.push('/auth/login?redirect=enrollment')
  }

  const redirectToRegister = (courseId: string, courseTitle: string, price: number, hours: number) => {
    storeIntent(courseId, courseTitle, price, hours)
    router.push('/auth/register?redirect=enrollment')
  }

  const processStoredIntent = async () => {
    if (!intent) return null
    return intent
  }

  return {
    intent,
    storeIntent,
    clearIntent,
    redirectToLogin,
    redirectToRegister,
    processStoredIntent
  }
}
