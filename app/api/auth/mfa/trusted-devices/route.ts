/**
 * GET /api/auth/mfa/trusted-devices
 * DELETE /api/auth/mfa/trusted-devices
 * Trusted device management endpoints
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getTrustedDevices,
  revokeTrustedDevice,
  revokeAllTrustedDevices
} from '@/lib/auth/mfa/mfa-challenge'

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

    const devices = await getTrustedDevices(user.id)
    return NextResponse.json({ devices })
  } catch (error) {
    console.error('Get trusted devices error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('deviceId')
    const action = searchParams.get('action')

    // Revoke all trusted devices
    if (action === 'revokeAll') {
      const success = await revokeAllTrustedDevices(user.id)
      return NextResponse.json({ success })
    }

    // Revoke specific device
    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID is required' },
        { status: 400 }
      )
    }

    const success = await revokeTrustedDevice(user.id, deviceId)
    return NextResponse.json({ success })
  } catch (error) {
    console.error('Revoke trusted device error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
