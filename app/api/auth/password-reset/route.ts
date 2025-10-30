/**
 * POST /api/auth/password-reset
 * Request password reset or reset password with token
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  sendPasswordResetEmail,
  resetPassword,
  updatePassword
} from '@/lib/auth/password-reset'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, newPassword, currentPassword } = body

    // Request password reset
    if (action === 'request') {
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        )
      }

      const result = await sendPasswordResetEmail(email)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    // Reset password with token
    if (action === 'reset') {
      if (!newPassword) {
        return NextResponse.json(
          { error: 'New password is required' },
          { status: 400 }
        )
      }

      const result = await resetPassword(newPassword)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    // Update password (authenticated user)
    if (action === 'update') {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: 'Current and new passwords are required' },
          { status: 400 }
        )
      }

      const result = await updatePassword(currentPassword, newPassword)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
