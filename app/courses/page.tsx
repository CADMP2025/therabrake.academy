'use client'

import { useState } from 'react'
import { CourseCard } from '@/components/course/CourseCard'
import { Search, Filter } from 'lucide-react'

// Mock data
const allCourses = [
  {
    id: '1',
    instructor_id: '1',
    title: 'Building a Trauma-Informed Practice & Telehealth',
    slug: 'trauma-informed-practice',
    description: 'Transform your practice for the modern era.',
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
    description: 'Navigate complex ethical challenges.',
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
    title: 'Cultural Diversity in Texas Counseling',
    slug: 'cultural-diversity-texas',
    description: 'Serve every Texan with cultural competence.',
    category: 'Diversity',
    price: 29.99,
    ce_hours: 3,
    status: 'published' as const,
    featured: false,
    enrollment_count: 167,
    average_rating: 4.7,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '4',
    instructor_id: '1',
    title: 'Regulating the Storm: Trauma, Anger, and the Brain',
    slug: 'regulating-the-storm',
    description: 'Master the neuroscience of emotional dysregulation.',
    category: 'Trauma',
    price: 59.99,
    ce_hours: 6,
    status: 'published' as const,
    featured: false,
    enrollment_count: 203,
    average_rating: 4.8,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '5',
    instructor_id: '1',
    title: 'Risk Management in Counseling',
    slug: 'risk-management',
    description: 'Protect your practice, serve with peace of mind.',
    category: 'Professional Development',
    price: 19.99,
    ce_hours: 2,
    status: 'published' as const,
    featured: false,
    enrollment_count: 134,
    average_rating: 4.6,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '6',
    instructor_id: '1',
    title: 'Suicide Risk Assessment and Prevention',
    slug: 'suicide-risk-assessment',
    description: 'Recognize, assess, and respond to suicidal ideation.',
    category: 'Crisis Intervention',
    price: 29.99,
    ce_hours: 3,
    status: 'published' as const,
    featured: false,
    enrollment_count: 256,
    average_rating: 4.9,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  }
]

const categories = [
  'All Categories',
  'Professional Development',
  'Ethics',
  'Diversity',
  'Trauma',
  'Crisis Intervention'
]

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === 'All Categories' || course.category === selectedCategory
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">
            CE Courses for Mental Health Professionals
          </h1>
          <p className="text-gray-600">
            Browse our Texas-approved continuing education courses
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
