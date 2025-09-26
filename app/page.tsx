import { Hero } from '@/components/ui/Hero'
import { FeaturedCourses } from '@/components/course/FeaturedCourses'
import { GraduationCap, Award, Clock, Users } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Hero />
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Texas LPC Approved</h3>
              <p className="text-gray-600 text-sm">All courses meet Texas state requirements for continuing education</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Instant Certificates</h3>
              <p className="text-gray-600 text-sm">Download your CE certificate immediately upon course completion</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Learn at Your Pace</h3>
              <p className="text-gray-600 text-sm">Complete courses on your schedule with lifetime access</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-action/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-action" />
              </div>
              <h3 className="font-semibold mb-2">Expert Instructors</h3>
              <p className="text-gray-600 text-sm">Learn from experienced mental health professionals</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedCourses />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Ready to Advance Your Practice?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of mental health professionals earning CE credits with TheraBrake Academy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-secondary">
              Start Your Journey
            </Link>
            <Link href="/courses" className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
