/**
 * GET /api/auth/sessions
 * Get active sessions for current user
 * 
 * DELETE /api/auth/sessions
 * Revoke session(s)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getActiveSessions,
  revokeSession,
  revokeAllOtherSessions
} from '@/lib/auth/session-management'

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

    const sessions = await getActiveSessions(user.id)

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Get sessions error:', error)
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
    const sessionId = searchParams.get('sessionId')
    const action = searchParams.get('action')

    // Revoke all other sessions
    if (action === 'revokeOthers') {
      const currentSessionId = searchParams.get('currentSessionId')
      if (!currentSessionId) {
        return NextResponse.json(
          { error: 'Current session ID is required' },
          { status: 400 }
        )
      }

      const success = await revokeAllOtherSessions(user.id, currentSessionId)
      return NextResponse.json({ success })
    }

    // Revoke specific session
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const success = await revokeSession(sessionId)
    return NextResponse.json({ success })
  } catch (error) {
    console.error('Revoke session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
