import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Book, Video, FileText, Rocket, Target, DollarSign, Users, Clock, Award, Star, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Leap & Launch - Build Your Private Practice | TheraBrake Academy',
  description: 'Transform your clinical skills into a thriving private practice with our comprehensive $299 program.'
}

export default function LeapAndLaunchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container-therabrake">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Rocket className="w-5 h-5" />
              <span className="font-semibold">Premium Program</span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Rocket className="w-10 h-10 md:w-12 md:h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Leap & Launch!</h1>
            </div>
            <h2 className="text-2xl md:text-3xl mb-6">Build Your Private Practice with Confidence</h2>
            <p className="text-xl mb-8">Are you ready to transform your clinical skills into a thriving, sustainable private practice? <strong>Leap & Launch!</strong> is a comprehensive step-by-step program designed exclusively for mental health professionals who want to take control of their careers, serve their clients with excellence, and achieve financial independence.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="bg-white/20 px-6 py-3 rounded-lg">
                <span className="text-3xl font-bold">$299.00</span>
                <span className="text-lg ml-2">One-Time Payment</span>
              </div>
              <Link href="/checkout/leap-launch" className="bg-action hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2">
                Enroll Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container-therabrake">
          <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark">What's Included in Your Success Toolkit</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Book className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-semibold">Workbook</h3>
              </div>
              <p className="text-neutral-medium">A guided implementation journal packed with checklists, templates, and worksheets to keep you on track.</p>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-8 h-8 text-secondary" />
                <h3 className="text-xl font-semibold">Video Course</h3>
              </div>
              <p className="text-neutral-medium">Learn directly through engaging, easy-to-follow modules that bring the material to life.</p>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-accent" />
                <h3 className="text-xl font-semibold">PDF Downloads</h3>
              </div>
              <p className="text-neutral-medium">Essential forms, trackers, and policy templates you can adapt immediately for your practice.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container-therabrake">
          <h2 className="text-3xl font-bold text-center mb-4 text-neutral-dark">What You'll Learn</h2>
          <p className="text-center text-lg text-neutral-medium mb-12 max-w-3xl mx-auto">Across 10 power-packed modules, you'll discover how to:</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Decide & Design</h3>
                <p className="text-neutral-medium">Your practice blueprint — entity type, niche, and vision</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CheckCircle className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Navigate Compliance</h3>
                <p className="text-neutral-medium">Insurance, HIPAA, and credentialing with clarity and confidence</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Clock className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Optimize Workflows</h3>
                <p className="text-neutral-medium">Set up EMRs and workflows that save you time and reduce burnout</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <DollarSign className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Master Billing</h3>
                <p className="text-neutral-medium">Claims, coding, and billing so you keep more of what you earn</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Choose Your Space</h3>
                <p className="text-neutral-medium">Virtual, physical, or hybrid with financial and safety planning</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Rocket className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Build Marketing</h3>
                <p className="text-neutral-medium">A marketing engine that attracts your ideal clients authentically</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Award className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Money Mastery</h3>
                <p className="text-neutral-medium">Pricing strategies, budgets, and tax planning for profitability</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Star className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Scale Systems</h3>
                <p className="text-neutral-medium">Grow and sustain your practice without losing balance</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container-therabrake">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-neutral-dark">Why Take This Course?</h2>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-xl">
              <p className="text-lg text-neutral-dark mb-6">Most graduate programs teach you to be a great clinician, but not how to be a confident business owner. This course closes that gap—combining <strong>clinical ethics with practical business strategies</strong> so you can launch with less stress and more certainty.</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-neutral-dark">A 30-day action plan for opening your doors</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-neutral-dark">Ready-to-use policies, marketing scripts, and financial calculators</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-neutral-dark">Confidence in building a practice that reflects both your <strong>professional purpose</strong> and <strong>personal freedom</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container-therabrake">
          <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark">Who It's For</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Newly Licensed</h3>
              <p className="text-neutral-medium">Counselors, social workers, or psychologists ready to start private practice</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Agency Clinicians</h3>
              <p className="text-neutral-medium">Professionals in agency or group settings dreaming of independence</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-10 h-10 text-action" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Established Providers</h3>
              <p className="text-neutral-medium">Looking to restructure, scale, or streamline their practice</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-r from-action to-orange-600 text-white">
        <div className="container-therabrake text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="w-10 h-10 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold">Your clients are waiting. Your practice is possible. Your leap starts here.</h2>
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Get instant access to the workbook, video modules, and downloadable practice resources that will transform your career.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/checkout/leap-launch" className="bg-white text-action hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2">
              Enroll Today for $299.00 <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/courses" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-action px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              Browse All Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
