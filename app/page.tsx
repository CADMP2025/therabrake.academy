import Link from 'next/link'
import { ArrowRight, Award, Users, Clock, Star, BookOpen, Brain, Heart, Rocket } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to TheraBrake Academy™
          </h1>
          <p className="text-2xl mb-4 text-accent font-semibold">
            Pause, Process, Progress.
          </p>
          <p className="text-lg mb-8 text-white/90 max-w-3xl mx-auto">
            At <strong>TheraBrake Academy™</strong>, learning isn't just about earning credits or ticking boxes—it's about transformation. 
            Whether you're a licensed professional ready to grow your practice or an individual ready to reclaim your life, 
            you'll find a course here designed for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/courses"
              className="bg-action text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-action-dark transition inline-flex items-center justify-center"
            >
              Browse Our Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/auth/register"
              className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Enroll Today
            </Link>
          </div>
        </div>
      </section>

      {/* Professional Development Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Award className="h-10 w-10 text-primary mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">For Mental Health Professionals</h2>
            </div>
            <p className="text-lg text-text-secondary mb-6">
              Earn accredited <strong>Continuing Education Units (CEUs)</strong> while mastering real-world skills that elevate 
              your career and protect your clients. From <strong>Ethics and HIPAA Compliance</strong> to <strong>Trauma-Informed 
              Care</strong> and <strong>Telehealth Mastery</strong>, our courses are built to keep you compliant, confident, and competitive.
            </p>
            <Link 
              href="/courses/professional"
              className="inline-flex items-center text-primary hover:text-primary-dark font-semibold text-lg transition"
            >
              Explore our Professional Development Catalog
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Personal Growth Section */}
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Heart className="h-10 w-10 text-secondary mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">For Personal Growth & Healing</h2>
            </div>
            <p className="text-lg text-text-secondary mb-6">
              Life happens. Betrayal, financial setbacks, relationship struggles, even health crises. But your story isn't over. 
              With courses like <strong>Healing Forward</strong>, <strong>Rebuilding After Betrayal</strong>, 
              <strong>Finding the Perfect Match</strong>, and <strong>Cancer Diagnosis: It's Not the End…</strong>, 
              you'll discover powerful frameworks to help you pause, process, and progress toward a stronger you.
            </p>
            <Link 
              href="/courses/personal"
              className="inline-flex items-center text-secondary hover:text-secondary-dark font-semibold text-lg transition"
            >
              Visit our Personal Development Catalog
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-text-primary">
            Why Choose TheraBrake Academy™?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition bg-background">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Dual-Stream Learning</h3>
              <p className="text-text-secondary">Professional CEUs + Personal Development</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition bg-background">
              <Award className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Trusted & Accredited</h3>
              <p className="text-text-secondary">Courses that meet state and national requirements</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition bg-background">
              <Rocket className="h-12 w-12 text-action mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Practical & Transformational</h3>
              <p className="text-text-secondary">Step-by-step guidance you can actually apply</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition bg-background">
              <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Learn Your Way</h3>
              <p className="text-text-secondary">Self-paced video lessons, interactive quizzes, and downloadable workbooks</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition bg-background">
              <Star className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Certificates You Can Share</h3>
              <p className="text-text-secondary">Celebrate your progress and add credibility to your career</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition bg-background">
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Expert Support</h3>
              <p className="text-text-secondary">Learn from licensed professionals with years of experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your Next Step Starts Here
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
            <div>
              <p className="text-lg font-semibold mb-2">Browse Our Courses</p>
              <p className="text-white/90">Find the right program for your needs</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Enroll Today</p>
              <p className="text-white/90">Gain instant access to your learning dashboard</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Transform Tomorrow</p>
              <p className="text-white/90">Apply what you learn for real, lasting change</p>
            </div>
          </div>
          <p className="text-xl mb-8 font-semibold">
            TheraBrake Academy™ isn't just another online school—it's where education meets empowerment.
          </p>
          <Link 
            href="/auth/register"
            className="bg-accent text-text-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-accent-light transition inline-block"
          >
            Start Your Journey Today
          </Link>
        </div>
      </section>
    </div>
  )
}
