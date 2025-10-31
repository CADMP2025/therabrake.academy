/**
 * POST /api/auth/mfa/enroll
 * MFA enrollment endpoints
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  generateMFASecret,
  verifyAndEnrollMFA,
  disableMFA,
  getMFAStatus,
  regenerateBackupCodes
} from '@/lib/auth/mfa/mfa-enrollment'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, code, verificationCode } = body

    // Generate MFA secret
    if (action === 'generate') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single()

      if (!profile) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        )
      }

      const result = await generateMFASecret(user.id, profile.email)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    // Verify and complete enrollment
    if (action === 'verify') {
      if (!code) {
        return NextResponse.json(
          { error: 'Verification code is required' },
          { status: 400 }
        )
      }

      const result = await verifyAndEnrollMFA(user.id, code)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    // Disable MFA
    if (action === 'disable') {
      if (!verificationCode) {
        return NextResponse.json(
          { error: 'Verification code is required' },
          { status: 400 }
        )
      }

      const result = await disableMFA(user.id, verificationCode)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    // Regenerate backup codes
    if (action === 'regenerate-codes') {
      if (!verificationCode) {
        return NextResponse.json(
          { error: 'Verification code is required' },
          { status: 400 }
        )
      }

      const result = await regenerateBackupCodes(user.id, verificationCode)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('MFA enrollment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const status = await getMFAStatus(user.id)
    return NextResponse.json({ status })
  } catch (error) {
    console.error('Get MFA status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
