import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Star, Filter } from 'lucide-react'

export default async function CoursesPage() {
  const supabase = await createClient()
  
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:profiles!courses_instructor_id_fkey(full_name),
      enrollments(count),
      course_reviews(rating)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  let userEnrollments = []
  if (user) {
    const { data: enrollments } = await supabase.from('enrollments').select('course_id').eq('user_id', user.id)
    userEnrollments = enrollments?.map(e => e.course_id) || []
  }
  
  const coursesWithRatings = courses?.map(course => ({
    ...course,
    averageRating: course.course_reviews?.length ? course.course_reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / course.course_reviews.length : 0,
    enrollmentCount: course.enrollments?.[0]?.count || 0,
    isEnrolled: userEnrollments.includes(course.id)
  }))
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Our Courses</h1>
          <p className="text-xl text-blue-100 max-w-2xl">Texas LPC-Approved Continuing Education • 30+ CE Hours Available</p>
        </div>
      </div>
      
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4 items-center">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Filter className="w-4 h-4" />
              All Categories
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {coursesWithRatings && coursesWithRatings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coursesWithRatings.map((course) => (
              <Link href={`/courses/${course.id}`} key={course.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-green-500">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  {course.ce_hours > 0 && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">{course.ce_hours} CE Hours</div>
                  )}
                  {course.isEnrolled && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">✓ Enrolled</div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.short_description || course.description}</p>
                  <p className="text-sm text-gray-600 mb-3">By {course.instructor?.full_name || 'TheraBrake Academy'}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{course.averageRating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.enrollmentCount} students</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${course.price.toFixed(2)}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-semibold ${course.isEnrolled ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white group-hover:bg-blue-700'}`}>
                      {course.isEnrolled ? 'Continue' : 'Enroll Now'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses available yet</h3>
            <p className="text-gray-600">Check back soon for new continuing education courses</p>
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Save with an Annual Membership</h2>
          <p className="text-xl text-blue-100 mb-6">Unlimited access to all CE courses starting at $199/year</p>
          <Link href="/pricing" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors">View Membership Plans</Link>
        </div>
      </div>
    </div>
  )
}
