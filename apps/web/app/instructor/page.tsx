import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function InstructorPage() {
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

  if (profile?.role !== 'instructor' && profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get instructor's courses
  const { data: courses, count: courseCount } = await supabase
    .from('courses')
    .select('*, enrollments(count)', { count: 'exact' })
    .eq('instructor_id', user.id)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your courses and students</p>
        </div>

        {/* Instructor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">My Courses</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{courseCount || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">$0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Reviews</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
          </div>
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">My Courses</h2>
            <a 
              href="/instructor/course-builder" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create New Course
            </a>
          </div>
          <div className="p-6">
            {courses && courses.length > 0 ? (
              <div className="space-y-4">
                {courses.map((course: any) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{course.category}</p>
                        {course.ce_hours > 0 && (
                          <p className="text-sm text-green-600 mt-1">CE Hours: {course.ce_hours}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          course.status === 'published' ? 'bg-green-100 text-green-800' : 
                          course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {course.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <a 
                        href={`/instructor/courses/${course.id}/edit`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </a>
                      <span className="text-gray-300">|</span>
                      <a 
                        href={`/courses/${course.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven&apos;t created any courses yet</p>
                <a 
                  href="/instructor/course-builder" 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Your First Course
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
