import Link from 'next/link'
import { Rocket, Target, Star } from 'lucide-react'

const programs = [
  {
    id: 'so-what',
    title: 'So What Mindset',
    price: 499,
    duration: '12 weeks',
    description: 'Transform your thinking, transform your life',
    features: [
      '12 weekly live group coaching sessions',
      'Personal mindset assessment',
      'Daily mindset exercises',
      'Private community access',
      'Certificate of completion'
    ],
    icon: Target,
    color: 'bg-action'
  },
  {
    id: 'leap-launch',
    title: 'Leap & Launch',
    price: 299,
    duration: '8 weeks',
    description: 'Take the leap into your dream life',
    features: [
      '8 weekly transformation modules',
      'Goal-setting workshop',
      'Action planning templates',
      'Accountability partner matching',
      '30-day post-program support'
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
            Premium Transformation Programs
          </h1>
          <p className="text-lg text-text-secondary">
            Comprehensive programs for life-changing results
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className={`${program.color} p-6 text-white`}>
                <program.icon className="h-12 w-12 mb-4" />
                <h2 className="text-2xl font-bold mb-2">{program.title}</h2>
                <p className="text-white/90">{program.description}</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <span className="text-sm text-text-secondary">Duration: {program.duration}</span>
                  <div className="text-3xl font-bold text-primary mt-2">${program.price}</div>
                </div>
                
                <h3 className="font-semibold text-text-primary mb-3">What's Included:</h3>
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
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-text-secondary mb-4">
            Not sure which program is right for you?
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition"
          >
            Schedule a Free Consultation
          </Link>
        </div>
      </div>
    </div>
  )
}
