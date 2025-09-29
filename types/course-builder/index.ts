export interface CourseModule {
  id: string
  title: string
  description: string
  order_index: number
  lessons: Lesson[]
  is_preview: boolean
  estimated_duration: number
}

export interface Lesson {
  id: string
  title: string
  content_type: 'text' | 'video' | 'pdf' | 'quiz' | 'assignment'
  content: any
  duration: number
  order_index: number
  is_free: boolean
  resources?: Resource[]
}

export interface Resource {
  id: string
  title: string
  file_url: string
  file_type: string
  file_size?: number
}

export interface CourseBuilderState {
  courseId?: string
  title: string
  description: string
  modules: CourseModule[]
  isDirty: boolean
  lastSaved?: Date
}