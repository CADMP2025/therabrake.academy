/**
 * Comprehensive Security Configuration
 * Central configuration for all security features
 */

export const SECURITY_CONFIG = {
  // Session Management
  session: {
    timeoutMinutes: 30,
    maxDurationHours: 12,
    requireMFARoles: ['admin', 'instructor'],
    cookiePrefix: 'therabrake_',
  },
  
  // Geographic Restrictions (OFAC compliance)
  geographic: {
    restrictedCountries: ['KP', 'IR', 'SY', 'CU', 'SD'], // North Korea, Iran, Syria, Cuba, Sudan
    logAllAccess: true,
  },
  
  // Rate Limiting
  rateLimit: {
    // Anonymous/unauthenticated
    anonymous: {
      requests: 10,
      windowSeconds: 60,
    },
    // Authenticated users
    authenticated: {
      requests: 100,
      windowSeconds: 60,
    },
    // Admin users
    admin: {
      requests: 1000,
      windowSeconds: 60,
    },
    // API endpoints
    api: {
      requests: 50,
      windowSeconds: 60,
    },
    // Login attempts
    login: {
      requests: 5,
      windowSeconds: 300, // 5 minutes
      blockDurationMinutes: 30,
    },
    // Password reset
    passwordReset: {
      requests: 3,
      windowSeconds: 3600, // 1 hour
    },
  },
  
  // File Upload Security
  fileUpload: {
    maxSizeMB: 100,
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/webm',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    virusScanEnabled: true,
    expiryHours: 24,
  },
  
  // Encryption
  encryption: {
    algorithm: 'aes-256-gcm',
    keyRotationDays: 90,
    sensitiveFields: {
      user: ['ssn', 'tax_id', 'date_of_birth'],
      payment: ['card_number', 'cvv', 'bank_account'],
      address: ['street_address', 'apartment'],
      contact: ['phone', 'emergency_contact_phone'],
    },
  },
  
  // Password Policy
  password: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommon: true,
    maxAge: 90, // Days until password expires
    historyCount: 5, // Can't reuse last 5 passwords
  },
  
  // MFA Configuration
  mfa: {
    methods: ['totp', 'sms', 'email'],
    backupCodesCount: 10,
    gracePeriodDays: 7, // Days to set up MFA after becoming admin/instructor
    rememberDeviceDays: 30,
  },
  
  // Audit Logging
  auditLog: {
    retentionDays: 2555, // 7 years
    criticalEvents: [
      'security_violation',
      'unauthorized_access_attempt',
      'session_hijack_detected',
      'data_breach_detected',
      'admin_action',
      'role_change',
      'payment_completed',
      'certificate_issued',
    ],
    piiEvents: [
      'pii_access',
      'educational_record_access',
      'data_export',
      'gdpr_request',
      'ferpa_request',
    ],
  },
  
  // Data Retention (Compliance)
  dataRetention: {
    educationalRecords: 1460, // 4 years (FERPA minimum)
    auditLogs: 2555, // 7 years
    paymentRecords: 2555, // 7 years (PCI DSS)
    certificates: 3650, // 10 years
    userActivity: 730, // 2 years
    marketingData: 1095, // 3 years
  },
  
  // Anomaly Detection
  anomalyDetection: {
    enabled: true,
    thresholds: {
      failedLogins: 5, // per 24 hours
      uniqueIPs: 3, // per 24 hours
      uniqueCountries: 2, // per 24 hours
      dataAccessEvents: 50, // per 24 hours
      afterHoursActivity: 10, // per 24 hours (10 PM - 6 AM)
    },
    riskScoreThreshold: 50, // 0-100
  },
  
  // Security Headers
  headers: {
    contentSecurityPolicy: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://js.stripe.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'https:', 'blob:'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'connect-src': ["'self'", 'https://*.supabase.co', 'https://api.stripe.com'],
      'frame-src': ["'self'", 'https://js.stripe.com'],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': [],
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  },
  
  // CORS Configuration
  cors: {
    allowedOrigins: [
      'https://therabrake.academy',
      'https://www.therabrake.academy',
      'http://localhost:3000', // Development only
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Request-ID'],
    credentials: true,
    maxAge: 86400, // 24 hours
  },
  
  // Compliance
  compliance: {
    ferpa: {
      enabled: true,
      educationalRecordTypes: [
        'grades',
        'test_scores',
        'disciplinary_records',
        'attendance',
        'course_progress',
        'certificates',
      ],
      accessLogRequired: true,
      parentalConsentAge: 18,
    },
    gdpr: {
      enabled: true,
      dataPortabilityEnabled: true,
      rightToErasureEnabled: true,
      consentRequired: true,
      dpoEmail: 'privacy@therabrake.academy',
    },
    pciDss: {
      enabled: true,
      provider: 'stripe',
      saveCardData: false, // Never save card data directly
      tokenizationRequired: true,
    },
  },
  
  // Incident Response
  incidentResponse: {
    enabled: true,
    alertChannels: {
      email: 'security@therabrake.academy',
      slack: process.env.SECURITY_SLACK_WEBHOOK,
      pagerduty: process.env.PAGERDUTY_API_KEY,
    },
    escalationThresholds: {
      critical: 0, // Immediate escalation
      high: 5, // 5 similar events
      medium: 20,
      low: 50,
    },
    autoBlockThreshold: 75, // Risk score threshold for automatic blocking
  },
} as const

/**
 * Get security configuration for specific feature
 */
export function getSecurityConfig<K extends keyof typeof SECURITY_CONFIG>(
  feature: K
): typeof SECURITY_CONFIG[K] {
  return SECURITY_CONFIG[feature]
}

/**
 * Validate security configuration on startup
 */
export function validateSecurityConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check required environment variables
  if (!process.env.ENCRYPTION_KEY) {
    errors.push('ENCRYPTION_KEY environment variable is required')
  }
  
  if (!process.env.ENCRYPTION_SALT) {
    errors.push('ENCRYPTION_SALT environment variable is required')
  }
  
  if (!process.env.HASH_SALT) {
    errors.push('HASH_SALT environment variable is required')
  }
  
  // Validate session timeouts
  if (SECURITY_CONFIG.session.timeoutMinutes > SECURITY_CONFIG.session.maxDurationHours * 60) {
    errors.push('Session timeout cannot exceed max duration')
  }
  
  // Validate rate limits
  if (SECURITY_CONFIG.rateLimit.login.requests > 10) {
    errors.push('Login rate limit is too high (max 10 attempts)')
  }
  
  // Validate file upload size
  if (SECURITY_CONFIG.fileUpload.maxSizeMB > 500) {
    errors.push('File upload size limit is too high (max 500MB)')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}
