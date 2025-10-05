/**
 * Security Incident Response System
 * Handles security events, breaches, and compliance notifications
 */

import { createClient } from '@/lib/supabase/client';

export enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum IncidentType {
  DATA_BREACH = 'data_breach',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  PAYMENT_FRAUD = 'payment_fraud',
  SYSTEM_COMPROMISE = 'system_compromise',
  DDOS_ATTACK = 'ddos_attack',
  MALWARE = 'malware',
  FAILED_LOGIN_ATTEMPTS = 'failed_login_attempts'
}

export interface SecurityIncident {
  id?: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  detectedAt: Date;
  affectedUsers?: string[];
  affectedData?: string[];
  ipAddress?: string;
  userAgent?: string;
  containedAt?: Date;
  resolvedAt?: Date;
  notifiedAt?: Date;
}

export class IncidentResponseSystem {
  private static supabase = createClient();

  /**
   * Log security incident
   */
  static async logIncident(incident: SecurityIncident): Promise<string> {
    const { data, error } = await this.supabase
      .from('security_incidents')
      .insert({
        type: incident.type,
        severity: incident.severity,
        description: incident.description,
        detected_at: incident.detectedAt,
        affected_users: incident.affectedUsers,
        affected_data: incident.affectedData,
        ip_address: incident.ipAddress,
        user_agent: incident.userAgent,
        status: 'detected'
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to log incident:', error);
      // Fallback to file logging if database fails
      await this.fallbackLogging(incident);
    }

    // Immediate notification for critical incidents
    if (incident.severity === IncidentSeverity.CRITICAL) {
      await this.notifySecurityTeam(incident);
    }

    return data?.id || 'fallback-' + Date.now();
  }

  /**
   * Handle data breach - CCPA requires notification within 72 hours
   */
  static async handleDataBreach(incident: SecurityIncident): Promise<void> {
    // 1. Log the incident
    const incidentId = await this.logIncident(incident);

    // 2. Immediate containment
    await this.containThreat(incident);

    // 3. Assess affected users
    const affectedUsers = incident.affectedUsers || [];

    // 4. Notify affected users (CCPA/GDPR requirement)
    if (affectedUsers.length > 0) {
      await this.notifyAffectedUsers(affectedUsers, incident);
    }

    // 5. Check if Texas LPC notification required
    if (incident.affectedData?.includes('ce_records')) {
      await this.notifyTexasLPC(incident);
    }

    // 6. Create incident report
    await this.createIncidentReport(incidentId, incident);
  }

  /**
   * Notify affected users of security incident
   */
  private static async notifyAffectedUsers(
    userIds: string[],
    incident: SecurityIncident
  ): Promise<void> {
    const notificationDeadline = new Date(incident.detectedAt);
    notificationDeadline.setHours(notificationDeadline.getHours() + 72); // 72-hour CCPA requirement

    for (const userId of userIds) {
      // Send email notification
      await fetch('/api/notifications/security-breach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          incidentType: incident.type,
          severity: incident.severity,
          description: incident.description,
          detectedAt: incident.detectedAt,
          actionsRequired: this.getRequiredUserActions(incident)
        })
      });
    }

    // Update incident with notification timestamp
    await this.supabase
      .from('security_incidents')
      .update({ notified_at: new Date() })
      .eq('type', incident.type)
      .eq('detected_at', incident.detectedAt);
  }

  /**
   * Notify Texas LPC board if CE records affected
   */
  private static async notifyTexasLPC(incident: SecurityIncident): Promise<void> {
    const reportData = {
      incident_type: incident.type,
      severity: incident.severity,
      affected_records: incident.affectedData,
      detected_at: incident.detectedAt,
      containment_status: 'in_progress',
      contact: 'security@therabrake.academy'
    };

    // Log notification attempt
    console.log('Texas LPC Breach Notification:', reportData);
    
    // In production, send actual notification to Texas LPC board
    // await sendTexasLPCNotification(reportData);
  }

  /**
   * Contain security threat
   */
  private static async containThreat(incident: SecurityIncident): Promise<void> {
    switch (incident.type) {
      case IncidentType.UNAUTHORIZED_ACCESS:
        // Revoke all sessions for affected users
        if (incident.affectedUsers) {
          for (const userId of incident.affectedUsers) {
            await this.supabase.auth.admin.signOut(userId);
          }
        }
        break;

      case IncidentType.PAYMENT_FRAUD:
        // Disable payment processing temporarily
        // await this.disablePayments();
        break;

      case IncidentType.DDOS_ATTACK:
        // Enable rate limiting, block IPs
        // await this.enableDDoSProtection();
        break;
    }

    await this.supabase
      .from('security_incidents')
      .update({ contained_at: new Date() })
      .eq('type', incident.type)
      .eq('detected_at', incident.detectedAt);
  }

  /**
   * Get required user actions based on incident
   */
  private static getRequiredUserActions(incident: SecurityIncident): string[] {
    const actions: string[] = [];

    switch (incident.type) {
      case IncidentType.DATA_BREACH:
        actions.push('Change your password immediately');
        actions.push('Enable multi-factor authentication');
        actions.push('Review recent account activity');
        break;

      case IncidentType.PAYMENT_FRAUD:
        actions.push('Review recent payment transactions');
        actions.push('Contact your bank if unauthorized charges detected');
        actions.push('Update payment method');
        break;

      case IncidentType.UNAUTHORIZED_ACCESS:
        actions.push('Change password immediately');
        actions.push('Review account access logs');
        actions.push('Enable MFA');
        break;
    }

    return actions;
  }

  /**
   * Notify security team
   */
  private static async notifySecurityTeam(incident: SecurityIncident): Promise<void> {
    // Send to security team email/Slack
    console.error('🚨 CRITICAL SECURITY INCIDENT:', incident);
    
    // In production, send actual notifications
    // await sendSlackAlert(incident);
    // await sendEmailAlert('security@therabrake.academy', incident);
  }

  /**
   * Fallback logging if database unavailable
   */
  private static async fallbackLogging(incident: SecurityIncident): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...incident
    };
    
    console.error('SECURITY INCIDENT (Fallback Log):', JSON.stringify(logEntry, null, 2));
    
    // In production, write to file system or external logging service
  }

  /**
   * Create incident report
   */
  private static async createIncidentReport(
    incidentId: string,
    incident: SecurityIncident
  ): Promise<void> {
    const report = {
      incident_id: incidentId,
      report_date: new Date(),
      summary: incident.description,
      timeline: {
        detected: incident.detectedAt,
        contained: incident.containedAt,
        resolved: incident.resolvedAt,
        notified: incident.notifiedAt
      },
      affected_users_count: incident.affectedUsers?.length || 0,
      affected_data: incident.affectedData,
      remediation_steps: this.getRequiredUserActions(incident)
    };

    // Store report
    await this.supabase
      .from('incident_reports')
      .insert(report);
  }
}

/**
 * Security monitoring helpers
 */
export class SecurityMonitoring {
  /**
   * Detect suspicious login patterns
   */
  static async detectSuspiciousLogin(
    userId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<boolean> {
    const supabase = createClient();

    // Check for rapid login attempts from different IPs
    const { data: recentLogins } = await supabase
      .from('audit_logs')
      .select('user_ip, created_at')
      .eq('event_type', 'login')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentLogins && recentLogins.length >= 5) {
      const uniqueIPs = new Set(recentLogins.map(l => l.user_ip));
      if (uniqueIPs.size >= 3) {
        // Multiple IPs in short time - suspicious
        await IncidentResponseSystem.logIncident({
          type: IncidentType.UNAUTHORIZED_ACCESS,
          severity: IncidentSeverity.HIGH,
          description: 'Suspicious login pattern detected - multiple IPs',
          detectedAt: new Date(),
          affectedUsers: [userId],
          ipAddress
        });
        return true;
      }
    }

    return false;
  }

  /**
   * Detect impossible travel (login from distant locations too quickly)
   */
  static async detectImpossibleTravel(
    userId: string,
    currentLocation: string
  ): Promise<boolean> {
    // Implementation would check geographic distance vs time
    // For now, return false
    return false;
  }
}
