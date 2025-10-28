import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Star, Clock, Award, DollarSign, Target, Rocket } from 'lucide-react'

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
  
  let userEnrollments: string[] = []
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

  const premiumPrograms = [
    {
      title: "So What Mindset",
      price: "$499",
      description: "Transform your mindset and overcome limiting beliefs",
      link: "/courses/so-what-mindset",
      icon: Target,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Leap & Launch",
      price: "$299",
      description: "Build your private practice with confidence",
      link: "/courses/leap-launch",
      icon: Rocket,
      color: "from-[#3B82F6] to-[#10B981]"
    }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3B82F6] to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Transform Your Practice & Your Life
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/95">
            Choose from Texas-approved CE courses, personal development programs, 
            and premium transformation packages designed for mental health professionals.
          </p>
        </div>
      </section>

      {/* Premium Programs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#3B82F6]">✨ Premium Programs</h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            Comprehensive transformation programs with workbooks, videos, and lifetime support
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {premiumPrograms.map((program, index) => {
              const Icon = program.icon
              return (
                <Link key={index} href={program.link}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer h-full">
                    <div className={`h-2 bg-gradient-to-r ${program.color} rounded-t-lg`} />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-10 h-10 text-[#3B82F6]" />
                        <span className="text-2xl font-bold text-[#F97316]">{program.price}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{program.title}</h3>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">5.0 (200+ reviews)</span>
                      </div>
                      <span className="text-[#3B82F6] font-semibold hover:text-blue-700">
                        Learn More →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CE Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#3B82F6]">📚 Texas LPC-Approved CE Courses</h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            Individual courses at $9.99 per CE hour or get unlimited access with membership
          </p>
          
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
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#3B82F6]">Save with an Annual Membership</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Unlimited access to all CE courses starting at $199/year. Join thousands of mental health professionals.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center bg-[#3B82F6] hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              View Membership Plans
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white font-semibold text-lg px-8 py-3 rounded-lg transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
