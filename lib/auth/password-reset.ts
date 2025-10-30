/**
 * Password Reset Service
 * Handles password reset requests and validation
 */

import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/email/email-service'
import { logger } from '@/lib/monitoring'

export interface PasswordResetResult {
  success: boolean
  message: string
  error?: string
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<PasswordResetResult> {
  try {
    const supabase = await createClient()

    // Check if user exists
    const { data: userData } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('email', email)
      .single()

    if (!userData) {
      // Don't reveal if email exists for security
      logger.info('Password reset requested for non-existent email', { email })
      return {
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      }
    }

    // Generate reset link
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
    })

    if (error) {
      logger.error('Failed to send password reset email', error)
      return {
        success: false,
        message: 'Failed to send password reset email',
        error: error.message
      }
    }

    // Send email via email service
    const emailResult = await emailService.sendPasswordReset(
      email,
      userData.full_name || 'User',
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
      userData.id
    )

    if (!emailResult.success) {
      logger.error('Failed to send password reset email via service', new Error(`Email service failed for ${email}`))
    }

    logger.info('Password reset email sent', { email, userId: userData.id })

    return {
      success: true,
      message: 'Password reset link sent to your email'
    }
  } catch (error) {
    logger.error('Password reset error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(
  newPassword: string
): Promise<PasswordResetResult> {
  try {
    const supabase = await createClient()

    // Validate password strength
    const validation = validatePasswordStrength(newPassword)
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message || 'Password does not meet requirements',
        error: 'WEAK_PASSWORD'
      }
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      logger.error('Failed to reset password', error)
      return {
        success: false,
        message: 'Failed to reset password',
        error: error.message
      }
    }

    logger.info('Password reset successfully')

    return {
      success: true,
      message: 'Password reset successfully'
    }
  } catch (error) {
    logger.error('Password reset error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  message?: string
  strength: 'weak' | 'medium' | 'strong'
} {
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters',
      strength: 'weak'
    }
  }

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const criteriaMet = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length

  if (criteriaMet < 3) {
    return {
      valid: false,
      message: 'Password must contain at least 3 of: uppercase, lowercase, numbers, special characters',
      strength: 'weak'
    }
  }

  if (criteriaMet === 3) {
    return {
      valid: true,
      strength: 'medium'
    }
  }

  return {
    valid: true,
    strength: 'strong'
  }
}

/**
 * Update password (for authenticated users)
 */
export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<PasswordResetResult> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        message: 'Not authenticated',
        error: 'NOT_AUTHENTICATED'
      }
    }

    // Verify current password by attempting sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    })

    if (signInError) {
      return {
        success: false,
        message: 'Current password is incorrect',
        error: 'INVALID_PASSWORD'
      }
    }

    // Validate new password
    const validation = validatePasswordStrength(newPassword)
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message || 'New password does not meet requirements',
        error: 'WEAK_PASSWORD'
      }
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      logger.error('Failed to update password', error)
      return {
        success: false,
        message: 'Failed to update password',
        error: error.message
      }
    }

    logger.info('Password updated successfully', { userId: user.id })

    return {
      success: true,
      message: 'Password updated successfully'
    }
  } catch (error) {
    logger.error('Password update error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
