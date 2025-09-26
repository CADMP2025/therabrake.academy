import Link from 'next/link'
import { Award, Heart, Target, Users, BookOpen, Rocket } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 text-center">About TheraBrake Academy™</h1>
          <p className="text-2xl text-center text-accent font-semibold">Pause, Process, Progress</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-text-primary mb-8">
            At <strong>TheraBrake Academy™</strong>, we believe growth happens when you take a moment to pause, 
            process, and progress. That's why we've built a learning platform that serves both <strong>mental health 
            professionals</strong> and <strong>individuals seeking personal transformation</strong>.
          </p>

          <h2 className="text-3xl font-bold mb-6 text-text-primary">Our Dual Catalog</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Award className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-xl font-bold">Professional CEU & Development Programs</h3>
              </div>
              <p className="text-text-secondary">
                Accredited continuing education for licensed clinicians, plus practice-building programs like 
                <em> Leap & Launch!</em> to help professionals grow their careers with confidence and compliance.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-secondary mr-3" />
                <h3 className="text-xl font-bold">Personal Growth & Empowerment Courses</h3>
              </div>
              <p className="text-text-secondary">
                Transformational programs designed to support healing, resilience, and financial empowerment, 
                covering everything from <em>Rebuilding After Betrayal</em> to <em>Financial Literacy & Independence</em>.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6 text-text-primary">What Makes Us Different</h2>
            <p className="text-lg text-text-secondary mb-6">
              Every course is designed to be <strong>practical, accessible, and impactful</strong>, blending expert 
              instruction with real-world tools. Learners can expect:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <BookOpen className="h-6 w-6 text-primary mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Interactive Lessons</h4>
                  <p className="text-text-secondary text-sm">Engaging content that keeps you motivated</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Target className="h-6 w-6 text-secondary mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Downloadable Workbooks</h4>
                  <p className="text-text-secondary text-sm">Practical resources you can use immediately</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="h-6 w-6 text-action mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Expert Instructors</h4>
                  <p className="text-text-secondary text-sm">Learn from licensed professionals</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Award className="h-6 w-6 text-accent mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Shareable Certificates</h4>
                  <p className="text-text-secondary text-sm">Credentials that enhance your profile</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8">
            <Rocket className="h-12 w-12 mx-auto mb-4 text-accent" />
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg mb-6">
              <strong>To empower professionals and the public with education that creates lasting change</strong>—in 
              careers, relationships, health, and personal fulfillment.
            </p>
            <p className="text-xl font-semibold text-accent">
              At TheraBrake Academy™, you don't just complete courses. <strong>You unlock progress.</strong>
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/courses"
              className="bg-action text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-action/90 transition inline-block"
            >
              Explore Our Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
