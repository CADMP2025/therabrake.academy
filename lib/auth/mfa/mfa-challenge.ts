/**
 * MFA Challenge Service
 * Handles MFA verification during login and sensitive operations
 */

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/monitoring'
import * as speakeasy from 'speakeasy'
import crypto from 'crypto'

export interface MFAChallengeResult {
  success: boolean
  message: string
  requiresMFA?: boolean
  trustDevice?: boolean
  error?: string
}

/**
 * Check if user requires MFA challenge
 */
export async function requiresMFAChallenge(
  userId: string,
  deviceId?: string
): Promise<boolean> {
  try {
    const supabase = await createClient()

    // Check if MFA is enabled
    const { data: enrollment } = await supabase
      .from('mfa_enrollments')
      .select('status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (!enrollment) {
      return false
    }

    // Check if device is trusted
    if (deviceId) {
      const { data: trustedDevice } = await supabase
        .from('trusted_devices')
        .select('id')
        .eq('user_id', userId)
        .eq('device_id', deviceId)
        .eq('trusted', true)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (trustedDevice) {
        logger.info('MFA skipped for trusted device', { userId, deviceId })
        return false
      }
    }

    return true
  } catch (error) {
    logger.error('Failed to check MFA requirement', error as Error)
    return true // Fail secure - require MFA on error
  }
}

/**
 * Verify MFA code during login
 */
export async function verifyMFAChallenge(
  userId: string,
  code: string,
  trustDevice: boolean = false,
  deviceInfo?: string,
  ipAddress?: string
): Promise<MFAChallengeResult> {
  try {
    const supabase = await createClient()

    // Get active MFA enrollment
    const { data: enrollment, error: fetchError } = await supabase
      .from('mfa_enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (fetchError || !enrollment) {
      return {
        success: false,
        message: 'MFA not enabled',
        error: 'MFA_NOT_ENABLED'
      }
    }

    // Try TOTP verification first
    const totpVerified = speakeasy.totp.verify({
      secret: enrollment.secret_encrypted,
      encoding: 'base32',
      token: code,
      window: 2
    })

    let verified = totpVerified
    let usedBackupCode = false

    // If TOTP fails, try backup codes
    if (!totpVerified) {
      const backupCodeVerified = await verifyBackupCode(userId, code, enrollment.backup_codes)
      verified = backupCodeVerified.verified
      usedBackupCode = backupCodeVerified.used
    }

    if (!verified) {
      // Record failed attempt
      await recordMFAAttempt(userId, false, deviceInfo, ipAddress)

      return {
        success: false,
        message: 'Invalid verification code',
        error: 'INVALID_CODE'
      }
    }

    // Record successful attempt
    await recordMFAAttempt(userId, true, deviceInfo, ipAddress)

    // Create trusted device if requested
    let deviceId: string | undefined
    if (trustDevice && deviceInfo) {
      deviceId = await createTrustedDevice(userId, deviceInfo, ipAddress)
    }

    logger.info('MFA challenge verified', { 
      userId, 
      usedBackupCode,
      trustDevice 
    })

    return {
      success: true,
      message: 'MFA verified successfully',
      trustDevice: trustDevice && !!deviceId
    }
  } catch (error) {
    logger.error('MFA challenge verification error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Verify backup code
 */
async function verifyBackupCode(
  userId: string,
  code: string,
  backupCodes: string[]
): Promise<{ verified: boolean; used: boolean }> {
  if (!backupCodes || backupCodes.length === 0) {
    return { verified: false, used: false }
  }

  const hashedCode = crypto.createHash('sha256').update(code).digest('hex')
  const codeIndex = backupCodes.indexOf(hashedCode)

  if (codeIndex === -1) {
    return { verified: false, used: false }
  }

  // Mark backup code as used (remove from array)
  const updatedCodes = [...backupCodes]
  updatedCodes.splice(codeIndex, 1)

  const supabase = await createClient()
  await supabase
    .from('mfa_enrollments')
    .update({ backup_codes: updatedCodes })
    .eq('user_id', userId)

  logger.info('Backup code used', { userId, remainingCodes: updatedCodes.length })

  return { verified: true, used: true }
}

/**
 * Record MFA attempt
 */
async function recordMFAAttempt(
  userId: string,
  success: boolean,
  deviceInfo?: string,
  ipAddress?: string
): Promise<void> {
  try {
    const supabase = await createClient()

    await supabase.from('mfa_attempts').insert({
      user_id: userId,
      success,
      device_info: deviceInfo,
      ip_address: ipAddress,
      attempted_at: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Failed to record MFA attempt', error as Error)
  }
}

/**
 * Create trusted device
 */
async function createTrustedDevice(
  userId: string,
  deviceInfo: string,
  ipAddress?: string
): Promise<string> {
  try {
    const supabase = await createClient()

    // Generate unique device ID
    const deviceId = crypto.randomBytes(16).toString('hex')

    // Trust device for 30 days
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const { data, error } = await supabase
      .from('trusted_devices')
      .insert({
        user_id: userId,
        device_id: deviceId,
        device_info: deviceInfo,
        ip_address: ipAddress,
        trusted: true,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      logger.error('Failed to create trusted device', error)
      throw error
    }

    logger.info('Trusted device created', { userId, deviceId })
    return deviceId
  } catch (error) {
    logger.error('Trusted device creation error', error as Error)
    throw error
  }
}

/**
 * Get trusted devices for user
 */
export async function getTrustedDevices(userId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('trusted_devices')
      .select('*')
      .eq('user_id', userId)
      .eq('trusted', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Failed to get trusted devices', error)
      return []
    }

    return data
  } catch (error) {
    logger.error('Failed to get trusted devices', error as Error)
    return []
  }
}

/**
 * Revoke trusted device
 */
export async function revokeTrustedDevice(
  userId: string,
  deviceId: string
): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('trusted_devices')
      .update({ trusted: false })
      .eq('user_id', userId)
      .eq('device_id', deviceId)

    if (error) {
      logger.error('Failed to revoke trusted device', error)
      return false
    }

    logger.info('Trusted device revoked', { userId, deviceId })
    return true
  } catch (error) {
    logger.error('Trusted device revocation error', error as Error)
    return false
  }
}

/**
 * Revoke all trusted devices
 */
export async function revokeAllTrustedDevices(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('trusted_devices')
      .update({ trusted: false })
      .eq('user_id', userId)

    if (error) {
      logger.error('Failed to revoke all trusted devices', error)
      return false
    }

    logger.info('All trusted devices revoked', { userId })
    return true
  } catch (error) {
    logger.error('Failed to revoke all trusted devices', error as Error)
    return false
  }
}

/**
 * Send MFA code via email (fallback method)
 */
export async function sendMFACodeEmail(
  userId: string,
  email: string,
  name: string
): Promise<boolean> {
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    const supabase = await createClient()

    // Store code temporarily (expires in 10 minutes)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    const hashedCode = crypto.createHash('sha256').update(code).digest('hex')

    await supabase.from('mfa_email_codes').insert({
      user_id: userId,
      code_hash: hashedCode,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    })

    // Send email via email service
    const { emailService } = await import('@/lib/email/email-service')
    await emailService.sendMFACode(email, name, code, userId)

    logger.info('MFA code sent via email', { userId })
    return true
  } catch (error) {
    logger.error('Failed to send MFA code email', error as Error)
    return false
  }
}

/**
 * Verify email MFA code
 */
export async function verifyEmailMFACode(
  userId: string,
  code: string
): Promise<boolean> {
  try {
    const supabase = await createClient()

    const hashedCode = crypto.createHash('sha256').update(code).digest('hex')

    const { data, error } = await supabase
      .from('mfa_email_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code_hash', hashedCode)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !data) {
      return false
    }

    // Delete used code
    await supabase
      .from('mfa_email_codes')
      .delete()
      .eq('id', data.id)

    logger.info('Email MFA code verified', { userId })
    return true
  } catch (error) {
    logger.error('Email MFA code verification error', error as Error)
    return false
  }
}
