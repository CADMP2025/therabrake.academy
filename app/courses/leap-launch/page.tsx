import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Book, Video, FileText, Rocket, Target, DollarSign, Users, Clock, Award, Star, ArrowRight } from 'lucide-react'
import AuthenticatedEnrollButton from '@/components/enrollment/AuthenticatedEnrollButton'

export const metadata: Metadata = {
  title: 'Leap & Launch - Build Your Private Practice | TheraBrake Academy',
  description: 'Transform your clinical skills into a thriving private practice with our comprehensive $299 program.'
}

export default function LeapAndLaunchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section - UPDATED COLORS */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
        <div className="container-therabrake">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Rocket className="w-5 h-5" />
              <span className="font-semibold">Premium Program</span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Rocket className="w-10 h-10 md:w-12 md:h-12" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">Leap & Launch!</h1>
            </div>
            <h2 className="text-2xl md:text-3xl mb-6 text-white">Build Your Private Practice with Confidence</h2>
            <p className="text-xl mb-8 text-white/95">
              Are you ready to transform your clinical skills into a thriving, sustainable private practice? 
              <strong> Leap & Launch!</strong> is a comprehensive step-by-step program designed exclusively 
              for mental health professionals who want to take control of their careers, serve their clients 
              with excellence, and achieve financial independence.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="bg-white/20 px-6 py-3 rounded-lg">
                <span className="text-3xl font-bold text-white">$299.00</span>
                <span className="text-lg ml-2 text-white">One-Time Payment</span>
              </div>
              <AuthenticatedEnrollButton
                programType="LEAP_AND_LAUNCH"
                productType="premium"
                price={299}
                className="bg-action hover:bg-action-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
              >
                Enroll Now <ArrowRight className="w-5 h-5" />
              </AuthenticatedEnrollButton>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16">
        <div className="container-therabrake">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">What's Included in Your Success Toolkit</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Book className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-semibold text-text-primary">Workbook</h3>
              </div>
              <p className="text-text-primary">A guided implementation journal packed with checklists, templates, and worksheets to keep you on track.</p>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-8 h-8 text-secondary" />
                <h3 className="text-xl font-semibold text-text-primary">Video Course</h3>
              </div>
              <p className="text-text-primary">Learn directly through engaging, easy-to-follow modules that bring the material to life.</p>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-accent" />
                <h3 className="text-xl font-semibold text-text-primary">PDF Downloads</h3>
              </div>
              <p className="text-text-primary">Essential forms, trackers, and policy templates you can adapt immediately for your practice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-therabrake">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary">What You'll Learn</h2>
          <p className="text-center text-lg text-text-primary mb-12 max-w-3xl mx-auto">Across 10 power-packed modules, you'll discover how to:</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-text-primary">Decide & Design</h3>
                <p className="text-text-primary">Your practice blueprint — entity type, niche, and vision</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CheckCircle className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-text-primary">Navigate Compliance</h3>
                <p className="text-text-primary">Insurance, HIPAA, and credentialing with clarity and confidence</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Clock className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-text-primary">Optimize Workflows</h3>
                <p className="text-text-primary">Set up EMRs and workflows that save you time and reduce burnout</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <DollarSign className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-text-primary">Master Billing</h3>
                <p className="text-text-primary">Claims, coding, and billing so you keep more of what you earn</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-text-primary">Choose Your Space</h3>
                <p className="text-text-primary">Virtual, physical, or hybrid with financial and safety planning</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Rocket className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-text-primary">Build Marketing</h3>
                <p className="text-text-primary">A marketing engine that attracts your ideal clients authentically</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Award className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-text-primary">Money Mastery</h3>
                <p className="text-text-primary">Pricing strategies, budgets, and tax planning for profitability</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Star className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-text-primary">Scale Systems</h3>
                <p className="text-text-primary">Grow and sustain your practice without losing balance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Course Section */}
      <section className="py-16">
        <div className="container-therabrake">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">Why Take This Course?</h2>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-xl">
              <p className="text-lg text-text-primary mb-6">
                Most graduate programs teach you to be a great clinician, but not how to be a confident business owner. 
                This course closes that gap—combining <strong>clinical ethics with practical business strategies</strong> so 
                you can launch with less stress and more certainty.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-text-primary">A 30-day action plan for opening your doors</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-text-primary">Ready-to-use policies, marketing scripts, and financial calculators</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-text-primary">
                    Confidence in building a practice that reflects both your <strong>professional purpose</strong> and <strong>personal freedom</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-therabrake">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Who It's For</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-text-primary">Newly Licensed</h3>
              <p className="text-text-primary">Counselors, social workers, or psychologists ready to start private practice</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-text-primary">Agency Clinicians</h3>
              <p className="text-text-primary">Professionals in agency or group settings dreaming of independence</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-10 h-10 text-action" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-text-primary">Established Providers</h3>
              <p className="text-text-primary">Looking to restructure, scale, or streamline their practice</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary to-secondary-dark text-white">
        <div className="container-therabrake text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="w-10 h-10 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Your clients are waiting. Your practice is possible. Your leap starts here.</h2>
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/95">
            Get instant access to the workbook, video modules, and downloadable practice resources that will transform your career.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <AuthenticatedEnrollButton
              programType="LEAP_AND_LAUNCH"
              productType="premium"
              price={299}
              className="bg-white text-secondary hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              Enroll Today for $299.00 <ArrowRight className="w-5 h-5" />
            </AuthenticatedEnrollButton>
            <Link 
              href="/courses" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-secondary px-8 py-4 rounded-lg font-semibold text-lg transition-all"
            >
              Browse All Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}