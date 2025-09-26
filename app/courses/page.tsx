import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, Award } from 'lucide-react'

export default function CoursesPage() {
  const courseCategories = [
    {
      title: 'Professional Development',
      description: 'CE credits for Texas LPCs - Build your practice',
      link: '/courses/professional',
      icon: Award,
      color: 'bg-primary'
    },
    {
      title: 'Personal Growth',
      description: 'Self-help and wellness programs for everyone',
      link: '/courses/personal',
      icon: BookOpen,
      color: 'bg-secondary'
    },
    {
      title: 'Premium Programs',
      description: 'Comprehensive transformation programs',
      link: '/courses/premium',
      icon: Clock,
      color: 'bg-action'
    }
  ]

  return (
    <div className="min-h-screen bg-background-light py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-8 text-center">
          Our Course Catalog
        </h1>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {courseCategories.map((category) => (
            <div key={category.title} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className={`${category.color} p-6`}>
                <category.icon className="h-12 w-12 text-white mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">{category.title}</h2>
                <p className="text-white/90">{category.description}</p>
              </div>
              <div className="p-6">
                <Link 
                  href={category.link}
                  className="inline-flex items-center text-primary hover:text-primary-dark transition"
                >
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
