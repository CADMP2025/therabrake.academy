'use client'
'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Clock, DollarSign, ChevronDown, ChevronUp, ArrowRight, Award, Heart, BookOpen, Users } from 'lucide-react'

interface Course {
  id: string
  title: string
  subtitle?: string
  icon: string
  price: number | string
  hours?: number
  description: string
  category: 'professional' | 'personal' | 'premium'
  tag?: string
}

const courses: Course[] = [
  // Professional Courses
  {
    id: 'trauma-informed',
    title: 'Building a Trauma-Informed Practice & Telehealth',
    icon: '🏥',
    price: 59.99,
    hours: 6,
    category: 'professional',
    tag: 'Texas LPC Approved',
    description: 'Transform Your Practice for the Modern Era. Learn evidence-based approaches to creating a trauma-informed therapeutic environment while mastering the technical and ethical considerations of telehealth delivery.'
  },
  {
    id: 'cultural-diversity',
    title: 'Cultural Diversity in Texas Counseling Practice',
    icon: '🌍',
    price: 29.99,
    hours: 3,
    category: 'professional',
    tag: 'Texas LPC Approved',
    description: 'Serve Every Texan with Cultural Competence. Develop cultural awareness and sensitivity specific to Texas diverse populations, including Latino/Hispanic, African American, Asian, and rural communities.'
  },
  {
    id: 'ethics-counselors',
    title: 'Ethics for Professional Counselors',
    icon: '⚖️',
    price: 59.99,
    hours: 6,
    category: 'professional',
    tag: 'Texas LPC Approved',
    description: 'Navigate Ethical Challenges with Confidence. Master the Texas LPC Code of Ethics, boundary management, informed consent, and confidentiality requirements while exploring real-world ethical dilemmas.'
  },
  {
    id: 'supervision-models',
    title: 'Supervision Models & Best Practices',
    icon: '👥',
    price: 79.99,
    hours: 6,
    category: 'professional',
    tag: 'Texas LPC Approved',
    description: 'Elevate Your Supervisory Excellence. Comprehensive training in developmental models, evaluation methods, and legal responsibilities for Texas LPC supervisors.'
  },
  {
    id: 'clinical-documentation',
    title: 'Clinical Documentation & Record Keeping',
    icon: '📋',
    price: 39.99,
    hours: 3,
    category: 'professional',
    tag: 'Texas LPC Approved',
    description: 'Protect Your Practice with Proper Documentation. Learn SOAP notes, treatment planning, progress documentation, and Texas-specific record retention requirements.'
  },
  // Personal Development Courses
  {
    id: 'healing-forward',
    title: 'Healing Forward',
    subtitle: 'Relationship Recovery and Personal Reclamation',
    icon: '🌅',
    price: 199,
    category: 'personal',
    description: `When a relationship ends—whether through divorce, death, or betrayal—you don't just lose a partner; you lose the future you imagined. This compassionate course guides you through the journey from devastation to renewal, helping you process grief, rebuild identity, and create a life that's authentically yours.`
  },
  {
    id: 'rebuilding-betrayal',
    title: 'Rebuilding After Betrayal',
    subtitle: 'Structured 4-Phase Recovery Framework',
    icon: '🧩',
    price: 249,
    category: 'personal',
    description: `Betrayal shatters more than trust—it destroys your sense of reality. This evidence-based program provides a clear pathway through betrayal's chaos using a proven 4-phase framework: Stabilization, Exploration, Integration, and Creation.`
  },
  {
    id: 'perfect-match',
    title: 'Finding the Perfect Match',
    subtitle: 'A Self-Guided Journey to Authentic Love',
    icon: '💘',
    price: 179,
    category: 'personal',
    description: `True love isn't about finding someone perfect—it's about finding someone perfect for YOU. This transformative course helps you break toxic relationship patterns and build the skills for lasting partnership.`
  },
  {
    id: 'cancer-journey',
    title: "Cancer Diagnosis: It's Not the End",
    subtitle: 'Navigate Your Cancer Journey with Hope',
    icon: '🎗️',
    price: 149,
    category: 'personal',
    description: `A cancer diagnosis changes everything—but it doesn't have to define everything. This unique course provides emotional and practical support for your cancer journey, created by a counselor who's walked this path.`
  },
  {
    id: 'credit-building',
    title: 'Credit Building & Debt Management',
    subtitle: 'Your Friendly Guide to Financial Freedom',
    icon: '💳',
    price: 99,
    category: 'personal',
    description: `Bad credit feels like wearing a scarlet letter. This judgment-free course helps you understand, repair, and build credit while conquering debt with practical, achievable strategies.`
  },
  {
    id: 'financial-literacy',
    title: 'Financial Literacy & Independence',
    subtitle: 'Master Money Management for Lifelong Security',
    icon: '💰',
    price: 129,
    category: 'personal',
    description: `Financial independence isn't about being rich—it's about having choices. Build financial literacy from the ground up, perfect for young adults, divorce survivors, or anyone ready to take control.`
  },
  // Premium Programs
  {
    id: 'so-what-mindset',
    title: 'So What Mindset™',
    subtitle: 'Premium Transformation Program',
    icon: '🚀',
    price: 499,
    category: 'premium',
    tag: 'Premium Program',
    description: 'A comprehensive mindset transformation program designed to help you overcome limiting beliefs, develop resilience, and create lasting change in your personal and professional life.'
  },
  {
    id: 'leap-launch',
    title: 'Leap & Launch™',
    subtitle: 'Career & Life Acceleration Program',
    icon: '🎯',
    price: 299,
    category: 'premium',
    tag: 'Premium Program',
    description: 'Take the leap into your next chapter with confidence. This action-oriented program combines career strategy, personal development, and practical tools for launching your dreams.'
  }
]

export default function AllCoursesPage() {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'professional' | 'personal' | 'premium'>('all')

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
  }

  const filteredCourses = activeFilter === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeFilter)

  const professionalCourses = courses.filter(c => c.category === 'professional')
  const personalCourses = courses.filter(c => c.category === 'personal')
  const premiumPrograms = courses.filter(c => c.category === 'premium')

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              All Courses & Programs
            </h1>
            <p className="text-xl leading-relaxed">
              Professional CE Credits • Personal Development • Premium Programs
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-16 bg-white shadow-md z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 py-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeFilter === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              All Courses ({courses.length})
            </button>
            <button
              onClick={() => setActiveFilter('professional')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeFilter === 'professional' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Professional CE ({professionalCourses.length})
            </button>
            <button
              onClick={() => setActiveFilter('personal')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeFilter === 'personal' 
                  ? 'bg-secondary text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Personal Growth ({personalCourses.length})
            </button>
            <button
              onClick={() => setActiveFilter('premium')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeFilter === 'premium' 
                  ? 'bg-action text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Premium ({premiumPrograms.length})
            </button>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                  course.category === 'professional' 
                    ? 'border-primary' 
                    : course.category === 'personal'
                    ? 'border-secondary'
                    : 'border-action'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-start mb-4 md:mb-0">
                      <span className="text-4xl mr-4 flex-shrink-0">{course.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-text-primary mb-1">
                          {course.title}
                        </h3>
                        {course.subtitle && (
                          <p className="text-text-secondary">{course.subtitle}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {course.tag && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              course.category === 'professional'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-action/10 text-action'
                            }`}>
                              {course.tag}
                            </span>
                          )}
                          {course.hours && (
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {course.hours} CE Hours
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-primary flex items-center">
                        <DollarSign className="h-5 w-5" />
                        {course.price}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => toggleCourse(course.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                        course.category === 'professional'
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : course.category === 'personal'
                          ? 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                          : 'bg-action/10 text-action hover:bg-action/20'
                      }`}
                    >
                      {expandedCourse === course.id ? (
                        <>Hide Details <ChevronUp className="h-4 w-4" /></>
                      ) : (
                        <>View Details <ChevronDown className="h-4 w-4" /></>
                      )}
                    </button>
                    <Link
                      href="/auth/register"
                      className="flex items-center gap-2 bg-action text-white px-4 py-2 rounded-lg font-medium hover:bg-action-hover transition"
                    >
                      Enroll Now <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  {/* Expandable Description */}
                  {expandedCourse === course.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-slideDown">
                      <p className="text-text-secondary leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Annual Membership CTA */}
          <div className="mt-12 bg-gradient-to-r from-primary to-primary-hover text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              🎓 Annual Membership Available
            </h2>
            <p className="text-lg mb-6">
              Get unlimited access to all professional CE courses with our annual membership plans
            </p>
            <Link
              href="/pricing"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold inline-flex items-center"
            >
              View Membership Options <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
