# Security & Compliance System Documentation

## Overview
Comprehensive security implementation for TheraBrake Academy covering authentication, authorization, data protection, compliance (FERPA, GDPR, PCI DSS), and monitoring.

## Table of Contents
1. [Access Control](#access-control)
2. [Data Protection](#data-protection)
3. [Monitoring & Logging](#monitoring--logging)
4. [Compliance](#compliance)
5. [Security Configuration](#security-configuration)
6. [Testing](#testing)
7. [Incident Response](#incident-response)

---

## Access Control

### Session Management
- **Timeout**: 30 minutes of inactivity
- **Max Duration**: 12 hours absolute limit
- **MFA Required**: Admin and Instructor roles
- **Geographic Restrictions**: OFAC sanctioned countries blocked

```typescript
import { enforceSessionSecurity } from '@/lib/security/session-manager'

// In API routes
const security = await enforceSessionSecurity(request, requireMFA)
if (!security.allowed) {
  return Response.json({ error: security.reason }, { status: 403 })
}
```

### Role-Based Access Control (RBAC)
- **Roles**: admin, instructor, student
- **Route Protection**: Middleware enforces role requirements
- **API Authorization**: Role checks on sensitive endpoints

### Rate Limiting
- Anonymous: 10 requests/minute
- Authenticated: 100 requests/minute
- Admin: 1000 requests/minute
- Login: 5 attempts per 5 minutes (30min block)

---

## Data Protection

### Field-Level Encryption
Sensitive PII is encrypted at rest using AES-256-GCM:

```typescript
import { encryptField, decryptField, maskSSN } from '@/lib/security/encryption'

// Encrypt before storage
const encrypted = encryptField(ssn)

// Decrypt for authorized use
const decrypted = decryptField(encrypted)

// Mask for display
const masked = maskSSN(ssn) // "***-**-1234"
```

### Sensitive Fields
- **User**: SSN, tax ID, date of birth
- **Payment**: Card number (tokenized via Stripe), CVV
- **Contact**: Phone, emergency contacts
- **Educational**: Grades, test scores, disciplinary records

### Key Rotation
- Automated 90-day rotation schedule
- Zero-downtime re-encryption
- Tracking via `encryption_keys` table

---

## Monitoring & Logging

### Audit Logging
Comprehensive logging with 7-year retention:

```typescript
import { logAuditEvent, logAuthEvent, logDataAccess } from '@/lib/security/audit-logger'

// Authentication events
await logAuthEvent('login', userId, request, true)

// Data access (FERPA compliance)
await logDataAccess(
  instructorId,
  'instructor',
  studentId,
  'educational_record',
  'view',
  request
)

// Payment events (PCI DSS compliance)
await logPaymentEvent(userId, paymentId, amount, 'completed', request)
```

### Event Types
- Authentication (login, logout, failed attempts)
- Authorization (role changes, permission changes)
- Data Access (PII, educational records, exports)
- Security (violations, suspicious activity)
- Compliance (GDPR requests, FERPA access)
- Administrative (admin actions, user management)

### Anomaly Detection
Automated detection of suspicious patterns:
- 5+ failed logins in 24 hours
- Activity from 3+ IP addresses
- Access from 2+ countries
- 50+ data access events
- After-hours activity (10 PM - 6 AM)

Risk scores calculated automatically; scores >50 trigger alerts.

---

## Compliance

### FERPA (Family Educational Rights and Privacy Act)
- **Educational Records**: Grades, test scores, certificates, attendance
- **Access Logging**: All access to student records logged
- **Retention**: 4-year minimum (1460 days)
- **Consent**: Required for third-party disclosure

### GDPR (General Data Protection Regulation)
- **Right to Access**: Users can export all their data
- **Right to Erasure**: Deletion workflows implemented
- **Data Portability**: JSON export format
- **Consent Management**: Explicit consent tracking
- **DPO Contact**: privacy@therabrake.academy

### PCI DSS (Payment Card Industry Data Security Standard)
- **Tokenization**: All payments via Stripe (Level 1 PCI DSS)
- **No Card Storage**: Never store card numbers or CVV
- **Payment Logging**: 7-year retention for fraud prevention
- **Secure Transmission**: TLS 1.3 enforced

### Data Retention Policy
| Data Type | Retention | Purge Method |
|-----------|-----------|--------------|
| Educational Records | 4 years | Archive |
| Audit Logs | 7 years | Archive |
| Payment Records | 7 years | Archive |
| Certificates | 10 years | Archive |
| User Activity | 2 years | Anonymize |
| Marketing Data | 3 years | Delete |

---

## Security Configuration

### Environment Variables Required
```bash
# Encryption
ENCRYPTION_KEY=<base64-encoded-32-byte-key>
ENCRYPTION_SALT=<base64-encoded-64-byte-salt>
HASH_SALT=<base64-encoded-salt>
ANALYTICS_SALT=<base64-encoded-salt>

# MFA (optional)
TWILIO_ACCOUNT_SID=<for SMS MFA>
TWILIO_AUTH_TOKEN=<for SMS MFA>

# Monitoring (optional)
SECURITY_SLACK_WEBHOOK=<for alerts>
PAGERDUTY_API_KEY=<for critical alerts>
```

### Generate Keys
```bash
npm run security:generate-keys
```

### Validate Configuration
```bash
npm run security:validate
```

---

## Testing

### Security Test Suite
Comprehensive security tests in `tests/e2e/security.spec.ts`:

```bash
# Run full security test suite
npm run test:security

# Run specific security tests
npm run test:e2e -- --grep "Security: Authentication"
npm run test:e2e -- --grep "Security: Authorization"
npm run test:e2e -- --grep "Security: XSS"
```

### Route Security Audit
```bash
# Audit all routes for proper protection
npm run security:audit

# Output:
# - Total routes
# - Protected vs public
# - Unprotected routes (security risks)
# - Missing role checks
# - Missing rate limits
# - Recommendations
```

### Penetration Testing
Regular third-party penetration testing recommended:
- Authentication/Authorization bypass attempts
- SQL injection testing
- XSS vulnerability scanning
- CSRF protection validation
- Rate limiting verification

---

## Incident Response

### Severity Levels
- **Critical**: Immediate escalation (data breach, active attack)
- **High**: <1 hour response (unauthorized access, security violation)
- **Medium**: <4 hours response (suspicious activity, anomalies)
- **Low**: <24 hours response (configuration issues, warnings)

### Alert Channels
1. **Email**: security@therabrake.academy
2. **Slack**: Security channel webhook
3. **PagerDuty**: On-call rotation for critical alerts

### Automatic Actions
- **Risk Score >75**: Temporary account suspension
- **5+ Failed Logins**: 30-minute IP block
- **Geographic Violation**: Immediate session termination
- **Session Hijack Detection**: Force re-authentication

### Incident Workflow
1. **Detection**: Automated monitoring triggers alert
2. **Assessment**: Security team evaluates severity
3. **Containment**: Block malicious activity
4. **Investigation**: Review audit logs, identify scope
5. **Remediation**: Fix vulnerabilities, restore service
6. **Documentation**: Complete incident report
7. **Post-Mortem**: Identify improvements

---

## API Reference

### Session Security
```typescript
import {
  checkSessionStatus,
  updateLastActivity,
  enforceSessionSecurity,
  clearSession,
} from '@/lib/security/session-manager'
```

### Encryption
```typescript
import {
  encryptField,
  decryptField,
  encryptObject,
  decryptObject,
  maskSSN,
  maskEmail,
  maskPhone,
  anonymizeForAnalytics,
} from '@/lib/security/encryption'
```

### Audit Logging
```typescript
import {
  logAuditEvent,
  logAuthEvent,
  logDataAccess,
  logPaymentEvent,
  logSecurityEvent,
  logAdminAction,
  queryAuditLogs,
  generateComplianceReport,
  detectAnomalies,
} from '@/lib/security/audit-logger'
```

### Route Audit
```typescript
import {
  auditRouteSecurity,
  printAuditReport,
} from '@/lib/security/route-audit'
```

---

## Compliance Reporting

### Generate Reports
```typescript
import { generateComplianceReport } from '@/lib/security/audit-logger'

// FERPA Compliance Report
const report = await generateComplianceReport(
  new Date('2024-01-01'),
  new Date('2024-12-31'),
  'ferpa'
)

// GDPR Compliance Report
const report = await generateComplianceReport(
  new Date('2024-01-01'),
  new Date('2024-12-31'),
  'gdpr'
)
```

### Compliance Dashboard
Access at `/admin/compliance`:
- Real-time compliance metrics
- Audit log summary
- Data access reports
- Pending compliance requests
- Retention policy status

---

## Best Practices

### For Developers
1. **Always use audit logging** for sensitive operations
2. **Encrypt PII** before storage
3. **Validate role permissions** in API routes
4. **Rate limit** all public endpoints
5. **Sanitize user input** to prevent XSS/injection
6. **Use prepared statements** for database queries
7. **Never log sensitive data** in plain text

### For Administrators
1. **Review audit logs** weekly
2. **Monitor anomaly alerts** daily
3. **Run security audits** before deployments
4. **Rotate encryption keys** every 90 days
5. **Process compliance requests** within 30 days
6. **Test incident response** quarterly
7. **Update security policies** annually

---

## Support & Resources

- **Security Issues**: security@therabrake.academy
- **Compliance Questions**: privacy@therabrake.academy
- **Documentation**: https://docs.therabrake.academy/security
- **Bug Bounty**: https://therabrake.academy/security/bounty

---

## Changelog

### 2025-01-30 - Initial Security System
- ✅ Session timeout enforcement (30 min)
- ✅ MFA for admin/instructor roles
- ✅ Geographic restrictions (OFAC compliance)
- ✅ Field-level PII encryption
- ✅ Comprehensive audit logging (7-year retention)
- ✅ Anomaly detection system
- ✅ FERPA, GDPR, PCI DSS compliance
- ✅ Security testing suite
- ✅ Route security audit tool
- ✅ Incident response workflows
