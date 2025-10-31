/**
 * Account Security Service
 * Handles account lockout, login attempts tracking, and security notifications
 */

import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/email/email-service'
import { logger } from '@/lib/monitoring'

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION_MINUTES = 30
const ATTEMPT_WINDOW_MINUTES = 15

export interface LoginAttemptResult {
  allowed: boolean
  attemptsRemaining?: number
  lockedUntil?: Date
  message: string
}

export interface SecurityNotificationData {
  userId: string
  email: string
  name: string
  deviceInfo: string
  location?: string
  ipAddress: string
}

/**
 * Record login attempt
 */
export async function recordLoginAttempt(
  email: string,
  success: boolean,
  ipAddress: string,
  userAgent: string
): Promise<LoginAttemptResult> {
  try {
    const supabase = await createClient()

    // Get user by email
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (!profile) {
      return {
        allowed: true,
        message: 'Email not found'
      }
    }

    // Record attempt
    await supabase.from('login_attempts').insert({
      user_id: profile.id,
      email,
      success,
      ip_address: ipAddress,
      user_agent: userAgent,
      attempted_at: new Date().toISOString()
    })

    // If successful, clear failed attempts
    if (success) {
      await supabase
        .from('login_attempts')
        .delete()
        .eq('user_id', profile.id)
        .eq('success', false)

      return {
        allowed: true,
        message: 'Login successful'
      }
    }

    // Check recent failed attempts
    const windowStart = new Date()
    windowStart.setMinutes(windowStart.getMinutes() - ATTEMPT_WINDOW_MINUTES)

    const { data: recentAttempts, error } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('user_id', profile.id)
      .eq('success', false)
      .gte('attempted_at', windowStart.toISOString())
      .order('attempted_at', { ascending: false })

    if (error) {
      logger.error('Failed to check login attempts', error)
      return {
        allowed: true,
        message: 'Could not verify attempts'
      }
    }

    const failedAttempts = recentAttempts.length

    // Check if account should be locked
    if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockedUntil = new Date()
      lockedUntil.setMinutes(lockedUntil.getMinutes() + LOCKOUT_DURATION_MINUTES)

      // Update account lock status
      await supabase
        .from('profiles')
        .update({
          locked_until: lockedUntil.toISOString(),
          lock_reason: 'Too many failed login attempts'
        })
        .eq('id', profile.id)

      logger.warn('Account locked due to failed attempts', { userId: profile.id, failedAttempts })

      return {
        allowed: false,
        lockedUntil,
        message: `Account locked due to too many failed login attempts. Try again after ${LOCKOUT_DURATION_MINUTES} minutes.`
      }
    }

    return {
      allowed: true,
      attemptsRemaining: MAX_LOGIN_ATTEMPTS - failedAttempts,
      message: `Login failed. ${MAX_LOGIN_ATTEMPTS - failedAttempts} attempts remaining.`
    }
  } catch (error) {
    logger.error('Failed to record login attempt', error as Error)
    return {
      allowed: true,
      message: 'Error recording attempt'
    }
  }
}

/**
 * Check if account is locked
 */
export async function isAccountLocked(email: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('locked_until')
      .eq('email', email)
      .single()

    if (!profile || !profile.locked_until) {
      return false
    }

    const lockedUntil = new Date(profile.locked_until)
    const now = new Date()

    if (now < lockedUntil) {
      return true
    }

    // Lock expired, clear it
    await supabase
      .from('profiles')
      .update({ locked_until: null, lock_reason: null })
      .eq('email', email)

    return false
  } catch (error) {
    logger.error('Failed to check account lock status', error as Error)
    return false
  }
}

/**
 * Unlock account (admin function)
 */
export async function unlockAccount(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('profiles')
      .update({ locked_until: null, lock_reason: null })
      .eq('id', userId)

    if (error) {
      logger.error('Failed to unlock account', error)
      return false
    }

    // Clear failed attempts
    await supabase
      .from('login_attempts')
      .delete()
      .eq('user_id', userId)
      .eq('success', false)

    logger.info('Account unlocked', { userId })
    return true
  } catch (error) {
    logger.error('Failed to unlock account', error as Error)
    return false
  }
}

/**
 * Send login notification for new device
 */
export async function sendLoginNotification(
  data: SecurityNotificationData
): Promise<boolean> {
  try {
    const supabase = await createClient()

    // Check if this device is recognized
    const { data: recentLogins } = await supabase
      .from('login_attempts')
      .select('user_agent, ip_address')
      .eq('user_id', data.userId)
      .eq('success', true)
      .order('attempted_at', { ascending: false })
      .limit(10)

    const isNewDevice = !recentLogins?.some(
      login => login.user_agent === data.deviceInfo || login.ip_address === data.ipAddress
    )

    if (isNewDevice) {
      // Send notification email
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .alert { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>New Login Detected</h2>
            <div class="alert">
              <strong>⚠️ Security Alert</strong>
              <p>We detected a login to your TheraBrake Academy account from a new device.</p>
            </div>
            <div class="info">
              <p><strong>Device:</strong> ${data.deviceInfo}</p>
              <p><strong>IP Address:</strong> ${data.ipAddress}</p>
              ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p>If this was you, you can ignore this email.</p>
            <p>If you didn't log in from this device, please secure your account immediately:</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password" class="button">Reset Password</a>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              This is an automated security notification from TheraBrake Academy.
            </p>
          </div>
        </body>
        </html>
      `

      await supabase.from('email_logs').insert({
        email_type: 'login_notification',
        recipient_email: data.email,
        subject: 'New Login Detected - TheraBrake Academy',
        status: 'sent',
        user_id: data.userId,
        sent_at: new Date().toISOString()
      })

      logger.info('Login notification sent for new device', { userId: data.userId })
    }

    return true
  } catch (error) {
    logger.error('Failed to send login notification', error as Error)
    return false
  }
}

/**
 * Get login history for user
 */
export async function getLoginHistory(userId: string, limit: number = 20) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('attempted_at', { ascending: false })
      .limit(limit)

    if (error) {
      logger.error('Failed to get login history', error)
      return []
    }

    return data
  } catch (error) {
    logger.error('Failed to get login history', error as Error)
    return []
  }
}
