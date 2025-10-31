// components/instructor/AffiliateLinksManager.tsx
'use client';

import { useState, useEffect } from 'react';

// TypeScript interfaces
interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
}

interface AffiliateLink {
  id: string;
  unique_code: string;
  link_url: string;
  qr_code_url: string;
  click_count: number;
  conversion_count: number;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export default function AffiliateLinksManager() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAffiliateDashboard();
  }, []);

  const loadAffiliateDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/instructor/affiliate-links');
      
      if (!response.ok) {
        throw new Error(`Failed to load: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStats(data.stats);
      setLinks(data.links);
    } catch (err) {
      setError('Failed to load affiliate dashboard');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    try {
      setGenerating(true);
      
      const response = await fetch('/api/instructor/affiliate-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType: 'platform' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate link');
      }
      
      const data = await response.json();
      
      alert(`✅ Link generated!\n\nCode: ${data.link.unique_code}\nURL: ${data.link.link_url}`);
      
      await loadAffiliateDashboard();
    } catch (err) {
      alert('Failed to generate link. Please try again.');
      console.error('Error generating link:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = (url: string, event: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(url);
    
    const button = event.currentTarget;
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.color = '#10B981';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.color = '';
    }, 2000);
  };

  const handleDownloadQR = (qrUrl: string, code: string) => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `affiliate-qr-${code}.png`;
    link.target = '_blank';
    link.click();
  };

  const handleToggleStatus = async (linkId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/instructor/affiliate-links/${linkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update link');
      }
      
      await loadAffiliateDashboard();
    } catch (err) {
      console.error('Failed to toggle link status:', err);
      alert('Failed to update link status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading affiliate dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={loadAffiliateDashboard}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Links</h1>
          <p className="mt-2 text-gray-600">
            Share your unique links and earn 10% commission on referrals
          </p>
        </div>
        <button
          onClick={handleGenerateLink}
          disabled={generating}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          {generating ? 'Generating...' : '+ New Affiliate Link'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-600 mb-1">Total Clicks</div>
          <div className="text-3xl font-bold text-gray-900">{stats?.totalClicks || 0}</div>
          <div className="text-xs text-gray-500 mt-2">All time</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-600 mb-1">Conversions</div>
          <div className="text-3xl font-bold text-green-600">{stats?.totalConversions || 0}</div>
          <div className="text-xs text-gray-500 mt-2">Successful referrals</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
          <div className="text-3xl font-bold text-blue-600">{stats?.conversionRate || 0}%</div>
          <div className="text-xs text-gray-500 mt-2">Click to conversion</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-600 mb-1">Total Commissions</div>
          <div className="text-3xl font-bold text-green-600">
            ${stats?.totalCommissions?.toFixed(2) || '0.00'}
          </div>
          <div className="text-xs text-gray-500 mt-2">Lifetime earnings</div>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Commission Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600">Pending Payouts</div>
            <div className="text-2xl font-bold text-yellow-600">
              ${stats?.pendingCommissions?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-gray-500 mt-1">Awaiting payment</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Paid Out</div>
            <div className="text-2xl font-bold text-green-600">
              ${stats?.paidCommissions?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-gray-500 mt-1">Total received</div>
          </div>
        </div>
      </div>

      {/* Links Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Your Affiliate Links</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">QR Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="px-2 py-1 bg-blue-50 text-blue-700 text-sm font-mono rounded border border-blue-200">
                      {link.unique_code}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900 truncate max-w-xs" title={link.link_url}>
                        {link.link_url}
                      </span>
                      <button
                        onClick={(e) => handleCopyLink(link.link_url, e)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium whitespace-nowrap transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDownloadQR(link.qr_code_url, link.unique_code)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      📥 Download
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {link.click_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                    {link.conversion_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      link.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {link.is_active ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(link.id, link.is_active)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      {link.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              
              {links.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-1">No affiliate links yet</p>
                        <p className="text-sm text-gray-500">Click "New Affiliate Link" above to create your first one!</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <span>💡</span>
          <span>How It Works</span>
        </h3>
        <ul className="space-y-3 text-blue-800">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 text-xl flex-shrink-0 font-bold">1.</span>
            <span>Share your unique affiliate link on social media, email, or print materials</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 text-xl flex-shrink-0 font-bold">2.</span>
            <span>When someone signs up using your link, they're automatically tracked as your referral</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 text-xl flex-shrink-0 font-bold">3.</span>
            <span>Earn <strong className="text-green-700">10% commission</strong> on all purchases made by your referrals</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 text-xl flex-shrink-0 font-bold">4.</span>
            <span>Download QR codes to add to business cards, flyers, presentations, or office posters</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 text-xl flex-shrink-0 font-bold">5.</span>
            <span>Track clicks and conversions in real-time with detailed analytics on this dashboard</span>
          </li>
        </ul>
      </div>
    </div>
  );
}