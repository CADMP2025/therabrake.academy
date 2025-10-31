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
      color: "from-[#3B82F6] to-[#10B981]"
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
      <section className="bg-gradient-to-br from-[#3B82F6] to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
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
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#3B82F6]">✨ Premium Programs</h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            Comprehensive transformation programs with workbooks, videos, and lifetime support
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {premiumPrograms.map((program, index) => (
              <Link key={index} href={program.link}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer h-full">
                  <div className={`h-2 bg-gradient-to-r ${program.color} rounded-t-lg`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <program.icon className="w-10 h-10 text-[#3B82F6]" />
                      <span className="text-2xl font-bold text-[#F97316]">{program.price}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{program.title}</h3>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">5.0 (200+ reviews)</span>
                    </div>
                    <span className="text-[#3B82F6] font-semibold hover:text-blue-700">
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
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#3B82F6]">📚 Course Categories</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {courseCategories.map((category, index) => (
              <Link key={index} href={category.link}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer h-full">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-800">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#3B82F6]" />
                        <span className="text-gray-700">{category.credits}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#10B981]" />
                        <span className="text-gray-700">{category.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#FACC15]" />
                        <span className="text-gray-700">Texas LCSW/LPC Approved</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-[#3B82F6] font-semibold hover:text-blue-700">
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
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#3B82F6]">Ready to Start Your Journey?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of mental health professionals who have transformed 
            their practices and lives with TheraBrake Academy.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center bg-[#3B82F6] hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Get Started Today
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white font-semibold text-lg px-8 py-3 rounded-lg transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}