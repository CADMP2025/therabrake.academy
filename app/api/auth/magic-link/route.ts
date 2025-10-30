/**
 * POST /api/auth/magic-link
 * Send magic link for passwordless login
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendMagicLink } from '@/lib/auth/session-management'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const result = await sendMagicLink(email)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    console.error('Magic link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
