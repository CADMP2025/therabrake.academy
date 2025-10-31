/**
 * Common types shared across web and mobile apps
 */

export interface User {
  id: string
  email: string
  full_name: string
  role: 'student' | 'instructor' | 'admin'
  phone?: string
  bio?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructor_id: string
  price: number
  duration_hours: number
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  thumbnail_url?: string
  video_url?: string
  status: 'draft' | 'published' | 'archived'
  ce_hours?: number
  ce_provider_number?: string
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  module_id: string
  title: string
  content: string
  video_url?: string
  duration_minutes?: number
  order_index: number
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  description?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  status: 'active' | 'completed' | 'expired'
  progress: number
  started_at: string
  completed_at?: string
  expires_at?: string
}

export interface Certificate {
  id: string
  user_id: string
  course_id: string
  enrollment_id: string
  certificate_number: string
  issued_at: string
  ce_hours?: number
  pdf_url?: string
}

export interface Progress {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  completed: boolean
  time_spent: number
  last_position?: number
  created_at: string
  updated_at: string
}

// Pagination
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
