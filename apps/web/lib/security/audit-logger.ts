/**
 * Comprehensive Audit Logging System
 * 7-year retention, full compliance tracking
 */

import { createClient } from '@/lib/supabase/server'
import { anonymizeForAnalytics } from './encryption'

export type AuditEventType =
  | 'user_login'
  | 'user_logout'
  | 'user_register'
  | 'user_delete'
  | 'password_change'
  | 'password_reset_request'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'mfa_challenge_success'
  | 'mfa_challenge_failed'
  | 'role_change'
  | 'permission_change'
  | 'data_access'
  | 'data_modification'
  | 'data_deletion'
  | 'data_export'
  | 'pii_access'
  | 'educational_record_access'
  | 'payment_initiated'
  | 'payment_completed'
  | 'payment_failed'
  | 'payment_refunded'
  | 'certificate_issued'
  | 'certificate_revoked'
  | 'certificate_downloaded'
  | 'enrollment_created'
  | 'enrollment_cancelled'
  | 'course_access'
  | 'quiz_attempt'
  | 'grade_change'
  | 'file_upload'
  | 'file_download'
  | 'file_deletion'
  | 'admin_action'
  | 'security_violation'
  | 'suspicious_activity'
  | 'failed_login'
  | 'rate_limit_exceeded'
  | 'unauthorized_access_attempt'
  | 'session_timeout'
  | 'session_hijack_detected'
  | 'compliance_report_generated'
  | 'gdpr_request'
  | 'ferpa_request'

export interface AuditLogEntry {
  event_type: AuditEventType
  actor_id?: string // User who performed the action
  actor_role?: string
  actor_ip?: string
  actor_user_agent?: string
  target_id?: string // User/resource affected
  target_type?: string // 'user', 'enrollment', 'payment', etc.
  action: string // Human-readable description
  resource_type?: string
  resource_id?: string
  changes?: Record<string, { old: any; new: any }>
  metadata?: Record<string, any>
  severity: 'info' | 'warning' | 'error' | 'critical'
  success: boolean
  error_message?: string
  request_id?: string
  session_id?: string
  country_code?: string
  anonymized_actor_id?: string // For analytics
}

/**
 * Log audit event
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = await createClient()
    
    // Anonymize actor ID for analytics
    const anonymizedActorId = entry.actor_id
      ? anonymizeForAnalytics(entry.actor_id)
      : undefined
    
    // Insert audit log
    const { error } = await supabase.from('audit_logs').insert({
      event_type: entry.event_type,
      actor_id: entry.actor_id,
      actor_role: entry.actor_role,
      actor_ip: entry.actor_ip,
      actor_user_agent: entry.actor_user_agent,
      target_id: entry.target_id,
      target_type: entry.target_type,
      action: entry.action,
      resource_type: entry.resource_type,
      resource_id: entry.resource_id,
      changes: entry.changes,
      metadata: entry.metadata,
      severity: entry.severity,
      success: entry.success,
      error_message: entry.error_message,
      request_id: entry.request_id,
      session_id: entry.session_id,
      country_code: entry.country_code,
      anonymized_actor_id: anonymizedActorId,
      created_at: new Date().toISOString(),
    })
    
    if (error) {
      console.error('Failed to log audit event:', error)
    }
    
    // If critical, also log to external system
    if (entry.severity === 'critical') {
      await logToCriticalAlertSystem(entry)
    }
  } catch (error) {
    console.error('Audit logging error:', error)
    // Don't throw - logging failures shouldn't break the application
  }
}

/**
 * Log authentication event
 */
export async function logAuthEvent(
  type: 'login' | 'logout' | 'register' | 'failed_login' | 'mfa_challenge',
  userId: string | undefined,
  request: Request,
  success: boolean,
  details?: Record<string, any>
): Promise<void> {
  const eventTypeMap = {
    login: 'user_login',
    logout: 'user_logout',
    register: 'user_register',
    failed_login: 'failed_login',
    mfa_challenge: 'mfa_challenge_success',
  } as const
  
  await logAuditEvent({
    event_type: eventTypeMap[type],
    actor_id: userId,
    actor_ip: request.headers.get('x-forwarded-for') || undefined,
    actor_user_agent: request.headers.get('user-agent') || undefined,
    action: `User ${type}`,
    severity: success ? 'info' : 'warning',
    success,
    metadata: details,
    country_code: request.headers.get('cf-ipcountry') || undefined,
  })
}

/**
 * Log data access event (FERPA compliance)
 */
export async function logDataAccess(
  actorId: string,
  actorRole: string,
  targetUserId: string,
  dataType: 'educational_record' | 'pii' | 'payment' | 'medical',
  action: 'view' | 'download' | 'export',
  request: Request,
  metadata?: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    event_type: dataType === 'educational_record' ? 'educational_record_access' : 'pii_access',
    actor_id: actorId,
    actor_role: actorRole,
    actor_ip: request.headers.get('x-forwarded-for') || undefined,
    actor_user_agent: request.headers.get('user-agent') || undefined,
    target_id: targetUserId,
    target_type: 'user',
    action: `${action} ${dataType}`,
    resource_type: dataType,
    severity: 'info',
    success: true,
    metadata,
  })
}

/**
 * Log payment event (PCI DSS compliance)
 */
export async function logPaymentEvent(
  userId: string,
  paymentId: string,
  amount: number,
  status: 'initiated' | 'completed' | 'failed' | 'refunded',
  request: Request,
  details?: Record<string, any>
): Promise<void> {
  const eventTypeMap = {
    initiated: 'payment_initiated',
    completed: 'payment_completed',
    failed: 'payment_failed',
    refunded: 'payment_refunded',
  } as const
  
  await logAuditEvent({
    event_type: eventTypeMap[status],
    actor_id: userId,
    actor_ip: request.headers.get('x-forwarded-for') || undefined,
    actor_user_agent: request.headers.get('user-agent') || undefined,
    resource_type: 'payment',
    resource_id: paymentId,
    action: `Payment ${status}`,
    severity: status === 'failed' ? 'warning' : 'info',
    success: status !== 'failed',
    metadata: {
      amount,
      currency: 'USD',
      ...details,
    },
  })
}

/**
 * Log security event
 */
export async function logSecurityEvent(
  type: 'violation' | 'suspicious_activity' | 'unauthorized_access' | 'session_hijack',
  userId: string | undefined,
  request: Request,
  details: Record<string, any>
): Promise<void> {
  const eventTypeMap = {
    violation: 'security_violation',
    suspicious_activity: 'suspicious_activity',
    unauthorized_access: 'unauthorized_access_attempt',
    session_hijack: 'session_hijack_detected',
  } as const
  
  await logAuditEvent({
    event_type: eventTypeMap[type],
    actor_id: userId,
    actor_ip: request.headers.get('x-forwarded-for') || undefined,
    actor_user_agent: request.headers.get('user-agent') || undefined,
    action: `Security: ${type}`,
    severity: type === 'session_hijack' ? 'critical' : 'warning',
    success: false,
    metadata: details,
  })
}

/**
 * Log administrative action
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  targetUserId: string | undefined,
  changes: Record<string, { old: any; new: any }> | undefined,
  request: Request
): Promise<void> {
  await logAuditEvent({
    event_type: 'admin_action',
    actor_id: adminId,
    actor_role: 'admin',
    actor_ip: request.headers.get('x-forwarded-for') || undefined,
    actor_user_agent: request.headers.get('user-agent') || undefined,
    target_id: targetUserId,
    action,
    changes,
    severity: 'info',
    success: true,
  })
}

/**
 * Query audit logs with filters
 */
export async function queryAuditLogs(filters: {
  actorId?: string
  targetId?: string
  eventTypes?: AuditEventType[]
  severity?: ('info' | 'warning' | 'error' | 'critical')[]
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}): Promise<AuditLogEntry[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (filters.actorId) {
    query = query.eq('actor_id', filters.actorId)
  }
  
  if (filters.targetId) {
    query = query.eq('target_id', filters.targetId)
  }
  
  if (filters.eventTypes && filters.eventTypes.length > 0) {
    query = query.in('event_type', filters.eventTypes)
  }
  
  if (filters.severity && filters.severity.length > 0) {
    query = query.in('severity', filters.severity)
  }
  
  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate.toISOString())
  }
  
  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate.toISOString())
  }
  
  if (filters.limit) {
    query = query.limit(filters.limit)
  }
  
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 100) - 1)
  }
  
  const { data, error } = await query
  
  if (error) {
    throw new Error(`Failed to query audit logs: ${error.message}`)
  }
  
  return data as AuditLogEntry[]
}

/**
 * Generate compliance report
 */
export async function generateComplianceReport(
  startDate: Date,
  endDate: Date,
  reportType: 'ferpa' | 'gdpr' | 'pci_dss' | 'all'
): Promise<{
  period: { start: Date; end: Date }
  totalEvents: number
  eventsByType: Record<string, number>
  securityIncidents: number
  dataAccesses: number
  failedLogins: number
  summary: string[]
}> {
  const supabase = await createClient()
  
  // Get relevant event types based on report type
  const eventTypeFilters: Record<string, AuditEventType[]> = {
    ferpa: ['educational_record_access', 'data_access', 'data_export', 'gdpr_request', 'ferpa_request'],
    gdpr: ['user_register', 'user_delete', 'data_export', 'gdpr_request', 'pii_access'],
    pci_dss: ['payment_initiated', 'payment_completed', 'payment_failed', 'payment_refunded'],
    all: [], // All event types
  }
  
  const eventTypes = reportType === 'all' ? undefined : eventTypeFilters[reportType]
  
  // Query audit logs
  const logs = await queryAuditLogs({
    eventTypes,
    startDate,
    endDate,
    limit: 10000,
  })
  
  // Aggregate data
  const eventsByType: Record<string, number> = {}
  let securityIncidents = 0
  let dataAccesses = 0
  let failedLogins = 0
  
  for (const log of logs) {
    eventsByType[log.event_type] = (eventsByType[log.event_type] || 0) + 1
    
    if (['security_violation', 'suspicious_activity', 'unauthorized_access_attempt'].includes(log.event_type)) {
      securityIncidents++
    }
    
    if (['educational_record_access', 'pii_access', 'data_access'].includes(log.event_type)) {
      dataAccesses++
    }
    
    if (log.event_type === 'failed_login') {
      failedLogins++
    }
  }
  
  // Generate summary
  const summary: string[] = [
    `Total events logged: ${logs.length}`,
    `Security incidents: ${securityIncidents}`,
    `Data access events: ${dataAccesses}`,
    `Failed login attempts: ${failedLogins}`,
    `Unique event types: ${Object.keys(eventsByType).length}`,
  ]
  
  return {
    period: { start: startDate, end: endDate },
    totalEvents: logs.length,
    eventsByType,
    securityIncidents,
    dataAccesses,
    failedLogins,
    summary,
  }
}

/**
 * Log to critical alert system (external monitoring)
 */
async function logToCriticalAlertSystem(entry: AuditLogEntry): Promise<void> {
  // In production, this would send to external monitoring (e.g., Sentry, DataDog)
  console.error('CRITICAL SECURITY EVENT:', {
    type: entry.event_type,
    action: entry.action,
    actor: entry.actor_id,
    timestamp: new Date().toISOString(),
    details: entry.metadata,
  })
  
  // TODO: Integrate with external alerting system
  // - Send to Sentry
  // - Trigger PagerDuty alert
  // - Send email to security team
  // - Post to Slack security channel
}

/**
 * Detect anomalies in audit logs
 */
export async function detectAnomalies(userId: string): Promise<{
  isAnomalous: boolean
  reasons: string[]
  riskScore: number
}> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const logs = await queryAuditLogs({
    actorId: userId,
    startDate: oneDayAgo,
    limit: 1000,
  })
  
  const reasons: string[] = []
  let riskScore = 0
  
  // Check for excessive failed logins
  const failedLogins = logs.filter(l => l.event_type === 'failed_login').length
  if (failedLogins > 5) {
    reasons.push(`${failedLogins} failed login attempts in 24 hours`)
    riskScore += 30
  }
  
  // Check for multiple IP addresses
  const uniqueIPs = new Set(logs.map(l => l.actor_ip).filter(Boolean))
  if (uniqueIPs.size > 3) {
    reasons.push(`Activity from ${uniqueIPs.size} different IP addresses`)
    riskScore += 20
  }
  
  // Check for geographic anomalies
  const uniqueCountries = new Set(logs.map(l => l.country_code).filter(Boolean))
  if (uniqueCountries.size > 2) {
    reasons.push(`Activity from ${uniqueCountries.size} different countries`)
    riskScore += 40
  }
  
  // Check for rapid data access
  const dataAccessEvents = logs.filter(l => ['educational_record_access', 'pii_access'].includes(l.event_type))
  if (dataAccessEvents.length > 50) {
    reasons.push(`${dataAccessEvents.length} data access events in 24 hours`)
    riskScore += 50
  }
  
  // Check for after-hours activity (10 PM - 6 AM)
  const afterHoursActivity = logs.filter(l => {
    const hour = new Date(l.metadata?.timestamp || Date.now()).getHours()
    return hour >= 22 || hour < 6
  })
  if (afterHoursActivity.length > 10) {
    reasons.push(`${afterHoursActivity.length} after-hours activities`)
    riskScore += 15
  }
  
  return {
    isAnomalous: riskScore > 50,
    reasons,
    riskScore: Math.min(riskScore, 100),
  }
}
