#!/bin/bash
# Phase 2: Early Growth Security Implementation

echo "📈 Starting Phase 2 Security Implementation..."
echo "=============================================="

# 1. Enhanced session security
cat > lib/security/session-security.ts << 'EOFSESSION'
/**
 * Enhanced Session Security
 * Device fingerprinting and anomaly detection
 */

export interface DeviceFingerprint {
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  hash: string;
}

export class SessionSecurity {
  /**
   * Generate device fingerprint
   */
  static generateFingerprint(): DeviceFingerprint {
    if (typeof window === 'undefined') {
      return {
        userAgent: 'server',
        screenResolution: 'unknown',
        timezone: 'unknown',
        language: 'unknown',
        platform: 'server',
        hash: 'server'
      };
    }

    const fingerprint = {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      hash: ''
    };

    // Generate hash
    const fingerprintString = JSON.stringify(fingerprint);
    fingerprint.hash = this.hashString(fingerprintString);

    return fingerprint;
  }

  /**
   * Simple hash function
   */
  private static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Validate session security
   */
  static async validateSession(
    sessionId: string,
    currentFingerprint: DeviceFingerprint
  ): Promise<{ valid: boolean; reason?: string }> {
    // Check if fingerprint matches stored fingerprint
    const storedFingerprint = sessionStorage.getItem(`fp_${sessionId}`);
    
    if (!storedFingerprint) {
      return { valid: true }; // First login
    }

    if (storedFingerprint !== currentFingerprint.hash) {
      return {
        valid: false,
        reason: 'Device fingerprint mismatch - possible session hijacking'
      };
    }

    return { valid: true };
  }

  /**
   * Store device fingerprint
   */
  static storeFingerprint(sessionId: string, fingerprint: DeviceFingerprint): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`fp_${sessionId}`, fingerprint.hash);
    }
  }
}
EOFSESSION

# 2. Dependency scanning configuration
cat > .github/dependabot.yml << 'EOFDEP'
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "your-github-username"
    labels:
      - "dependencies"
      - "security"
    # Auto-merge security patches
    auto-merge:
      enabled: true
      update-types:
        - "security"
EOFDEP

# 3. Security monitoring dashboard
cat > components/admin/SecurityDashboard.tsx << 'EOFSDASH'
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SecurityMetrics {
  failedLogins: number;
  activeIncidents: number;
  suspiciousActivity: number;
  recentAudits: any[];
}

export default function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    failedLogins: 0,
    activeIncidents: 0,
    suspiciousActivity: 0,
    recentAudits: []
  });

  const supabase = createClient();

  useEffect(() => {
    loadSecurityMetrics();
  }, []);

  async function loadSecurityMetrics() {
    // Get failed login attempts (last 24 hours)
    const { count: failedLogins } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'login')
      .eq('new_data->success', false)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // Get active security incidents
    const { count: activeIncidents } = await supabase
      .from('security_incidents')
      .select('*', { count: 'exact', head: true })
      .in('status', ['detected', 'contained']);

    // Get recent critical audit logs
    const { data: recentAudits } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('security_level', 'critical')
      .order('created_at', { ascending: false })
      .limit(10);

    setMetrics({
      failedLogins: failedLogins || 0,
      activeIncidents: activeIncidents || 0,
      suspiciousActivity: 0,
      recentAudits: recentAudits || []
    });
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Security Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Failed Logins (24h)</h3>
          <p className="text-3xl font-bold mt-2">{metrics.failedLogins}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Incidents</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">{metrics.activeIncidents}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Suspicious Activity</h3>
          <p className="text-3xl font-bold mt-2">{metrics.suspiciousActivity}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Critical Events</h3>
        <div className="space-y-2">
          {metrics.recentAudits.map((audit) => (
            <div key={audit.id} className="border-b pb-2">
              <div className="flex justify-between">
                <span className="font-medium">{audit.event_type}</span>
                <span className="text-sm text-gray-500">
                  {new Date(audit.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">{audit.table_name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
EOFSDASH

echo "✅ Phase 2 files created"
echo ""
echo "📦 Next steps:"
echo "1. Enable GitHub Dependabot (automatic security updates)"
echo "2. Add Security Dashboard to admin panel:"
echo "   Import SecurityDashboard in app/admin/page.tsx"
echo "3. Monitor security metrics weekly"
