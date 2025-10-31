import { Metadata } from 'next'
import Link from 'next/link'
import { Brain, Video, BookOpen, Mic, CheckCircle, Target, Zap, Shield, Eye, Clock, Rocket, Star, ArrowRight, Heart, TrendingUp } from 'lucide-react'
import AuthenticatedEnrollButton from '@/components/enrollment/AuthenticatedEnrollButton'

export const metadata: Metadata = {
  title: 'So What Mindset™ - Turn Setbacks Into Superpowers | TheraBrake Academy',
  description: 'Transform your struggles into strengths with our $499 mindset transformation program.'
}

export default function SoWhatMindsetPage() {
  const pillars = [
    { number: 1, title: "So What to the Past", description: "Your past shapes you, but it doesn't define you.", icon: Clock },
    { number: 2, title: "So What to Fear of Failure", description: "Every setback is preparation for your next success.", icon: Shield },
    { number: 3, title: "So What to Opinions", description: "Stop letting critics rent space in your mind.", icon: Eye },
    { number: 4, title: "So What to Limitations", description: "The labels others give you are not your limits.", icon: Target },
    { number: 5, title: "So What to Waiting", description: "Stop postponing your dreams and start creating momentum today.", icon: Rocket }
  ]
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container-therabrake">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">Premium Transformation Program</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">🧠 The So What Mindset™</h1>
            <h2 className="text-2xl md:text-3xl mb-6">Turning Setbacks Into Superpowers</h2>
            <p className="text-xl mb-8">We've all faced rejection, failure, or setbacks that tried to define us. The difference between those who rise and those who stay stuck comes down to two simple words: <strong className="text-accent">So What.</strong></p>
            <p className="text-lg mb-8">The <strong>So What Mindset™</strong> is more than a course—it's a movement. Built from years of counseling, coaching, and speaking, this program helps you reframe your struggles into strengths and turn obstacles into opportunities.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="bg-white/20 px-6 py-3 rounded-lg">
                <span className="text-3xl font-bold">$499.00</span>
                <span className="text-lg ml-2">Complete Program</span>
              </div>
              <AuthenticatedEnrollButton
                programType="SO_WHAT_MINDSET"
                productType="premium"
                price={499}
                className="bg-accent hover:bg-yellow-500 text-neutral-dark px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
              >
                Start Your Transformation <ArrowRight className="w-5 h-5" />
              </AuthenticatedEnrollButton>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container-therabrake">
          <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark">Your Multi-Format Experience</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-8 h-8 text-purple-500" />
                <h3 className="text-xl font-semibold">Video Course Modules</h3>
              </div>
              <p className="text-neutral-medium">Engaging, story-driven lessons that break down the 5 Pillars of the So What Framework.</p>
            </div>
            <div className="card hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-indigo-500" />
                <h3 className="text-xl font-semibold">Workbook + Journal</h3>
              </div>
              <p className="text-neutral-medium">Reflection prompts, exercises, and a 30-day challenge to help you put the mindset into practice every day.</p>
            </div>
            <div className="card hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Mic className="w-8 h-8 text-pink-500" />
                <h3 className="text-xl font-semibold">Keynote Access</h3>
              </div>
              <p className="text-neutral-medium">Experience the So What Mindset live through speaking engagements for schools, corporations, and conferences.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="container-therabrake">
          <h2 className="text-3xl font-bold text-center mb-4 text-neutral-dark">The 5 Pillars of the So What Mindset</h2>
          <p className="text-center text-lg text-neutral-medium mb-12 max-w-3xl mx-auto">Through these transformative pillars, you'll discover how to:</p>
          <div className="max-w-4xl mx-auto space-y-6">
            {pillars.map((pillar) => (
              <div key={pillar.number} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-purple-600">{pillar.number}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <pillar.icon className="w-6 h-6 text-purple-500" />
                      <h3 className="text-xl font-bold">Say {pillar.title}</h3>
                    </div>
                    <p className="text-neutral-medium text-lg">{pillar.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container-therabrake">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-neutral-dark">Why This Program Works</h2>
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-8 rounded-xl">
              <p className="text-lg text-neutral-dark mb-6">Unlike "feel-good" motivation that fades after a few days, the So What Mindset combines:</p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-dark">Practical tools</strong>
                    <p className="text-neutral-medium">You can use right away (goal-setting systems, fear reframing exercises, resilience strategies)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-dark">Daily journaling prompts</strong>
                    <p className="text-neutral-medium">That help you build new mental habits and track your transformation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-dark">Real stories and real steps</strong>
                    <p className="text-neutral-medium">That show you how to bounce back stronger, no matter your starting point</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container-therabrake">
          <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark">Who It's For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Professionals</h3>
              <p className="text-neutral-medium text-sm">Stuck in self-doubt or career ceilings</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Entrepreneurs</h3>
              <p className="text-neutral-medium text-sm">Leaders facing constant setbacks</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Individuals</h3>
              <p className="text-neutral-medium text-sm">Students, veterans, and everyday people</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Dream Chasers</h3>
              <p className="text-neutral-medium text-sm">Ready to step into full potential</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container-therabrake text-center">
          <div className="max-w-3xl mx-auto">
            <Star className="w-12 h-12 mx-auto mb-6 text-accent" />
            <blockquote className="text-2xl md:text-3xl font-bold mb-6">"Your scars aren't proof of your weakness—they're proof that you survived. And your comeback will be proof that you can thrive."</blockquote>
            <p className="text-lg opacity-90">- The So What Mindset™ Philosophy</p>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container-therabrake text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-dark">Ready to Say "So What" to Everything Holding You Back?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-neutral-medium">Join thousands who have transformed their setbacks into comebacks. Your breakthrough is just two words away.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <AuthenticatedEnrollButton
              programType="SO_WHAT_MINDSET"
              productType="premium"
              price={499}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-lg"
            >
              Enroll Today for $499.00 <ArrowRight className="w-5 h-5" />
            </AuthenticatedEnrollButton>
            <Link href="/courses" className="bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              Explore Other Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
