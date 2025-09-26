import Link from 'next/link'
import { Rocket, CheckCircle, Zap, Heart } from 'lucide-react'

export default function LeapAndLaunchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Rocket className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-text-primary mb-4">
            Leap & Launch
          </h1>
          <p className="text-xl text-text-secondary">
            Take the Leap Into Your Dream Life
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Program Overview</h2>
          <p className="text-text-secondary mb-4">
            Leap & Launch is an intensive 8-week transformation program designed for individuals 
            ready to make significant life changes. Whether you're changing careers, starting a 
            business, or pursuing a long-held dream, this program provides the structure, support, 
            and strategies you need to succeed.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="flex items-start">
              <Zap className="h-6 w-6 text-primary mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-text-primary">8 Weeks</h3>
                <p className="text-text-secondary">Fast-track transformation</p>
              </div>
            </div>
            <div className="flex items-start">
              <Heart className="h-6 w-6 text-primary mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-text-primary">Personalized Support</h3>
                <p className="text-text-secondary">Accountability partner matching</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-text-primary mb-4">Program Modules</h3>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-secondary mr-3 mt-1" />
              <span className="text-text-secondary">Week 1-2: Vision Clarity & Goal Setting</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-secondary mr-3 mt-1" />
              <span className="text-text-secondary">Week 3-4: Overcoming Obstacles & Fear</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-secondary mr-3 mt-1" />
              <span className="text-text-secondary">Week 5-6: Building Your Action Plan</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-secondary mr-3 mt-1" />
              <span className="text-text-secondary">Week 7-8: Launch & Momentum Building</span>
            </li>
          </ul>
          
          <div className="bg-primary/10 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-primary mb-2">$299</div>
            <p className="text-text-secondary mb-4">One-time payment • 30-day post-program support</p>
            <Link 
              href="/checkout?program=leap-launch"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition"
            >
              Start Your Journey
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
