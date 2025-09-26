import Link from 'next/link'
import { useState } from 'react'
import { Clock, DollarSign, ChevronDown, ChevronUp, ArrowRight, Heart, Star } from 'lucide-react'

interface Course {
  id: string
  title: string
  subtitle: string
  icon: string
  price: number
  description: string
  duration?: string
}

const courses: Course[] = [
  {
    id: 'healing-forward',
    title: 'Healing Forward',
    subtitle: 'Relationship Recovery and Personal Reclamation',
    icon: '🌅',
    price: 199,
    description: `When a relationship ends—whether through divorce, death, or betrayal—you don't just lose a partner; you lose the future you imagined. This compassionate course guides you through the journey from devastation to renewal, helping you process grief, rebuild identity, and create a life that's authentically yours. Through structured exercises and gentle guidance, you'll learn to set boundaries with grace, manage co-parenting challenges, and navigate the emotional rollercoaster of starting over. More than just "moving on," this is about healing forward into a version of yourself that's stronger, wiser, and ready for healthy love.`
  },
  {
    id: 'rebuilding-betrayal',
    title: 'Rebuilding After Betrayal',
    subtitle: 'Structured 4-Phase Recovery Framework',
    icon: '🧩',
    price: 249,
    description: `Betrayal shatters more than trust—it destroys your sense of reality. This evidence-based program provides a clear pathway through betrayal's chaos using a proven 4-phase framework: Stabilization, Exploration, Integration, and Creation. Whether you've experienced infidelity, financial deception, or professional betrayal, you'll learn to process trauma symptoms, rebuild self-trust, and make empowered decisions about your future. With practical tools for managing triggers, worksheets for processing complex emotions, and strategies for preventing future betrayal, this course transforms your worst experience into your greatest growth opportunity.`
  },
  {
    id: 'perfect-match',
    title: 'Finding the Perfect Match',
    subtitle: 'A Self-Guided Journey to Authentic Love',
    icon: '💘',
    price: 179,
    description: `True love isn't about finding someone perfect—it's about finding someone perfect for YOU. This transformative course helps you break toxic relationship patterns and build the skills for lasting partnership. Through personality assessments, values clarification, and attachment style exploration, you'll understand why past relationships failed and how to choose differently. Learn to recognize red flags early, communicate needs effectively, and date with intention rather than desperation. Whether you're newly single or chronically settling, gain the clarity and confidence to attract and recognize the love you deserve.`
  },
  {
    id: 'cancer-journey',
    title: "Cancer Diagnosis: It's Not the End… It's Just the Beginning!",
    subtitle: 'Navigate Your Cancer Journey with Hope, Humor, and Healing',
    icon: '🎗️',
    price: 149,
    description: `A cancer diagnosis changes everything—but it doesn't have to define everything. This unique course, created by a counselor who's walked this path, provides emotional and practical support for your cancer journey. Learn to manage medical anxiety, communicate with your care team effectively, and maintain relationships through treatment. Discover strategies for preserving identity beyond "cancer patient," finding meaning in the struggle, and even embracing unexpected gifts of the journey. With sections for caregivers and family members, this course supports your entire support system through challenge into transformation.`
  },
  {
    id: 'credit-building',
    title: 'Credit Building & Debt Management',
    subtitle: 'Your Friendly Guide to Financial Freedom',
    icon: '💳',
    price: 99,
    description: `Bad credit feels like wearing a scarlet letter in a world that runs on credit scores. This judgment-free course helps you understand, repair, and build credit while conquering debt with practical, achievable strategies. Learn the credit score formula, dispute errors effectively, and negotiate with creditors from a position of knowledge. We'll tackle the emotional side of money—shame, anxiety, and family patterns—while building concrete skills for budgeting, saving, and strategic debt elimination. With downloadable trackers and step-by-step action plans, transform financial chaos into financial confidence.`
  },
  {
    id: 'financial-literacy',
    title: 'Financial Literacy & Independence',
    subtitle: 'Master Money Management for Lifelong Security',
    icon: '💰',
    price: 129,
    description: `Financial independence isn't about being rich—it's about having choices. This comprehensive course builds financial literacy from the ground up, perfect for young adults, divorce survivors, or anyone ready to take control of their financial future. Master the fundamentals: budgeting that actually works, understanding investments without the jargon, navigating insurance needs, and planning for retirement at any age. Learn to decode financial documents, avoid predatory lending, and build multiple income streams. With practical exercises and real-world applications, gain the knowledge and confidence to make money work for you.`
  }
]

export default function PersonalCoursesPage() {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary to-secondary-hover text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center">
              <Star className="mr-3 h-10 w-10" />
              Personal Development Courses
              <Star className="ml-3 h-10 w-10" />
            </h1>
            <p className="text-xl leading-relaxed">
              Transform Your Life, Heal Your Heart, Build Your Future
            </p>
            <p className="text-lg mt-4 opacity-90">
              Evidence-based courses designed to guide you through life&apos;s toughest challenges 
              toward genuine growth and lasting change.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🌟 Your Journey to Transformation Starts Here</h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Each course is crafted with compassion, backed by evidence, and designed to meet you exactly where you are. 
              Click on any course to explore how it can support your personal growth journey.
            </p>
          </div>

          <div className="grid gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Course Header */}
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-start md:items-center mb-4 md:mb-0">
                      <span className="text-5xl mr-4 flex-shrink-0">{course.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-text-primary mb-1">
                          {course.title}
                        </h3>
                        <p className="text-text-secondary font-medium">
                          {course.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center text-2xl font-bold text-primary">
                          <DollarSign className="h-6 w-6" />
                          <span>{course.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <button
                      onClick={() => toggleCourse(course.id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-secondary to-secondary-hover text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      {expandedCourse === course.id ? (
                        <>
                          Hide Details <ChevronUp className="h-5 w-5" />
                        </>
                      ) : (
                        <>
                          View Details <ChevronDown className="h-5 w-5" />
                        </>
                      )}
                    </button>
                    <Link
                      href="/auth/register"
                      className="flex items-center gap-2 bg-action text-white px-6 py-3 rounded-lg font-semibold hover:bg-action-hover transition-all duration-300"
                    >
                      Enroll Now <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>

                  {/* Expandable Description */}
                  {expandedCourse === course.id && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl animate-slideDown">
                      <h4 className="font-bold text-lg mb-3 text-text-primary">
                        Course Overview
                      </h4>
                      <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                        {course.description}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-4">
                        <div className="flex items-center text-sm text-text-secondary">
                          <Clock className="h-4 w-4 mr-2 text-secondary" />
                          Self-paced learning
                        </div>
                        <div className="flex items-center text-sm text-text-secondary">
                          <Heart className="h-4 w-4 mr-2 text-action" />
                          Lifetime access
                        </div>
                        <div className="flex items-center text-sm text-text-secondary">
                          <Star className="h-4 w-4 mr-2 text-accent" />
                          Certificate included
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-primary to-primary-hover text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Every journey begins with a single step. Choose the course that speaks to your current challenge 
              and start building the life you deserve today.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-white text-primary hover:bg-background-secondary px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center"
              >
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center"
              >
                Have Questions? Contact Us
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-sm text-text-secondary mb-4">
              All courses include:
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary">
              <span className="flex items-center">
                ✓ Evidence-based content
              </span>
              <span className="flex items-center">
                ✓ Downloadable resources
              </span>
              <span className="flex items-center">
                ✓ Community support
              </span>
              <span className="flex items-center">
                ✓ Immediate digital access
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Add animation styles */}
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
