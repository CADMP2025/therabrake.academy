/**
 * POST /api/auth/verify-email
 * Verify email with token
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyEmail, resendVerificationEmail } from '@/lib/auth/email-verification'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, action } = body

    // Handle resend action
    if (action === 'resend') {
      const { email } = body
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        )
      }

      const result = await resendVerificationEmail(email)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    // Handle verify action
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    const result = await verifyEmail(token)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
