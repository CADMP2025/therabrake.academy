import Link from 'next/link'
import { Target, Calendar, Users, Trophy } from 'lucide-react'

export default function SoWhatMindsetPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-action/10 to-accent/10 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Target className="h-16 w-16 text-action mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-text-primary mb-4">
            So What Mindset
          </h1>
          <p className="text-xl text-text-secondary">
            Transform Your Thinking, Transform Your Life
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Program Overview</h2>
          <p className="text-text-secondary mb-4">
            The So What Mindset is a revolutionary 12-week program designed to help you break free 
            from limiting beliefs and develop an unstoppable mindset. Through proven psychological 
            techniques and practical exercises, you'll learn to overcome obstacles, embrace challenges, 
            and achieve your full potential.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="flex items-start">
              <Calendar className="h-6 w-6 text-action mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-text-primary">12 Weeks</h3>
                <p className="text-text-secondary">Comprehensive transformation journey</p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="h-6 w-6 text-action mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-text-primary">Group Coaching</h3>
                <p className="text-text-secondary">Weekly live sessions with peers</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-text-primary mb-4">What You'll Learn</h3>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <Trophy className="h-5 w-5 text-secondary mr-3 mt-1" />
              <span className="text-text-secondary">Identify and overcome limiting beliefs</span>
            </li>
            <li className="flex items-start">
              <Trophy className="h-5 w-5 text-secondary mr-3 mt-1" />
              <span className="text-text-secondary">Develop resilience and emotional intelligence</span>
            </li>
            <li className="flex items-start">
              <Trophy className="h-5 w-5 text-secondary mr-3 mt-1" />
              <span className="text-text-secondary">Master goal-setting and achievement strategies</span>
            </li>
            <li className="flex items-start">
              <Trophy className="h-5 w-5 text-secondary mr-3 mt-1" />
              <span className="text-text-secondary">Build unshakeable confidence and self-worth</span>
            </li>
          </ul>
          
          <div className="bg-action/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-action mb-2">$499</div>
            <p className="text-text-secondary mb-4">One-time payment • Lifetime access to materials</p>
            <Link 
              href="/checkout?program=so-what-mindset"
              className="inline-block bg-action text-white px-8 py-3 rounded-lg hover:bg-action/90 transition"
            >
              Enroll Now
            </Link>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/courses/premium" className="text-primary hover:underline">
            ← Back to Premium Programs
          </Link>
        </div>
      </div>
    </div>
  )
}
