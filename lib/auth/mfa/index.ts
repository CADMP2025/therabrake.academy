41/**
 * MFA Module
 * Central export for all MFA functionality
 */

// MFA Enrollment
export {
  generateMFASecret,
  verifyAndEnrollMFA,
  disableMFA,
  getMFAStatus,
  regenerateBackupCodes,
  type MFAEnrollmentResult,
  type MFAStatus
} from './mfa-enrollment'

// MFA Challenge
export {
  requiresMFAChallenge,
  verifyMFAChallenge,
  getTrustedDevices,
  revokeTrustedDevice,
  revokeAllTrustedDevices,
  sendMFACodeEmail,
  verifyEmailMFACode,
  type MFAChallengeResult
} from './mfa-challenge'

// MFA Recovery
export {
  initiateMFARecovery,
  verifyRecoveryToken,
  completeMFARecovery,
  recoverWithBackupCode,
  checkRemainingBackupCodes,
  sendLowBackupCodesWarning,
  type MFARecoveryResult
} from './mfa-recovery'
