/**
 * Session Management Service
 * Handles "Remember Me" tokens, magic links, and multi-device sessions
 */

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { logger } from '@/lib/monitoring'
import crypto from 'crypto'

const REMEMBER_ME_DURATION_DAYS = 30
const MAGIC_LINK_EXPIRY_MINUTES = 15

export interface RememberMeResult {
  success: boolean
  message: string
  token?: string
}

export interface MagicLinkResult {
  success: boolean
  message: string
  error?: string
}

export interface SessionInfo {
  id: string
  userId: string
  deviceInfo: string
  ipAddress: string
  lastActivity: Date
  createdAt: Date
  expiresAt?: Date
}

/**
 * Generate and store "Remember Me" token
 */
export async function generateRememberMeToken(
  userId: string,
  deviceInfo: string,
  ipAddress: string
): Promise<RememberMeResult> {
  try {
    const supabase = await createClient()

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + REMEMBER_ME_DURATION_DAYS)

    // Store token in database
    const { error } = await supabase.from('remember_me_tokens').insert({
      user_id: userId,
      token_hash: hashedToken,
      device_info: deviceInfo,
      ip_address: ipAddress,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    })

    if (error) {
      logger.error('Failed to create remember me token', error)
      return {
        success: false,
        message: 'Failed to create remember me token'
      }
    }

    // Set secure HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('remember_me', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REMEMBER_ME_DURATION_DAYS * 24 * 60 * 60,
      path: '/'
    })

    logger.info('Remember me token created', { userId })

    return {
      success: true,
      message: 'Remember me token created',
      token
    }
  } catch (error) {
    logger.error('Failed to generate remember me token', error as Error)
    return {
      success: false,
      message: 'An error occurred'
    }
  }
}

/**
 * Validate and use "Remember Me" token
 */
export async function validateRememberMeToken(
  token: string
): Promise<{ valid: boolean; userId?: string }> {
  try {
    const supabase = await createClient()

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Find valid token
    const { data, error } = await supabase
      .from('remember_me_tokens')
      .select('*')
      .eq('token_hash', hashedToken)
      .gt('expires_at', new Date().toISOString())
      .eq('revoked', false)
      .single()

    if (error || !data) {
      return { valid: false }
    }

    // Update last used
    await supabase
      .from('remember_me_tokens')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id)

    logger.info('Remember me token validated', { userId: data.user_id })

    return {
      valid: true,
      userId: data.user_id
    }
  } catch (error) {
    logger.error('Failed to validate remember me token', error as Error)
    return { valid: false }
  }
}

/**
 * Revoke "Remember Me" token
 */
export async function revokeRememberMeToken(token: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const { error } = await supabase
      .from('remember_me_tokens')
      .update({ revoked: true })
      .eq('token_hash', hashedToken)

    if (error) {
      logger.error('Failed to revoke remember me token', error)
      return false
    }

    // Clear cookie
    const cookieStore = await cookies()
    cookieStore.delete('remember_me')

    logger.info('Remember me token revoked')
    return true
  } catch (error) {
    logger.error('Failed to revoke remember me token', error as Error)
    return false
  }
}

/**
 * Revoke all "Remember Me" tokens for user (logout from all devices)
 */
export async function revokeAllRememberMeTokens(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('remember_me_tokens')
      .update({ revoked: true })
      .eq('user_id', userId)
      .eq('revoked', false)

    if (error) {
      logger.error('Failed to revoke all remember me tokens', error)
      return false
    }

    logger.info('All remember me tokens revoked', { userId })
    return true
  } catch (error) {
    logger.error('Failed to revoke all tokens', error as Error)
    return false
  }
}

/**
 * Send magic link for passwordless login
 */
export async function sendMagicLink(email: string): Promise<MagicLinkResult> {
  try {
    const supabase = await createClient()

    // Check if user exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single()

    if (!profile) {
      // Don't reveal if email exists
      return {
        success: true,
        message: 'If an account exists with this email, you will receive a magic link'
      }
    }

    // Send magic link via Supabase
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        shouldCreateUser: false
      }
    })

    if (error) {
      logger.error('Failed to send magic link', error)
      return {
        success: false,
        message: 'Failed to send magic link',
        error: error.message
      }
    }

    logger.info('Magic link sent', { email })

    return {
      success: true,
      message: 'Magic link sent to your email'
    }
  } catch (error) {
    logger.error('Magic link error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Create session record
 */
export async function createSession(
  userId: string,
  deviceInfo: string,
  ipAddress: string,
  rememberMe: boolean = false
): Promise<string | null> {
  try {
    const supabase = await createClient()

    const expiresAt = new Date()
    if (rememberMe) {
      expiresAt.setDate(expiresAt.getDate() + REMEMBER_ME_DURATION_DAYS)
    } else {
      expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour session
    }

    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        device_info: deviceInfo,
        ip_address: ipAddress,
        last_activity: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      logger.error('Failed to create session', error)
      return null
    }

    logger.info('Session created', { userId, sessionId: data.id })
    return data.id
  } catch (error) {
    logger.error('Failed to create session', error as Error)
    return null
  }
}

/**
 * Update session activity
 */
export async function updateSessionActivity(sessionId: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('user_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', sessionId)

    if (error) {
      logger.error('Failed to update session activity', error)
      return false
    }

    return true
  } catch (error) {
    logger.error('Failed to update session activity', error as Error)
    return false
  }
}

/**
 * Get active sessions for user
 */
export async function getActiveSessions(userId: string): Promise<SessionInfo[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .order('last_activity', { ascending: false })

    if (error) {
      logger.error('Failed to get active sessions', error)
      return []
    }

    return data.map(session => ({
      id: session.id,
      userId: session.user_id,
      deviceInfo: session.device_info,
      ipAddress: session.ip_address,
      lastActivity: new Date(session.last_activity),
      createdAt: new Date(session.created_at),
      expiresAt: session.expires_at ? new Date(session.expires_at) : undefined
    }))
  } catch (error) {
    logger.error('Failed to get active sessions', error as Error)
    return []
  }
}

/**
 * Revoke session
 */
export async function revokeSession(sessionId: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('id', sessionId)

    if (error) {
      logger.error('Failed to revoke session', error)
      return false
    }

    logger.info('Session revoked', { sessionId })
    return true
  } catch (error) {
    logger.error('Failed to revoke session', error as Error)
    return false
  }
}

/**
 * Revoke all sessions for user except current
 */
export async function revokeAllOtherSessions(
  userId: string,
  currentSessionId: string
): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', userId)
      .neq('id', currentSessionId)

    if (error) {
      logger.error('Failed to revoke other sessions', error)
      return false
    }

    logger.info('All other sessions revoked', { userId })
    return true
  } catch (error) {
    logger.error('Failed to revoke other sessions', error as Error)
    return false
  }
}

/**
 * Clean up expired sessions and tokens
 */
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    const supabase = await createClient()

    const now = new Date().toISOString()

    // Delete expired sessions
    await supabase
      .from('user_sessions')
      .delete()
      .lt('expires_at', now)

    // Delete expired remember me tokens
    await supabase
      .from('remember_me_tokens')
      .delete()
      .lt('expires_at', now)

    logger.info('Expired sessions cleaned up')
  } catch (error) {
    logger.error('Failed to cleanup expired sessions', error as Error)
  }
}
