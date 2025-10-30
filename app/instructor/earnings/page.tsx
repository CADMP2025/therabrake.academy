'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { DollarSign, Clock, TrendingUp, Users, Download } from 'lucide-react'

interface EarningsData {
  totalEarnings: number
  pendingPayouts: number
  thisMonthEarnings: number
  totalStudents: number
  transactions: Transaction[]
}

interface Transaction {
  id: string
  course_title: string
  amount: number
  student_name: string
  date: string
  status: string
}

function StatsCard({ title, value, icon: Icon, trend }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="text-2xl font-bold">${value.toFixed(2)}</div>
      {trend && (
        <p className="text-xs text-gray-500 mt-1 flex items-center">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {trend}
        </p>
      )}
    </div>
  )
}

export default function InstructorEarningsPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const supabase = createClientComponentClient()

  const loadEarningsData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setEarnings({
        totalEarnings: 0,
        pendingPayouts: 0,
        thisMonthEarnings: 0,
        totalStudents: 0,
        transactions: []
      })
    } catch (error) {
      console.error('Error loading earnings:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadEarningsData()
  }, [loadEarningsData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Earnings & Payouts</h1>
        <p className="text-gray-600 mt-2">Track your course revenue and manage payouts</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Earnings"
          value={earnings?.totalEarnings || 0}
          icon={DollarSign}
          trend="+12% from last month"
        />
        <StatsCard
          title="Pending Payouts"
          value={earnings?.pendingPayouts || 0}
          icon={Clock}
        />
        <StatsCard
          title="This Month"
          value={earnings?.thisMonthEarnings || 0}
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Students"
          value={earnings?.totalStudents || 0}
          icon={Users}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex gap-2 px-6">
            {['overview', 'transactions', 'payouts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                {earnings?.transactions && earnings.transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Course</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Student</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {earnings.transactions.slice(0, 10).map((transaction) => (
                          <tr key={transaction.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{transaction.course_title}</td>
                            <td className="px-4 py-3">{transaction.student_name}</td>
                            <td className="px-4 py-3">${transaction.amount.toFixed(2)}</td>
                            <td className="px-4 py-3 text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No transactions yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">All Transactions</h3>
              <p className="text-gray-600">Full transaction history coming soon...</p>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Payout History</h3>
              <p className="text-gray-600">Payout management coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
