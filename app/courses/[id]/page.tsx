import Link from 'next/link'
import { Clock, Award, PlayCircle, FileText } from 'lucide-react'

interface CoursePageProps {
  params: {
    id: string
  }
}

export default function CourseDetailPage({ params }: CoursePageProps) {
  // This would normally fetch from database
  const courseData = {
    id: params.id,
    title: 'Sample Course',
    description: 'This is a placeholder course detail page.',
    ceHours: 6,
    modules: [
      { id: '1', title: 'Introduction', duration: 30 },
      { id: '2', title: 'Core Concepts', duration: 60 },
      { id: '3', title: 'Practical Application', duration: 90 },
    ]
  }

  return (
    <div className="min-h-screen bg-background-light py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/courses" className="text-primary hover:underline mb-4 inline-block">
          ← Back to Courses
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">{courseData.title}</h1>
          <p className="text-text-secondary mb-6">{courseData.description}</p>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <span className="text-text-secondary">{courseData.ceHours} CE Hours</span>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-secondary mr-2" />
              <span className="text-text-secondary">Certificate Included</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-text-primary mb-4">Course Modules</h2>
          <div className="space-y-4">
            {courseData.modules.map((module) => (
              <div key={module.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <PlayCircle className="h-5 w-5 text-primary mr-3" />
                    <h3 className="font-semibold text-text-primary">{module.title}</h3>
                  </div>
                  <span className="text-sm text-text-secondary">{module.duration} min</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <Link 
              href={`/checkout?course=${params.id}`}
              className="block w-full bg-primary text-white text-center py-3 rounded-lg hover:bg-primary-dark transition"
            >
              Enroll in Course
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
