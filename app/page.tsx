import Link from 'next/link'
import { ArrowRight, BookOpen, Award, Users, Clock } from 'lucide-react'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to TheraBrake Academy™</h1>
          <p className="text-2xl mb-8">Pause, Process, Progress.</p>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            Learning isn't just about earning credits or ticking boxes—it's about transformation. 
            Whether you're a licensed professional ready to grow your practice or an individual 
            ready to reclaim your life, you'll find a course here designed for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses/professional" className="bg-action hover:bg-action-hover px-8 py-4 rounded-lg text-lg font-semibold transition inline-flex items-center">
              Browse CE Courses <ArrowRight className="ml-2" />
            </Link>
            <Link href="/courses/personal" className="bg-secondary hover:bg-secondary-hover px-8 py-4 rounded-lg text-lg font-semibold transition inline-flex items-center">
              Personal Development <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TheraBrake Academy™?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Dual-Stream Learning</h3>
              <p className="text-text-secondary">Professional CEUs + Personal Development</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Trusted & Accredited</h3>
              <p className="text-text-secondary">Courses that meet state and national requirements</p>
            </div>
            <div className="text-center">
              <div className="bg-accent text-text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Practical & Transformational</h3>
              <p className="text-text-secondary">Step-by-step guidance you can actually apply</p>
            </div>
            <div className="text-center">
              <div className="bg-action text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Learn Your Way</h3>
              <p className="text-text-secondary">Self-paced video lessons and interactive quizzes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Development Section */}
      <section className="bg-background-secondary py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">🎓 For Mental Health Professionals</h2>
          <p className="text-center text-text-secondary mb-12 max-w-3xl mx-auto">
            Earn accredited Continuing Education Units (CEUs) while mastering real-world skills that 
            elevate your career and protect your clients. From Ethics and HIPAA Compliance to 
            Trauma-Informed Care and Telehealth Mastery.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">1-Year CE Membership</h3>
              <p className="text-3xl font-bold text-primary mb-4">$199</p>
              <p className="text-text-secondary mb-4">Access to ALL Professional Development & CEU Courses</p>
              <Link href="/courses/professional" className="text-primary hover:text-primary-hover font-semibold">
                Learn More →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">2-Year CE Membership</h3>
              <p className="text-3xl font-bold text-primary mb-4">$299</p>
              <p className="text-text-secondary mb-4">All CE courses for 24 months + Premium discounts</p>
              <Link href="/courses/professional" className="text-primary hover:text-primary-hover font-semibold">
                Learn More →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-2 border-accent">
              <h3 className="font-semibold mb-2">5-Year CE Membership</h3>
              <p className="text-3xl font-bold text-primary mb-4">$699</p>
              <p className="text-text-secondary mb-4">Complete Professional & Personal Development Access</p>
              <Link href="/courses/professional" className="text-primary hover:text-primary-hover font-semibold">
                Best Value →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Development Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">🌱 For Personal Growth & Healing</h2>
          <p className="text-center text-text-secondary mb-12 max-w-3xl mx-auto">
            Life happens. Betrayal, financial setbacks, relationship struggles, even health crises. 
            But your story isn't over. Discover powerful frameworks to help you pause, process, and 
            progress toward a stronger you.
          </p>
          <div className="text-center">
            <Link href="/courses/personal" className="bg-secondary hover:bg-secondary-hover text-white px-8 py-4 rounded-lg text-lg font-semibold transition inline-flex items-center">
              Visit Personal Development Catalog <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-action to-action-hover text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">🔑 Your Next Step Starts Here</h2>
          <div className="space-y-4 text-lg">
            <p>📚 Browse Our Courses → Find the right program for your needs.</p>
            <p>💻 Enroll Today → Gain instant access to your learning dashboard.</p>
            <p>🎉 Transform Tomorrow → Apply what you learn for real, lasting change.</p>
          </div>
          <div className="mt-8">
            <Link href="/auth/register" className="bg-white text-action hover:bg-background-secondary px-8 py-4 rounded-lg text-lg font-semibold transition">
              Start Your Journey Today
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
