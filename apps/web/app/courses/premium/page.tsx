import Link from 'next/link'
import { Rocket, Target, Star, Key, Brain } from 'lucide-react'

const programs = [
  {
    id: 'so-what',
    title: 'The So What Mindset',
    price: 499,
    duration: '6-month access',
    description: 'Transformational Thinking and Resilience Training',
    tagline: 'Pause, Process, Progress: Transform Obstacles into Opportunities',
    features: [
      'Revolutionary approach to resilience',
      'Cognitive reframing techniques',
      'Emotional intelligence development',
      'Daily practices and thought exercises',
      'Real-life application strategies',
      'Unshakeable confidence building'
    ],
    icon: Key,
    color: 'bg-action'
  },
  {
    id: 'leap-launch',
    title: 'Leap & Launch!',
    price: 299,
    duration: '6-month access',
    description: 'Flagship Business Development Program',
    tagline: 'Transform Your Counseling Passion into a Thriving Private Practice',
    features: [
      'Complete private practice roadmap',
      'Texas licensing and business requirements',
      'Sustainable fee structure development',
      'Referral network building',
      'Authentic online presence creation',
      'Multiple income stream strategies'
    ],
    icon: Rocket,
    color: 'bg-primary'
  }
]

export default function PremiumProgramsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Star className="h-12 w-12 text-accent mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Premium Standalone Programs
          </h1>
          <p className="text-lg text-text-secondary">
            Comprehensive transformation programs for life-changing results
          </p>
          <p className="text-sm text-action font-semibold mt-2">
            Not included in membership packages
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className={`${program.color} p-6 text-white`}>
                <program.icon className="h-12 w-12 mb-4" />
                <h2 className="text-2xl font-bold mb-2">{program.title}</h2>
                <p className="text-white/90 font-medium">{program.description}</p>
              </div>
              
              <div className="p-6">
                <p className="text-text-secondary mb-6 italic">"{program.tagline}"</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl font-bold text-primary">${program.price}</span>
                    <span className="text-sm text-text-secondary">{program.duration}</span>
                  </div>
                  <p className="text-sm text-secondary font-semibold">
                    Member Discount: $100 off with 2-year+ membership
                  </p>
                </div>
                
                <h3 className="font-semibold text-text-primary mb-3">What You'll Get:</h3>
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-secondary mr-2 mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-text-secondary text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={`/courses/premium/${program.id}`}
                  className={`block text-center py-3 rounded-lg text-white ${program.color} hover:opacity-90 transition`}
                >
                  Learn More & Enroll
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
          <Brain className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-center mb-4">Special Member Pricing</h3>
          <p className="text-center text-text-secondary mb-6">
            Active members with 2-year or 5-year memberships receive $100 off each premium program
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-background-light rounded-lg">
              <p className="font-semibold">The So What Mindset</p>
              <p className="text-lg">Regular: <span className="line-through">$499</span></p>
              <p className="text-xl font-bold text-primary">Member Price: $399</p>
            </div>
            <div className="text-center p-4 bg-background-light rounded-lg">
              <p className="font-semibold">Leap & Launch!</p>
              <p className="text-lg">Regular: <span className="line-through">$299</span></p>
              <p className="text-xl font-bold text-primary">Member Price: $199</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-text-secondary mb-4">
            Not sure which program is right for you?
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition font-semibold"
          >
            Schedule a Free Consultation
          </Link>
        </div>
      </div>
    </div>
  )
}
