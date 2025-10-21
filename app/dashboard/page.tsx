import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, email')
    .eq('id', user.id)
    .single()

  const { data: enrollments, count: enrollmentCount } = await supabase
    .from('enrollments')
    .select('*, courses(title, category, ce_hours)', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('status', 'active')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile?.full_name}!</h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Enrolled Courses</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{enrollmentCount || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">CE Hours Earned</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Certificates</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
          </div>
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">My Courses</h2>
          </div>
          <div className="p-6">
            {enrollments && enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment: any) => (
                  <div key={enrollment.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                    <h3 className="font-semibold text-lg mb-2">{enrollment.courses?.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Category: {enrollment.courses?.category}</p>
                    {enrollment.courses?.ce_hours > 0 && (
                      <p className="text-sm text-green-600 mb-4">CE Hours: {enrollment.courses?.ce_hours}</p>
                    )}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${enrollment.progress || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{enrollment.progress || 0}% Complete</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven&apos;t enrolled in any courses yet</p>
                <a href="/courses" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Browse Courses
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
