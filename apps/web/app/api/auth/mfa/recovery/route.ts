/**
 * POST /api/auth/mfa/recovery
 * MFA recovery endpoints
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  initiateMFARecovery,
  completeMFARecovery,
  recoverWithBackupCode,
  checkRemainingBackupCodes
} from '@/lib/auth/mfa/mfa-recovery'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, token, securityAnswers, backupCode } = body

    // Initiate recovery
    if (action === 'initiate') {
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        )
      }

      const result = await initiateMFARecovery(email)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    // Complete recovery with token
    if (action === 'complete') {
      if (!token) {
        return NextResponse.json(
          { error: 'Recovery token is required' },
          { status: 400 }
        )
      }

      const result = await completeMFARecovery(token, securityAnswers || {})
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    // Recover with backup code
    if (action === 'backup-code') {
      const supabase = await createClient()

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
        )
      }

      if (!backupCode) {
        return NextResponse.json(
          { error: 'Backup code is required' },
          { status: 400 }
        )
      }

      const result = await recoverWithBackupCode(user.id, backupCode)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    }

    // Check remaining backup codes
    if (action === 'check-codes') {
      const supabase = await createClient()

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
        )
      }

      const remaining = await checkRemainingBackupCodes(user.id)
      return NextResponse.json({ remaining })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('MFA recovery error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
