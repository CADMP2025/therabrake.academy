/**
 * POST /api/auth/mfa/challenge
 * MFA challenge verification endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  verifyMFAChallenge,
  requiresMFAChallenge,
  sendMFACodeEmail
} from '@/lib/auth/mfa/mfa-challenge'

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
    const { code, trustDevice, action } = body

    // Check if MFA is required
    if (action === 'check') {
      const deviceId = request.cookies.get('device_id')?.value
      const required = await requiresMFAChallenge(user.id, deviceId)
      return NextResponse.json({ required })
    }

    // Send MFA code via email
    if (action === 'send-email') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', user.id)
        .single()

      if (!profile) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        )
      }

      const sent = await sendMFACodeEmail(
        user.id,
        profile.email,
        profile.full_name || 'User'
      )

      return NextResponse.json({
        success: sent,
        message: sent ? 'Verification code sent' : 'Failed to send code'
      })
    }

    // Verify MFA code
    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      )
    }

    const deviceInfo = request.headers.get('user-agent') || 'unknown'
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'

    const result = await verifyMFAChallenge(
      user.id,
      code,
      trustDevice,
      deviceInfo,
      ipAddress
    )

    // Set device ID cookie if device was trusted
    if (result.success && result.trustDevice) {
      // Device ID would be set in the response
      // This is a simplified version
    }

    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    console.error('MFA challenge error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
