import Link from 'next/link'
import { Heart, Brain, Smile } from 'lucide-react'

const courses = [
  {
    id: 'happiness-formula',
    title: 'The Happiness Formula',
    category: 'Wellness',
    price: 39.99,
    description: 'Science-based strategies for lasting happiness',
    icon: Smile
  },
  {
    id: 'stress-management',
    title: 'Mastering Stress Management',
    category: 'Mental Health',
    price: 29.99,
    description: 'Practical tools for everyday peace',
    icon: Brain
  },
  {
    id: 'healthy-relationships',
    title: 'Building Healthy Relationships',
    category: 'Personal Development',
    price: 49.99,
    description: 'Transform your connections with others',
    icon: Heart
  }
]

export default function PersonalCoursesPage() {
  return (
    <div className="min-h-screen bg-background-light py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-2 text-center">
          Personal Growth & Wellness
        </h1>
        <p className="text-center text-text-secondary mb-12">
          Transform your life with expert-led programs
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-secondary p-6 text-center">
                <course.icon className="h-16 w-16 text-white mx-auto" />
              </div>
              <div className="p-6">
                <span className="text-sm text-secondary font-semibold">{course.category}</span>
                <h3 className="text-xl font-bold text-text-primary mt-2 mb-3">{course.title}</h3>
                <p className="text-text-secondary mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">${course.price}</span>
                  <Link 
                    href={`/courses/${course.id}`}
                    className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
