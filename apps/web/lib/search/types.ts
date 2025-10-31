// Search types for course discovery
export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minCeHours?: number;
  maxCeHours?: number;
  texasApproved?: boolean;
  instructorId?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  status?: 'draft' | 'published' | 'archived';
}

export interface SearchOptions {
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'price' | 'rating' | 'created_at' | 'enrollment_count';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  price: number;
  ce_hours: number;
  category: string;
  texas_approved: boolean;
  instructor: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  average_rating: number;
  enrollment_count: number;
  relevance_score?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
