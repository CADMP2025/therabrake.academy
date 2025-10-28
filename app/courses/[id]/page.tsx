import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Clock, Award, Star, CheckCircle, Play } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:profiles!courses_instructor_id_fkey(id, full_name, bio, avatar_url),
      modules:course_modules(
        id, title, description, order_index,
        lessons:lessons(id, title, content_type, duration, position, is_preview)
      ),
      course_reviews(rating, title, review, created_at, user:profiles(full_name))
    `)
    .eq('id', params.id)
    .single()
  
  if (error || !course) notFound()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  let enrollment = null
  let hasActiveSubscription = false
  
  if (user) {
    const { data: enrollmentData } = await supabase.from('enrollments').select('*').eq('user_id', user.id).eq('course_id', course.id).single()
    enrollment = enrollmentData
    
    const { data: subscription } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single()
    hasActiveSubscription = !!subscription
  }
  
  const isEnrolled = !!enrollment || hasActiveSubscription
  const averageRating = course.course_reviews?.length ? course.course_reviews.reduce((sum: number, r) => sum + r.rating, 0) / course.course_reviews.length : 0
  const totalLessons = course.modules?.reduce((sum: number, m) => sum + (m.lessons?.length || 0), 0) || 0
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{course.short_description || course.description}</p>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="text-blue-200">({course.course_reviews?.length || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>{course.ce_hours} CE Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{totalLessons} Lessons</span>
                </div>
              </div>
              
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {course.instructor?.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-blue-200">Instructor</p>
                  <p className="font-semibold">{course.instructor?.full_name}</p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-gray-900 sticky top-4">
                {isEnrolled ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-center font-semibold text-green-900">You're enrolled!</p>
                    </div>
                    <Link href={`/learn/${course.id}`} className="block w-full bg-blue-600 text-white text-center py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      <Play className="w-5 h-5 inline mr-2" />
                      Start Learning
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600 mb-2">Course Price</p>
                      <p className="text-4xl font-bold">${course.price.toFixed(2)}</p>
                    </div>
                    {user ? (
                      <form action="/api/stripe/create-checkout" method="POST">
                        <input type="hidden" name="courseId" value={course.id} />
                        <input type="hidden" name="userId" value={user.id} />
                        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4">
                          Enroll Now
                        </button>
                      </form>
                    ) : (
                      <Link href="/auth/register" className="block w-full bg-blue-600 text-white text-center py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4">
                        Create Account to Enroll
                      </Link>
                    )}
                    <p className="text-xs text-center text-gray-500">30-day money-back guarantee</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
