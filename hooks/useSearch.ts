import { useState, useEffect } from 'react';
import { SearchFilters, SearchOptions, SearchResponse } from '@/lib/search/types';

export function useSearch(
  initialQuery: string = '',
  initialFilters: SearchFilters = {},
  initialOptions: SearchOptions = {}
) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [options, setOptions] = useState<SearchOptions>(initialOptions);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchCourses = async () => {
      if (!query && Object.keys(filters).length === 0) {
        setResults(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Build query string
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (options.page) params.set('page', options.page.toString());
        if (options.limit) params.set('limit', options.limit.toString());
        if (options.sortBy) params.set('sortBy', options.sortBy);
        if (options.sortOrder) params.set('sortOrder', options.sortOrder);
        
        // Add filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.set(key, value.toString());
          }
        });

        const response = await fetch(`/api/search/courses?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setResults(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchCourses, 300);
    return () => clearTimeout(timeoutId);
  }, [query, filters, options]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    options,
    setOptions,
    results,
    loading,
    error
  };
}
