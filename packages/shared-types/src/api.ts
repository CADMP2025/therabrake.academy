/**
 * API Response types
 */

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
}

// Auth API types
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    role: string
  }
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
  }
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  role: 'student' | 'instructor'
  phone?: string
}

// Course API types
export interface CourseListParams {
  category?: string
  level?: string
  search?: string
  page?: number
  limit?: number
}

export interface EnrollmentRequest {
  courseId: string
  paymentIntentId?: string
}

// Progress API types
export interface UpdateProgressRequest {
  lessonId: string
  courseId: string
  completed?: boolean
  timeSpent?: number
  lastPosition?: number
}

export interface VideoProgressRequest {
  lessonId: string
  courseId: string
  currentTime: number
  duration: number
  completed?: boolean
}
