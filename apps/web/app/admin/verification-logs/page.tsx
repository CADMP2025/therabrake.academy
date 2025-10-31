'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

interface VerificationLog {
  id: string;
  verification_code: string;
  ip_address: string;
  user_agent: string | null;
  was_successful: boolean;
  fraud_score: number;
  verified_at: string;
}

interface Stats {
  total_verifications: number;
  successful_verifications: number;
  failed_verifications: number;
  avg_fraud_score: number;
  blocked_attempts: number;
}

export default function VerificationLogsPage() {
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const hoursAgo = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
      const startDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

      const { data: logsData, error: logsError } = await supabase
        .from('certificate_verification_logs')
        .select('*')
        .gte('verified_at', startDate.toISOString())
        .order('verified_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;
      setLogs(logsData || []);

      const totalVerifications = logsData?.length || 0;
      const successfulVerifications = logsData?.filter((log: VerificationLog) => log.was_successful).length || 0;
      const failedVerifications = totalVerifications - successfulVerifications;
      const avgFraudScore = logsData?.length 
        ? logsData.reduce((sum: number, log: VerificationLog) => sum + log.fraud_score, 0) / logsData.length
        : 0;
      const blockedAttempts = logsData?.filter((log: VerificationLog) => log.fraud_score > 75).length || 0;

      setStats({
        total_verifications: totalVerifications,
        successful_verifications: successfulVerifications,
        failed_verifications: failedVerifications,
        avg_fraud_score: Math.round(avgFraudScore * 10) / 10,
        blocked_attempts: blockedAttempts
      });

    } catch (error) {
      console.error('Error loading verification logs:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFraudScoreColor = (score: number) => {
    if (score >= 75) return 'text-red-600 bg-red-100';
    if (score >= 50) return 'text-orange-600 bg-orange-100';
    if (score >= 25) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading verification logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Certificate Verification Logs
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor verification attempts and fraud detection
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Total</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.total_verifications}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Successful</span>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {stats.successful_verifications}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-600">Failed</span>
              </div>
              <p className="text-3xl font-bold text-red-600">
                {stats.failed_verifications}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-600">Avg Fraud Score</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.avg_fraud_score}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-600">Blocked</span>
              </div>
              <p className="text-3xl font-bold text-red-600">
                {stats.blocked_attempts}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Verification Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fraud Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(log.verified_at)}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {log.verification_code.substring(0, 20)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.ip_address}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.was_successful 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.was_successful ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFraudScoreColor(log.fraud_score)}`}>
                        {log.fraud_score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {logs.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No verification logs found for this time range</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
