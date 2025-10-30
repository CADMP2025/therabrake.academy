// =====================================================
// COURSE CATALOG & DISCOVERY TYPES
// =====================================================

export interface CourseTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  created_at: string;
}

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  enrollment_id: string;
  rating: number;
  title?: string;
  comment?: string;
  helpful_count: number;
  verified_purchase: boolean;
  instructor_response?: string;
  instructor_response_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface CourseWithDetails {
  id: string;
  instructor_id: string;
  title: string;
  description?: string;
  slug?: string;
  ce_hours?: number;
  provider_number?: string;
  status: 'draft' | 'published' | 'archived';
  requires_quiz: boolean;
  passing_score: number;
  price: number;
  category?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  // Batch 8 additions
  featured: boolean;
  featured_order?: number;
  featured_until?: string;
  coming_soon: boolean;
  launch_date?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  learning_objectives?: string[];
  target_audience?: string;
  average_rating: number;
  total_reviews: number;
  total_enrollments: number;
  completion_rate: number;
  preview_video_url?: string;
  preview_lesson_id?: string;
  // Joined data
  tags?: CourseTag[];
  instructor?: {
    id: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
  };
  reviews?: CourseReview[];
  modules_count?: number;
  lessons_count?: number;
  total_duration?: number;
}

export interface CourseFilters {
  category?: string;
  tags?: string[];
  priceMin?: number;
  priceMax?: number;
  ceHoursMin?: number;
  ceHoursMax?: number;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  ratingMin?: number;
  status?: 'all' | 'published' | 'coming_soon';
  sortBy?: 'newest' | 'popular' | 'rating' | 'price_low' | 'price_high' | 'title';
  search?: string;
  page?: number;
  limit?: number;
}

export interface CourseSearchResult {
  courses: CourseWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: CourseFilters;
}

export interface FeaturedCourse {
  id: string;
  title: string;
  description?: string;
  slug?: string;
  ce_hours?: number;
  price: number;
  category?: string;
  thumbnail_url?: string;
  average_rating: number;
  total_reviews: number;
  total_enrollments: number;
  featured_order?: number;
}

export interface PopularCourse {
  id: string;
  title: string;
  description?: string;
  slug?: string;
  ce_hours?: number;
  price: number;
  category?: string;
  thumbnail_url?: string;
  average_rating: number;
  total_reviews: number;
  total_enrollments: number;
  popularity_score: number;
}

export interface RecommendedCourse {
  id: string;
  title: string;
  description?: string;
  slug?: string;
  ce_hours?: number;
  price: number;
  category?: string;
  thumbnail_url?: string;
  average_rating: number;
  total_reviews: number;
  recommendation_score: number;
}

export interface CourseComparison {
  id: string;
  user_id: string;
  course_ids: string[];
  created_at: string;
  courses?: CourseWithDetails[];
}

export interface CourseWaitlistEntry {
  id: string;
  course_id: string;
  user_id: string;
  email: string;
  notified: boolean;
  created_at: string;
}

export interface ReviewHelpfulness {
  id: string;
  review_id: string;
  user_id: string;
  is_helpful: boolean;
  created_at: string;
}

export interface UserCourseInterest {
  id: string;
  user_id: string;
  tag_id: string;
  interest_score: number;
  last_viewed_at: string;
}

export interface CourseView {
  id: string;
  course_id: string;
  user_id?: string;
  session_id?: string;
  viewed_at: string;
}

// API Response types
export interface CreateReviewRequest {
  course_id: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface MarkReviewHelpfulRequest {
  review_id: string;
  is_helpful: boolean;
}

export interface JoinWaitlistRequest {
  course_id: string;
  email: string;
}

export interface CompareCoursesRequest {
  course_ids: string[];
}

export interface TrackCourseViewRequest {
  course_id: string;
  session_id?: string;
}

// Autocomplete types
export interface CourseSearchSuggestion {
  id: string;
  title: string;
  category?: string;
  thumbnail_url?: string;
  type: 'course' | 'category' | 'tag';
}

export interface SearchAutocompleteResult {
  suggestions: CourseSearchSuggestion[];
  total: number;
}
