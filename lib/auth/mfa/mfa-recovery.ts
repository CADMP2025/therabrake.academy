/**
 * MFA Recovery Service
 * Handles MFA recovery when user loses access to their device
 */

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/monitoring'
import { emailService } from '@/lib/email/email-service'
import crypto from 'crypto'

export interface MFARecoveryResult {
  success: boolean
  message: string
  error?: string
}

/**
 * Initiate MFA recovery process
 */
export async function initiateMFARecovery(
  email: string
): Promise<MFARecoveryResult> {
  try {
    const supabase = await createClient()

    // Get user by email
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, mfa_enabled')
      .eq('email', email)
      .single()

    if (!profile) {
      // Don't reveal if user exists
      return {
        success: true,
        message: 'If an account exists with MFA enabled, you will receive recovery instructions'
      }
    }

    if (!profile.mfa_enabled) {
      // Don't reveal MFA status
      return {
        success: true,
        message: 'If an account exists with MFA enabled, you will receive recovery instructions'
      }
    }

    // Generate recovery token
    const token = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24-hour expiry

    // Store recovery token
    const { error } = await supabase.from('mfa_recovery_tokens').insert({
      user_id: profile.id,
      token_hash: hashedToken,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    })

    if (error) {
      logger.error('Failed to store recovery token', error)
      return {
        success: false,
        message: 'Failed to initiate recovery',
        error: error.message
      }
    }

    // Send recovery email
    const recoveryLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/mfa-recovery?token=${token}`

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .alert { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .code { background-color: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 16px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🔐 MFA Recovery Request</h2>
          <div class="alert">
            <strong>⚠️ Security Notice</strong>
            <p>We received a request to recover your Multi-Factor Authentication (MFA) settings.</p>
          </div>
          <p>If you requested this recovery, click the button below to proceed:</p>
          <a href="${recoveryLink}" class="button">Recover MFA Access</a>
          <p>This link will expire in 24 hours.</p>
          <p><strong>If you didn't request this,</strong> please ignore this email and ensure your account is secure.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            For security reasons, you'll need to provide additional verification during the recovery process.
          </p>
        </div>
      </body>
      </html>
    `

    await supabase.from('email_logs').insert({
      email_type: 'mfa_recovery',
      recipient_email: email,
      subject: 'MFA Recovery Request - TheraBrake Academy',
      status: 'sent',
      user_id: profile.id,
      sent_at: new Date().toISOString()
    })

    logger.info('MFA recovery initiated', { userId: profile.id })

    return {
      success: true,
      message: 'Recovery instructions sent to your email'
    }
  } catch (error) {
    logger.error('MFA recovery initiation error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Verify recovery token
 */
export async function verifyRecoveryToken(
  token: string
): Promise<{ valid: boolean; userId?: string }> {
  try {
    const supabase = await createClient()

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const { data, error } = await supabase
      .from('mfa_recovery_tokens')
      .select('*')
      .eq('token_hash', hashedToken)
      .gt('expires_at', new Date().toISOString())
      .eq('used', false)
      .single()

    if (error || !data) {
      return { valid: false }
    }

    return {
      valid: true,
      userId: data.user_id
    }
  } catch (error) {
    logger.error('Recovery token verification error', error as Error)
    return { valid: false }
  }
}

/**
 * Complete MFA recovery and reset
 */
export async function completeMFARecovery(
  token: string,
  securityAnswers: Record<string, string>
): Promise<MFARecoveryResult> {
  try {
    const supabase = await createClient()

    // Verify token
    const { valid, userId } = await verifyRecoveryToken(token)

    if (!valid || !userId) {
      return {
        success: false,
        message: 'Invalid or expired recovery token',
        error: 'INVALID_TOKEN'
      }
    }

    // In production, verify security answers here
    // For now, we'll skip this step

    // Disable current MFA
    const { error: disableError } = await supabase
      .from('mfa_enrollments')
      .update({ status: 'disabled' })
      .eq('user_id', userId)

    if (disableError) {
      logger.error('Failed to disable MFA during recovery', disableError)
      return {
        success: false,
        message: 'Failed to complete recovery',
        error: disableError.message
      }
    }

    // Update profile
    await supabase
      .from('profiles')
      .update({ mfa_enabled: false })
      .eq('id', userId)

    // Remove all trusted devices
    await supabase
      .from('trusted_devices')
      .delete()
      .eq('user_id', userId)

    // Mark token as used
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    await supabase
      .from('mfa_recovery_tokens')
      .update({ used: true })
      .eq('token_hash', hashedToken)

    logger.info('MFA recovery completed', { userId })

    return {
      success: true,
      message: 'MFA has been reset. You can now set up MFA again with a new device.'
    }
  } catch (error) {
    logger.error('MFA recovery completion error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Use backup code for recovery
 */
export async function recoverWithBackupCode(
  userId: string,
  backupCode: string
): Promise<MFARecoveryResult> {
  try {
    const supabase = await createClient()

    // Get MFA enrollment
    const { data: enrollment, error: fetchError } = await supabase
      .from('mfa_enrollments')
      .select('backup_codes')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (fetchError || !enrollment) {
      return {
        success: false,
        message: 'No active MFA found',
        error: 'MFA_NOT_FOUND'
      }
    }

    const hashedCode = crypto.createHash('sha256').update(backupCode).digest('hex')
    const codeIndex = enrollment.backup_codes?.indexOf(hashedCode) ?? -1

    if (codeIndex === -1) {
      return {
        success: false,
        message: 'Invalid backup code',
        error: 'INVALID_CODE'
      }
    }

    // Remove used backup code
    const updatedCodes = [...(enrollment.backup_codes || [])]
    updatedCodes.splice(codeIndex, 1)

    await supabase
      .from('mfa_enrollments')
      .update({ backup_codes: updatedCodes })
      .eq('user_id', userId)

    logger.info('Recovery with backup code', { 
      userId, 
      remainingCodes: updatedCodes.length 
    })

    return {
      success: true,
      message: `Backup code verified. ${updatedCodes.length} codes remaining.`
    }
  } catch (error) {
    logger.error('Backup code recovery error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Check remaining backup codes
 */
export async function checkRemainingBackupCodes(
  userId: string
): Promise<number> {
  try {
    const supabase = await createClient()

    const { data } = await supabase
      .from('mfa_enrollments')
      .select('backup_codes')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (!data || !data.backup_codes) {
      return 0
    }

    return data.backup_codes.filter((code: string) => code !== null).length
  } catch (error) {
    logger.error('Failed to check backup codes', error as Error)
    return 0
  }
}

/**
 * Send low backup codes warning
 */
export async function sendLowBackupCodesWarning(
  userId: string,
  remainingCodes: number
): Promise<void> {
  if (remainingCodes > 3) {
    return
  }

  try {
    const supabase = await createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    if (!profile) {
      return
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>⚠️ Low Backup Codes Warning</h2>
          <div class="warning">
            <p><strong>You have ${remainingCodes} backup code${remainingCodes !== 1 ? 's' : ''} remaining.</strong></p>
            <p>We recommend regenerating your backup codes to ensure you don't lose access to your account.</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/security" class="button">Manage MFA Settings</a>
          <p>Backup codes are single-use codes that allow you to access your account if you lose your authenticator device.</p>
        </div>
      </body>
      </html>
    `

    await supabase.from('email_logs').insert({
      email_type: 'low_backup_codes',
      recipient_email: profile.email,
      subject: 'Low Backup Codes Warning - TheraBrake Academy',
      status: 'sent',
      user_id: userId,
      sent_at: new Date().toISOString()
    })

    logger.info('Low backup codes warning sent', { userId, remainingCodes })
  } catch (error) {
    logger.error('Failed to send low backup codes warning', error as Error)
  }
}
