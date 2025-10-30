/**
 * Authentication Module
 * Central export for all authentication functionality
 */

// Email Verification
export {
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail,
  isEmailVerified,
  type VerificationResult
} from './email-verification'

// Password Reset
export {
  sendPasswordResetEmail,
  resetPassword,
  updatePassword,
  validatePasswordStrength,
  type PasswordResetResult
} from './password-reset'

// Account Security
export {
  recordLoginAttempt,
  isAccountLocked,
  unlockAccount,
  sendLoginNotification,
  getLoginHistory,
  type LoginAttemptResult,
  type SecurityNotificationData
} from './account-security'

// Session Management
export {
  generateRememberMeToken,
  validateRememberMeToken,
  revokeRememberMeToken,
  revokeAllRememberMeTokens,
  sendMagicLink,
  createSession,
  updateSessionActivity,
  getActiveSessions,
  revokeSession,
  revokeAllOtherSessions,
  cleanupExpiredSessions,
  type RememberMeResult,
  type MagicLinkResult,
  type SessionInfo
} from './session-management'
