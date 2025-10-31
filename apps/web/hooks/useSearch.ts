'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface SearchFilters {
  category?: string
  minCeHours?: number
  maxPrice?: number
  texasApproved?: boolean
}

interface SearchResult {
  id: string
  title: string
  description: string
  ce_hours: number
  price: number
  thumbnail_url?: string
  average_rating: number
  enrollment_count: number
  texas_approved: boolean
}

interface SearchResults {
  results: SearchResult[]
  total: number
}

export function useSearch() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (query || Object.keys(filters).length > 0) {
      performSearch()
    }
  }, [query, filters])

  const performSearch = async () => {
    setLoading(true)
    try {
      let queryBuilder = supabase
        .from('courses')
        .select('*, enrollments(count)')
        .eq('is_published', true)

      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      }

      if (filters.category) {
        queryBuilder = queryBuilder.eq('category', filters.category)
      }

      if (filters.minCeHours) {
        queryBuilder = queryBuilder.gte('ce_hours', filters.minCeHours)
      }

      if (filters.maxPrice) {
        queryBuilder = queryBuilder.lte('price', filters.maxPrice)
      }

      if (filters.texasApproved) {
        queryBuilder = queryBuilder.eq('texas_approved', true)
      }

      const { data, error, count } = await queryBuilder

      if (error) throw error

      const formattedResults: SearchResult[] = (data || []).map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        ce_hours: course.ce_hours,
        price: course.price,
        thumbnail_url: course.thumbnail_url,
        average_rating: course.average_rating || 0,
        enrollment_count: course.enrollments?.[0]?.count || 0,
        texas_approved: course.texas_approved || false,
      }))

      setResults({
        results: formattedResults,
        total: count || formattedResults.length,
      })
    } catch (error) {
      console.error('Search error:', error)
      setResults({ results: [], total: 0 })
    } finally {
      setLoading(false)
    }
  }

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    loading,
  }
}
