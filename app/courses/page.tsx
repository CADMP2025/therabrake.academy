import Link from 'next/link'
import { Clock, Award, DollarSign, Star, Rocket, Target } from 'lucide-react'

export default function CoursesPage() {
  const premiumPrograms = [
    {
      title: "So What Mindset",
      price: "$499",
      description: "Transform your mindset and overcome limiting beliefs",
      link: "/courses/so-what-mindset",
      icon: Target,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Leap & Launch",
      price: "$299",
      description: "Build your private practice with confidence",
      link: "/courses/leap-launch",
      icon: Rocket,
      color: "from-primary to-secondary"
    }
  ]

  const courseCategories = [
    {
      title: "Professional CE Courses",
      description: "Texas-approved continuing education for mental health professionals",
      link: "/courses/professional",
      credits: "3-6 CE hours per course",
      price: "$9.99 per CE hour"
    },
    {
      title: "Personal Development",
      description: "Transform your life with evidence-based mental health strategies",
      link: "/courses/personal",
      credits: "Self-paced learning",
      price: "Starting at $49"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
        <div className="container-therabrake text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Transform Your Practice & Your Life
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/95">
            Choose from Texas-approved CE courses, personal development programs, 
            and premium transformation packages designed for mental health professionals.
          </p>
        </div>
      </section>

      {/* Premium Programs Section */}
      <section className="py-16">
        <div className="container-therabrake">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary">✨ Premium Programs</h2>
          <p className="text-center text-text-primary mb-12 max-w-2xl mx-auto">
            Comprehensive transformation programs with workbooks, videos, and lifetime support
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {premiumPrograms.map((program, index) => (
              <Link key={index} href={program.link}>
                <div className="card hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer h-full">
                  <div className={`h-2 bg-gradient-to-r ${program.color} rounded-t-lg`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <program.icon className="w-10 h-10 text-primary" />
                      <span className="text-2xl font-bold text-action">{program.price}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-text-primary">{program.title}</h3>
                    <p className="text-text-primary mb-4">{program.description}</p>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                      <span className="text-sm text-text-primary ml-2">5.0 (200+ reviews)</span>
                    </div>
                    <span className="text-primary font-semibold hover:text-primary-dark">
                      Learn More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-therabrake">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">📚 Course Categories</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {courseCategories.map((category, index) => (
              <Link key={index} href={category.link}>
                <div className="card hover:shadow-xl transition-all cursor-pointer h-full">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-text-primary">{category.title}</h3>
                    <p className="text-text-primary mb-4">{category.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-text-primary">{category.credits}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-secondary" />
                        <span className="text-text-primary">{category.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-accent" />
                        <span className="text-text-primary">Texas LCSW/LPC Approved</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-primary font-semibold hover:text-primary-dark">
                        Browse Courses →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-therabrake text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary">Ready to Start Your Journey?</h2>
          <p className="text-lg text-text-primary mb-8 max-w-2xl mx-auto">
            Join thousands of mental health professionals who have transformed 
            their practices and lives with TheraBrake Academy.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold text-lg px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Get Started Today
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold text-lg px-8 py-3 rounded-lg transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}