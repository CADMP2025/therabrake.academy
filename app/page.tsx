import Link from 'next/link'
import { ArrowRight, Award, Users, Clock, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transform Your Mind,<br />
            <span className="text-accent">Transform Your Practice</span>
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Texas' premier online learning platform for mental health professionals 
            and individuals seeking personal growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/courses"
              className="bg-accent text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-light transition inline-flex items-center justify-center"
            >
              Browse Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/auth/register"
              className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose TheraBrake Academy?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Texas LPC Approved</h3>
              <p className="text-text-secondary">Earn CE credits approved by the Texas LPC Board</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
              <p className="text-text-secondary">Learn from licensed professionals with years of experience</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Self-Paced Learning</h3>
              <p className="text-text-secondary">Complete courses on your schedule, anywhere</p>
            </div>
            <div className="text-center">
              <Star className="h-12 w-12 text-action mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Programs</h3>
              <p className="text-text-secondary">Transform your life with our signature programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Explore Our Course Categories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-primary p-6">
                <h3 className="text-2xl font-bold text-white">Professional Development</h3>
              </div>
              <div className="p-6">
                <p className="text-text-secondary mb-4">
                  CE credits for Texas LPCs. Build your practice with evidence-based techniques.
                </p>
                <Link href="/courses/professional" className="text-primary hover:underline font-semibold">
                  View Courses →
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-secondary p-6">
                <h3 className="text-2xl font-bold text-white">Personal Growth</h3>
              </div>
              <div className="p-6">
                <p className="text-text-secondary mb-4">
                  Self-help and wellness programs designed for everyone seeking positive change.
                </p>
                <Link href="/courses/personal" className="text-secondary hover:underline font-semibold">
                  View Courses →
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-action p-6">
                <h3 className="text-2xl font-bold text-white">Premium Programs</h3>
              </div>
              <div className="p-6">
                <p className="text-text-secondary mb-4">
                  Comprehensive transformation programs with personalized support.
                </p>
                <Link href="/courses/premium" className="text-action hover:underline font-semibold">
                  View Programs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of mental health professionals and individuals transforming their lives.
          </p>
          <Link 
            href="/auth/register"
            className="bg-accent text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-light transition inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}
