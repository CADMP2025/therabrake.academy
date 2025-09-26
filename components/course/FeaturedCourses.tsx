import { CourseCard } from './CourseCard'

// Mock data for development
const mockCourses = [
  {
    id: '1',
    instructor_id: '1',
    title: 'Building a Trauma-Informed Practice & Telehealth',
    slug: 'trauma-informed-practice',
    description: 'Transform your practice for the modern era with trauma-informed approaches.',
    short_description: 'Master trauma-informed care and telehealth delivery.',
    category: 'Professional Development',
    price: 59.99,
    ce_hours: 6,
    status: 'published' as const,
    featured: true,
    enrollment_count: 245,
    average_rating: 4.8,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    instructor_id: '1',
    title: 'Ethics for Professional Counselors',
    slug: 'ethics-professional-counselors',
    description: 'Navigate complex ethical challenges with clarity and confidence.',
    category: 'Ethics',
    price: 59.99,
    ce_hours: 6,
    status: 'published' as const,
    featured: true,
    enrollment_count: 189,
    average_rating: 4.9,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '3',
    instructor_id: '1',
    title: 'Cultural Diversity in Texas Counseling Practice',
    slug: 'cultural-diversity-texas',
    description: 'Serve every Texan with cultural competence and confidence.',
    category: 'Diversity',
    price: 29.99,
    ce_hours: 3,
    status: 'published' as const,
    featured: false,
    enrollment_count: 167,
    average_rating: 4.7,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  }
]

export function FeaturedCourses() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
            Featured CE Courses
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Texas-approved continuing education courses designed by mental health professionals, 
            for mental health professionals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/courses" className="btn-primary">
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  )
}
