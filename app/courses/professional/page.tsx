import Link from 'next/link'
import { Clock, Award, DollarSign } from 'lucide-react'

const courses = [
  {
    id: 'trauma-informed',
    title: 'Building a Trauma-Informed Practice & Telehealth',
    hours: 6,
    price: 59.99,
    description: 'Transform Your Practice for the Modern Era'
  },
  {
    id: 'cultural-diversity',
    title: 'Cultural Diversity in Texas Counseling Practice',
    hours: 3,
    price: 29.99,
    description: 'Serve Every Texan with Cultural Competence'
  },
  {
    id: 'ethics-counselors',
    title: 'Ethics for Professional Counselors',
    hours: 6,
    price: 59.99,
    description: 'Navigate Ethical Challenges with Confidence'
  }
]

export default function ProfessionalCoursesPage() {
  return (
    <div className="min-h-screen bg-background-light py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-2 text-center">
          Professional Development Courses
        </h1>
        <p className="text-center text-text-secondary mb-12">
          Texas LPC Board Approved CE Credits
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-primary p-4">
                <h3 className="text-xl font-bold text-white">{course.title}</h3>
              </div>
              <div className="p-6">
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
        
        <div className="mt-12 bg-accent/20 p-8 rounded-lg">
          <div className="flex items-center mb-4">
            <Award className="h-8 w-8 text-accent mr-3" />
            <h2 className="text-2xl font-bold text-text-primary">Annual Membership</h2>
          </div>
          <p className="text-text-secondary mb-4">
            Get unlimited access to all professional courses for one year
          </p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-primary">$499/year</span>
            <Link 
              href="/membership"
              className="bg-accent text-white px-8 py-3 rounded-lg hover:bg-accent/90 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
