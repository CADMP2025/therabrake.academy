'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react'
import { CourseCard } from '@/components/courses/CourseCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { CourseSearchResult, CourseFilters, CourseTag } from '@/types/catalog'

export default function CourseCatalogPage() {
  // Wrap search params usage in Suspense to satisfy Next.js requirements
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading catalog…</div>}>
      <CatalogContent />
    </Suspense>
  )
}

function CatalogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [result, setResult] = useState<CourseSearchResult | null>(null)
  const [tags, setTags] = useState<CourseTag[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  // Initialize filters from URL
  const [filters, setFilters] = useState<CourseFilters>({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    tags: searchParams.get('tags')?.split(',') || undefined,
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    ceHoursMin: searchParams.get('ceHoursMin') ? Number(searchParams.get('ceHoursMin')) : undefined,
    difficultyLevel: searchParams.get('difficulty') as any,
    ratingMin: searchParams.get('ratingMin') ? Number(searchParams.get('ratingMin')) : undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'newest',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
  })

  // Fetch tags
  useEffect(() => {
    fetch('/api/courses/tags')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTags(data.data)
        }
      })
      .catch(console.error)
  }, [])

  // Fetch courses when filters change
  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            params.set(key, value.join(','))
          } else {
            params.set(key, String(value))
          }
        }
      })

      const res = await fetch(`/api/courses?${params}`)
      const data = await res.json()
      
      if (res.ok) {
        setResult(data)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const updateFilters = (updates: Partial<CourseFilters>) => {
    const newFilters = { ...filters, ...updates, page: 1 }
    setFilters(newFilters)
    
    // Update URL
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          params.set(key, value.join(','))
        } else {
          params.set(key, String(value))
        }
      }
    })
    router.push(`/courses/catalog?${params}`)
  }

  const toggleTag = (tagSlug: string) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tagSlug)
      ? currentTags.filter(t => t !== tagSlug)
      : [...currentTags, tagSlug]
    updateFilters({ tags: newTags.length > 0 ? newTags : undefined })
  }

  const clearFilters = () => {
    setFilters({
      sortBy: 'newest',
      page: 1,
      limit: 12,
    })
    router.push('/courses/catalog')
  }

  const activeFilterCount = Object.values(filters).filter(v => 
    v !== undefined && v !== '' && !['sortBy', 'page', 'limit'].includes(String(v))
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Course Catalog
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Explore our comprehensive library of Texas-approved CE courses and professional development programs
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search Input */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search courses..."
                className="pl-10 h-12"
                value={filters.search || ''}
                onChange={(e) => updateFilters({ search: e.target.value || undefined })}
              />
            </div>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1">{activeFilterCount}</Badge>
              )}
            </Button>

            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="title">A-Z</option>
            </select>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-blue-600"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => updateFilters({ category: e.target.value || undefined })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Professional">Professional CE</option>
                    <option value="Personal">Personal Development</option>
                    <option value="Premium">Premium Programs</option>
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={filters.difficultyLevel || ''}
                    onChange={(e) => updateFilters({ difficultyLevel: e.target.value as any || undefined })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin || ''}
                      onChange={(e) => updateFilters({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
                    />
                    <span className="flex items-center">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax || ''}
                      onChange={(e) => updateFilters({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </div>
                </div>

                {/* CE Hours */}
                <div>
                  <label className="block text-sm font-medium mb-2">Min CE Hours</label>
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 3"
                    value={filters.ceHoursMin || ''}
                    onChange={(e) => updateFilters({ ceHoursMin: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-2">Min Rating</label>
                  <select
                    value={filters.ratingMin || ''}
                    onChange={(e) => updateFilters({ ratingMin: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-3">Topics</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => {
                      const isActive = filters.tags?.includes(tag.slug)
                      return (
                        <Badge
                          key={tag.id}
                          variant={isActive ? 'default' : 'outline'}
                          className="cursor-pointer"
                          style={isActive ? { backgroundColor: tag.color } : { borderColor: tag.color, color: tag.color }}
                          onClick={() => toggleTag(tag.slug)}
                        >
                          {tag.name}
                          {isActive && <X className="w-3 h-3 ml-1" />}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {filters.category}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => updateFilters({ category: undefined })}
                  />
                </Badge>
              )}
              {filters.difficultyLevel && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.difficultyLevel}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => updateFilters({ difficultyLevel: undefined })}
                  />
                </Badge>
              )}
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{filters.search}"
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => updateFilters({ search: undefined })}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-video rounded-t-lg" />
                <div className="bg-white p-4 rounded-b-lg space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : result && result.courses.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {result.courses.length} of {result.total} courses
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {result.courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            {result.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={result.page === 1}
                  onClick={() => updateFilters({ page: result.page - 1 })}
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {[...Array(result.totalPages)].map((_, i) => {
                    const page = i + 1
                    if (
                      page === 1 ||
                      page === result.totalPages ||
                      (page >= result.page - 2 && page <= result.page + 2)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={page === result.page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateFilters({ page })}
                        >
                          {page}
                        </Button>
                      )
                    } else if (page === result.page - 3 || page === result.page + 3) {
                      return <span key={page} className="px-2">...</span>
                    }
                    return null
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={result.page === result.totalPages}
                  onClick={() => updateFilters({ page: result.page + 1 })}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
