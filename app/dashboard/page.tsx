import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Award, Clock, TrendingUp, ShoppingCart } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (profile?.role === 'instructor') redirect('/instructor')
  if (profile?.role === 'admin') redirect('/admin')
  
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:courses(id, title, thumbnail_url, ce_hours, instructor_id)
    `)
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false })
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, plan:subscription_plans(*)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()
  
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id)
    .order('issued_date', { ascending: false })
  
  const totalCEHours = certificates?.reduce((sum, cert) => sum + cert.ce_hours, 0) || 0
  const coursesInProgress = enrollments?.filter(e => e.status === 'active' && e.progress < 100).length || 0
  const coursesCompleted = enrollments?.filter(e => e.status === 'completed').length || 0
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name}!</h1>
          <p className="text-gray-600 mt-1">Continue your learning journey</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Courses In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{coursesInProgress}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Courses Completed</p>
                <p className="text-3xl font-bold text-green-600">{coursesCompleted}</p>
              </div>
              <Award className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CE Hours Earned</p>
                <p className="text-3xl font-bold text-yellow-600">{totalCEHours}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certificates</p>
                <p className="text-3xl font-bold text-purple-600">{certificates?.length || 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>
        
        {!subscription && (
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Unlock All Courses with a Membership</h3>
                <p className="text-blue-100">Get unlimited access to all CE courses starting at $199/year</p>
              </div>
              <Link href="/pricing" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                View Plans
              </Link>
            </div>
          </div>
        )}
        
        {subscription && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-900">Active Membership</h3>
                <p className="text-green-700">{subscription.plan?.name} - Renews on {new Date(subscription.current_period_end).toLocaleDateString()}</p>
              </div>
              <Link href="/dashboard/subscription" className="text-green-600 hover:text-green-700 font-medium">Manage Subscription →</Link>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <Link href="/courses" className="text-blue-600 hover:text-blue-700 font-medium">Browse All Courses →</Link>
          </div>
          
          {enrollments && enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {enrollments.slice(0, 6).map((enrollment) => (
                <div key={enrollment.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    {enrollment.course.thumbnail_url ? (
                      <img src={enrollment.course.thumbnail_url} alt={enrollment.course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-sm font-semibold">{Math.round(enrollment.progress)}%</div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{enrollment.course.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{enrollment.course.ce_hours} CE Hours</span>
                      <span className={`px-2 py-1 rounded ${enrollment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {enrollment.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${enrollment.progress}%` }} />
                    </div>
                    <Link href={`/courses/${enrollment.course.id}`} className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      {enrollment.progress > 0 ? 'Continue Learning' : 'Start Course'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">Start learning today by browsing our course catalog</p>
              <Link href="/courses" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Browse Courses</Link>
            </div>
          )}
        </div>
        
        {certificates && certificates.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Certificates</h2>
            <div className="bg-white rounded-lg shadow">
              {certificates.slice(0, 5).map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Award className="w-10 h-10 text-yellow-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Certificate #{cert.certificate_number}</p>
                      <p className="text-sm text-gray-600">{cert.ce_hours} CE Hours • Issued {new Date(cert.issued_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">Download PDF</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
