/**
 * MFA Enrollment Service
 * Handles MFA setup and enrollment flow
 */

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/monitoring'
import * as speakeasy from 'speakeasy'
import * as QRCode from 'qrcode'

export interface MFAEnrollmentResult {
  success: boolean
  message: string
  secret?: string
  qrCode?: string
  backupCodes?: string[]
  error?: string
}

export interface MFAStatus {
  enabled: boolean
  method?: 'totp' | 'sms' | 'email'
  enrolledAt?: Date
  backupCodesRemaining?: number
}

/**
 * Generate TOTP secret for MFA enrollment
 */
export async function generateMFASecret(
  userId: string,
  userEmail: string
): Promise<MFAEnrollmentResult> {
  try {
    const supabase = await createClient()

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `TheraBrake Academy (${userEmail})`,
      issuer: 'TheraBrake Academy',
      length: 32
    })

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!)

    // Store temporary secret (not yet confirmed)
    const { error } = await supabase
      .from('mfa_enrollments')
      .upsert({
        user_id: userId,
        secret_encrypted: secret.base32,
        status: 'pending',
        method: 'totp',
        created_at: new Date().toISOString()
      })

    if (error) {
      logger.error('Failed to store MFA secret', error)
      return {
        success: false,
        message: 'Failed to generate MFA secret',
        error: error.message
      }
    }

    logger.info('MFA secret generated', { userId })

    return {
      success: true,
      message: 'MFA secret generated',
      secret: secret.base32,
      qrCode
    }
  } catch (error) {
    logger.error('MFA secret generation error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Verify TOTP code and complete MFA enrollment
 */
export async function verifyAndEnrollMFA(
  userId: string,
  code: string
): Promise<MFAEnrollmentResult> {
  try {
    const supabase = await createClient()

    // Get pending enrollment
    const { data: enrollment, error: fetchError } = await supabase
      .from('mfa_enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single()

    if (fetchError || !enrollment) {
      return {
        success: false,
        message: 'No pending MFA enrollment found',
        error: 'ENROLLMENT_NOT_FOUND'
      }
    }

    // Verify TOTP code
    const verified = speakeasy.totp.verify({
      secret: enrollment.secret_encrypted,
      encoding: 'base32',
      token: code,
      window: 2 // Allow 2 time steps before/after
    })

    if (!verified) {
      return {
        success: false,
        message: 'Invalid verification code',
        error: 'INVALID_CODE'
      }
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes(10)
    const hashedBackupCodes = backupCodes.map(code => 
      hashBackupCode(code)
    )

    // Activate MFA
    const { error: updateError } = await supabase
      .from('mfa_enrollments')
      .update({
        status: 'active',
        enrolled_at: new Date().toISOString(),
        backup_codes: hashedBackupCodes
      })
      .eq('user_id', userId)

    if (updateError) {
      logger.error('Failed to activate MFA', updateError)
      return {
        success: false,
        message: 'Failed to activate MFA',
        error: updateError.message
      }
    }

    // Update profile
    await supabase
      .from('profiles')
      .update({ mfa_enabled: true })
      .eq('id', userId)

    logger.info('MFA enrolled successfully', { userId })

    return {
      success: true,
      message: 'MFA enabled successfully',
      backupCodes
    }
  } catch (error) {
    logger.error('MFA enrollment verification error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Generate backup recovery codes
 */
function generateBackupCodes(count: number): string[] {
  const codes: string[] = []
  
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    codes.push(code)
  }
  
  return codes
}

/**
 * Hash backup code for storage
 */
function hashBackupCode(code: string): string {
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(code).digest('hex')
}

/**
 * Disable MFA for user
 */
export async function disableMFA(
  userId: string,
  verificationCode: string
): Promise<MFAEnrollmentResult> {
  try {
    const supabase = await createClient()

    // Verify current MFA code before disabling
    const verified = await verifyMFACode(userId, verificationCode)
    
    if (!verified) {
      return {
        success: false,
        message: 'Invalid verification code',
        error: 'INVALID_CODE'
      }
    }

    // Deactivate MFA
    const { error } = await supabase
      .from('mfa_enrollments')
      .update({ status: 'disabled' })
      .eq('user_id', userId)

    if (error) {
      logger.error('Failed to disable MFA', error)
      return {
        success: false,
        message: 'Failed to disable MFA',
        error: error.message
      }
    }

    // Update profile
    await supabase
      .from('profiles')
      .update({ mfa_enabled: false })
      .eq('id', userId)

    // Remove trusted devices
    await supabase
      .from('trusted_devices')
      .delete()
      .eq('user_id', userId)

    logger.info('MFA disabled', { userId })

    return {
      success: true,
      message: 'MFA disabled successfully'
    }
  } catch (error) {
    logger.error('MFA disable error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get MFA status for user
 */
export async function getMFAStatus(userId: string): Promise<MFAStatus | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('mfa_enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      return {
        enabled: false
      }
    }

    // Count remaining backup codes
    const backupCodesRemaining = data.backup_codes?.filter((code: string) => code !== null).length || 0

    return {
      enabled: true,
      method: data.method,
      enrolledAt: new Date(data.enrolled_at),
      backupCodesRemaining
    }
  } catch (error) {
    logger.error('Failed to get MFA status', error as Error)
    return null
  }
}

/**
 * Verify MFA code (used internally)
 */
async function verifyMFACode(userId: string, code: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { data: enrollment } = await supabase
      .from('mfa_enrollments')
      .select('secret_encrypted')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (!enrollment) {
      return false
    }

    return speakeasy.totp.verify({
      secret: enrollment.secret_encrypted,
      encoding: 'base32',
      token: code,
      window: 2
    })
  } catch (error) {
    logger.error('MFA verification error', error as Error)
    return false
  }
}

/**
 * Regenerate backup codes
 */
export async function regenerateBackupCodes(
  userId: string,
  verificationCode: string
): Promise<MFAEnrollmentResult> {
  try {
    // Verify current MFA code
    const verified = await verifyMFACode(userId, verificationCode)
    
    if (!verified) {
      return {
        success: false,
        message: 'Invalid verification code',
        error: 'INVALID_CODE'
      }
    }

    const supabase = await createClient()

    // Generate new backup codes
    const backupCodes = generateBackupCodes(10)
    const hashedBackupCodes = backupCodes.map(code => hashBackupCode(code))

    // Update backup codes
    const { error } = await supabase
      .from('mfa_enrollments')
      .update({ backup_codes: hashedBackupCodes })
      .eq('user_id', userId)

    if (error) {
      logger.error('Failed to regenerate backup codes', error)
      return {
        success: false,
        message: 'Failed to regenerate backup codes',
        error: error.message
      }
    }

    logger.info('Backup codes regenerated', { userId })

    return {
      success: true,
      message: 'Backup codes regenerated',
      backupCodes
    }
  } catch (error) {
    logger.error('Backup code regeneration error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
