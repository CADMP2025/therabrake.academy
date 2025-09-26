import Link from 'next/link'
import { Clock, Award, DollarSign } from 'lucide-react'

const currentCourses = [
  {
    id: 'trauma-informed-telehealth',
    title: 'Building a Trauma-Informed Practice & Telehealth',
    hours: 6,
    price: 59.99,
    description: 'Transform Your Practice for the Modern Era',
    fullDescription: 'Understanding trauma\'s pervasive impact while mastering digital delivery methods. Learn evidence-based trauma-informed approaches and master telehealth delivery.',
    emoji: '🌐'
  },
  {
    id: 'cultural-diversity',
    title: 'Cultural Diversity in Texas Counseling Practice',
    hours: 3,
    price: 29.99,
    description: 'Serve Every Texan with Cultural Competence',
    fullDescription: 'Bridge differences with skill and sensitivity. Explore unique cultural dynamics of Texas communities.',
    emoji: '🌎'
  },
  {
    id: 'ethics-counselors',
    title: 'Ethics for Professional Counselors',
    hours: 6,
    price: 59.99,
    description: 'Navigate Complex Ethical Challenges with Clarity',
    fullDescription: 'Develop robust ethical decision-making frameworks using Texas-specific case law and LPC board decisions.',
    emoji: '⚖️'
  },
  {
    id: 'regulating-storm',
    title: 'Regulating the Storm: Trauma, Anger, and the Brain',
    hours: 6,
    price: 59.99,
    description: 'Master the Neuroscience of Emotional Dysregulation',
    fullDescription: 'Reveal neurobiological connections between trauma and anger, implement brain-based interventions.',
    emoji: '🌩️'
  },
  {
    id: 'risk-management',
    title: 'Risk Management in Counseling',
    hours: 2,
    price: 19.99,
    description: 'Protect Your Practice, Serve with Peace of Mind',
    fullDescription: 'Learn from real Texas malpractice cases, develop systems for managing high-risk situations.',
    emoji: '🛡️'
  },
  {
    id: 'telehealth',
    title: 'Telehealth in Counseling',
    hours: 3,
    price: 29.99,
    description: 'Build a Thriving Virtual Practice',
    fullDescription: 'Excel in virtual counseling with HIPAA-compliant platforms and therapeutic presence techniques.',
    emoji: '💻'
  },
  {
    id: 'business-ethics',
    title: 'Business Ethics for Mental Health Professionals',
    hours: 2,
    price: 19.99,
    description: 'Where Clinical Ethics Meets Business Reality',
    fullDescription: 'Navigate financial sustainability while maintaining clinical ethics and professional values.',
    emoji: '💼'
  },
  {
    id: 'suicide-prevention',
    title: 'Suicide Risk Assessment and Prevention',
    hours: 3,
    price: 29.99,
    description: 'Recognize, Assess, and Respond to Suicidal Ideation',
    fullDescription: 'Master critical skills using evidence-based tools and Texas legal requirements.',
    emoji: '🚨'
  }
]

const expandedCourses = [
  {
    category: 'Foundation Courses',
    courses: [
      {
        id: 'advanced-ethics-digital',
        title: 'Advanced Ethics in Digital Age Counseling',
        hours: 4,
        price: 39.99,
        description: 'Navigate the Uncharted Territory of Digital Mental Health',
        emoji: '🔒'
      },
      {
        id: 'legal-issues',
        title: 'Legal Issues and Documentation for Counselors',
        hours: 4,
        price: 39.99,
        description: 'Master the Law to Protect Your Practice',
        emoji: '📜'
      }
    ]
  },
  {
    category: 'Trauma Specialization',
    courses: [
      {
        id: 'complex-ptsd',
        title: 'Complex PTSD and Developmental Trauma',
        hours: 8,
        price: 79.99,
        description: 'Beyond Traditional PTSD Treatment',
        emoji: '🧩'
      },
      {
        id: 'emdr-level1',
        title: 'EMDR Level 1 Training',
        hours: 15,
        price: 149.99,
        description: 'Evidence-Based Trauma Treatment',
        emoji: '👁️'
      },
      {
        id: 'somatic-approaches',
        title: 'Somatic Approaches to Trauma Recovery',
        hours: 6,
        price: 59.99,
        description: 'Healing Trauma Through Body Wisdom',
        emoji: '🧘'
      }
    ]
  },
  {
    category: 'Substance Abuse & Addiction',
    courses: [
      {
        id: 'addiction-fundamentals',
        title: 'Addiction Counseling Fundamentals',
        hours: 8,
        price: 79.99,
        description: 'Build Expertise in Addiction Treatment',
        emoji: '🍷'
      },
      {
        id: 'co-occurring',
        title: 'Co-Occurring Disorders',
        hours: 6,
        price: 59.99,
        description: 'Treat the Whole Person',
        emoji: '⚖️'
      },
      {
        id: 'motivational-interviewing',
        title: 'Motivational Interviewing for Recovery',
        hours: 6,
        price: 59.99,
        description: 'Master the Art of Change Conversation',
        emoji: '💬'
      }
    ]
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
        
        {/* Current CE Catalog */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Current CE Catalog (31 Credit Hours)</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{course.emoji}</span>
                    <span className="text-white font-bold bg-white/20 px-2 py-1 rounded">{course.hours} CE</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-text-primary mb-2">{course.title}</h3>
                  <p className="text-text-secondary text-sm mb-3">{course.description}</p>
                  <p className="text-xs text-text-secondary/80 mb-4 line-clamp-2">{course.fullDescription}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-text-secondary text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.hours} Hours</span>
                    </div>
                    <div className="flex items-center text-secondary font-bold">
                      <DollarSign className="h-4 w-4" />
                      <span>{course.price}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/courses/${course.id}`}
                    className="block bg-primary text-white text-center py-2 rounded-lg hover:bg-primary-dark transition font-medium"
                  >
                    View Course Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Expanded Catalog Preview */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Expanded CE Catalog (169+ Additional Hours)</h2>
          {expandedCourses.map((category) => (
            <div key={category.category} className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">{category.category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{course.emoji}</span>
                      <span className="text-xs bg-secondary/20 text-secondary-dark px-2 py-1 rounded">{course.hours} CE</span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{course.title}</h4>
                    <p className="text-xs text-text-secondary mb-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">${course.price}</span>
                      <Link href={`/courses/${course.id}`} className="text-xs text-primary hover:underline">
                        Learn More →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Membership CTA */}
        <div className="text-center my-12">
          <Link 
            href="/memberships"
            className="bg-action text-white px-8 py-3 rounded-lg hover:bg-action/90 transition inline-block font-semibold text-lg"
          >
            View All Courses & Membership Options
          </Link>
        </div>
      </div>
    </div>
  )
}
