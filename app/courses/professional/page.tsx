import Link from 'next/link'
import { Clock, Award, DollarSign, Brain, Shield, Monitor, Scale, FileText, AlertCircle } from 'lucide-react'

const courses = [
  {
    id: 'trauma-informed-telehealth',
    title: 'Building a Trauma-Informed Practice & Telehealth',
    hours: 6,
    price: 59.99,
    description: 'Transform Your Practice for the Modern Era',
    icon: Brain
  },
  {
    id: 'cultural-diversity',
    title: 'Cultural Diversity in Texas Counseling Practice',
    hours: 3,
    price: 29.99,
    description: 'Serve Every Texan with Cultural Competence',
    icon: Award
  },
  {
    id: 'ethics-counselors',
    title: 'Ethics for Professional Counselors',
    hours: 6,
    price: 59.99,
    description: 'Navigate Ethical Challenges with Clarity and Confidence',
    icon: Scale
  },
  {
    id: 'regulating-storm',
    title: 'Regulating the Storm: Trauma, Anger, and the Brain',
    hours: 6,
    price: 59.99,
    description: 'Master the Neuroscience of Emotional Dysregulation',
    icon: Brain
  },
  {
    id: 'risk-management',
    title: 'Risk Management in Counseling',
    hours: 2,
    price: 19.99,
    description: 'Protect Your Practice, Serve with Peace of Mind',
    icon: Shield
  },
  {
    id: 'telehealth',
    title: 'Telehealth in Counseling',
    hours: 3,
    price: 29.99,
    description: 'Build a Thriving Virtual Practice That Connects and Heals',
    icon: Monitor
  },
  {
    id: 'business-ethics',
    title: 'Business Ethics for Mental Health Professionals',
    hours: 2,
    price: 19.99,
    description: 'Where Clinical Ethics Meets Business Reality',
    icon: FileText
  },
  {
    id: 'suicide-prevention',
    title: 'Suicide Risk Assessment and Prevention',
    hours: 3,
    price: 29.99,
    description: 'Recognize, Assess, and Respond to Suicidal Ideation',
    icon: AlertCircle
  }
]

export default function ProfessionalCoursesPage() {
  return (
    <div className="min-h-screen bg-background-light py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-2 text-center">
          Professional Development & CEU Courses
        </h1>
        <p className="text-center text-text-secondary mb-4">
          Texas LPC Board Approved CE Credits
        </p>
        <p className="text-center text-lg font-semibold text-primary mb-12">
          $9.99 per CE credit hour
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-primary p-4">
                <div className="flex items-center justify-between">
                  <course.icon className="h-8 w-8 text-white" />
                  <span className="text-white font-bold">{course.hours} CE</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-text-primary mb-2">{course.title}</h3>
                <p className="text-text-secondary mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-text-secondary">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.hours} CE Hours</span>
                  </div>
                  <div className="flex items-center text-secondary font-bold">
                    <DollarSign className="h-4 w-4" />
                    <span>{course.price}</span>
                  </div>
                </div>
                
                <Link 
                  href={`/courses/${course.id}`}
                  className="block bg-primary text-white text-center py-3 rounded-lg hover:bg-primary-dark transition"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-accent/20 to-action/20 p-8 rounded-lg">
          <div className="flex items-center mb-4">
            <Award className="h-8 w-8 text-action mr-3" />
            <h2 className="text-2xl font-bold text-text-primary">CE Membership Options</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">1-Year CE Membership</h3>
              <p className="text-3xl font-bold text-primary mb-2">$199</p>
              <p className="text-sm text-text-secondary">Access to ALL CE courses for 12 months</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">2-Year CE Membership</h3>
              <p className="text-3xl font-bold text-primary mb-2">$299</p>
              <p className="text-sm text-text-secondary">24 months + Premium program discounts</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-action">
              <h3 className="font-bold text-lg mb-2">5-Year CE Membership</h3>
              <p className="text-3xl font-bold text-action mb-2">$699</p>
              <p className="text-sm text-text-secondary">Complete access + ALL personal development courses</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link 
              href="/memberships"
              className="bg-action text-white px-8 py-3 rounded-lg hover:bg-action/90 transition inline-block font-semibold"
            >
              View All Membership Options
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
