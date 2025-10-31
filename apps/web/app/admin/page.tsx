import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get statistics
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: totalCourses } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })

  const { count: activeEnrollments } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('full_name, email, role, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System overview and management</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{totalUsers || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{totalCourses || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Enrollments</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{activeEnrollments || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">$0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/admin/users" className="border rounded-lg p-4 hover:bg-gray-50 text-center transition">
              <p className="font-semibold">Manage Users</p>
              <p className="text-sm text-gray-500 mt-1">View and edit user accounts</p>
            </a>
            <a href="/admin/courses" className="border rounded-lg p-4 hover:bg-gray-50 text-center transition">
              <p className="font-semibold">Manage Courses</p>
              <p className="text-sm text-gray-500 mt-1">Edit and publish courses</p>
            </a>
            <a href="/admin/reports" className="border rounded-lg p-4 hover:bg-gray-50 text-center transition">
              <p className="font-semibold">View Reports</p>
              <p className="text-sm text-gray-500 mt-1">Analytics and insights</p>
            </a>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers && recentUsers.map((user: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'instructor' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
