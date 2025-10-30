/**
 * Email Verification Service
 * Handles email verification tokens and flow
 */

import { createClient } from '@/lib/supabase/server'
import { resend } from '@/lib/email/resend-client'
import { logger } from '@/lib/monitoring'

export interface VerificationResult {
  success: boolean
  message: string
  error?: string
}

/**
 * Send verification email to user
 */
export async function sendVerificationEmail(
  email: string,
  name: string
): Promise<VerificationResult> {
  try {
    const supabase = await createClient()

    // Generate verification link
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email`
      }
    })

    if (error) {
      logger.error('Failed to generate verification link', error)
      return {
        success: false,
        message: 'Failed to send verification email',
        error: error.message
      }
    }

    logger.info('Verification email sent', { email })

    return {
      success: true,
      message: 'Verification email sent successfully'
    }
  } catch (error) {
    logger.error('Email verification error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Verify email with token
 */
export async function verifyEmail(
  token: string,
  type: 'signup' | 'email_change' = 'signup'
): Promise<VerificationResult> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type
    })

    if (error) {
      logger.error('Email verification failed', error)
      return {
        success: false,
        message: 'Invalid or expired verification link',
        error: error.message
      }
    }

    logger.info('Email verified successfully')

    return {
      success: true,
      message: 'Email verified successfully'
    }
  } catch (error) {
    logger.error('Email verification error', error as Error)
    return {
      success: false,
      message: 'Verification failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(
  email: string
): Promise<VerificationResult> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email`
      }
    })

    if (error) {
      logger.error('Failed to resend verification email', error)
      return {
        success: false,
        message: 'Failed to resend verification email',
        error: error.message
      }
    }

    logger.info('Verification email resent', { email })

    return {
      success: true,
      message: 'Verification email resent successfully'
    }
  } catch (error) {
    logger.error('Resend verification error', error as Error)
    return {
      success: false,
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Check if email is verified
 */
export async function isEmailVerified(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { data } = await supabase.auth.admin.getUserById(userId)

    return data.user?.email_confirmed_at !== null
  } catch (error) {
    logger.error('Failed to check email verification', error as Error)
    return false
  }
}
