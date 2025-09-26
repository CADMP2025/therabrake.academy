export type UserRole = 'student' | 'instructor' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  instructor_id: string
  title: string
  slug: string
  description: string
  short_description?: string
  category: string
  price: number
  ce_hours: number
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  thumbnail_url?: string
  enrollment_count: number
  average_rating: number
  created_at: string
  updated_at: string
}

export interface CourseModule {
  id: string
  course_id: string
  title: string
  description?: string
  order_index: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  content_type: 'video' | 'text' | 'pdf' | 'quiz'
  duration?: number
  order_index: number
  is_free: boolean
}
