/**
 * POST /api/auth/login
 * Handle login with account lockout and security notifications
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  recordLoginAttempt,
  isAccountLocked,
  sendLoginNotification
} from '@/lib/auth/account-security'
import {
  generateRememberMeToken,
  createSession
} from '@/lib/auth/session-management'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if account is locked
    const locked = await isAccountLocked(email)
    if (locked) {
      return NextResponse.json(
        { error: 'Account is locked due to too many failed login attempts' },
        { status: 403 }
      )
    }

    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const supabase = await createClient()

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    // Record attempt
    const attemptResult = await recordLoginAttempt(
      email,
      !error,
      ipAddress,
      userAgent
    )

    if (error) {
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          attemptsRemaining: attemptResult.attemptsRemaining
        },
        { status: 401 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('id', data.user.id)
      .single()

    // Create session
    const sessionId = await createSession(
      data.user.id,
      userAgent,
      ipAddress,
      rememberMe
    )

    // Generate remember me token if requested
    if (rememberMe) {
      await generateRememberMeToken(data.user.id, userAgent, ipAddress)
    }

    // Send login notification for new device
    if (profile) {
      await sendLoginNotification({
        userId: data.user.id,
        email: profile.email,
        name: profile.full_name || 'User',
        deviceInfo: userAgent,
        ipAddress
      })
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
      sessionId
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
