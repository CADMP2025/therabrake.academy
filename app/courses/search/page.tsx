'use client';

import { useState } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { Search, Filter, Loader2 } from 'lucide-react';

export default function CourseSearchPage() {
  const [searchInput, setSearchInput] = useState('');
  const { query, setQuery, filters, setFilters, results, loading } = useSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">
            Find Your Perfect Course
          </h1>
          <p className="text-neutral-medium">
            Browse Texas LPC approved continuing education courses
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-medium w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-neutral-light">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-neutral-medium" />
            <h2 className="font-semibold">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg"
              >
                <option value="">All Categories</option>
                <option value="Ethics">Ethics</option>
                <option value="Clinical Skills">Clinical Skills</option>
                <option value="Supervision">Supervision</option>
                <option value="Diagnosis">Diagnosis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                CE Hours
              </label>
              <select
                value={filters.minCeHours || ''}
                onChange={(e) => setFilters({ ...filters, minCeHours: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg"
              >
                <option value="">Any</option>
                <option value="1">1+ hours</option>
                <option value="3">3+ hours</option>
                <option value="6">6+ hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Max Price
              </label>
              <select
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg"
              >
                <option value="">Any</option>
                <option value="50">Under $50</option>
                <option value="100">Under $100</option>
                <option value="200">Under $200</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.texasApproved || false}
                  onChange={(e) => setFilters({ ...filters, texasApproved: e.target.checked || undefined })}
                  className="w-4 h-4 text-primary border-neutral-light rounded"
                />
                <span className="text-sm font-medium text-neutral-dark">
                  Texas Approved Only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : results ? (
          <div>
            <p className="text-neutral-medium mb-4">
              Found {results.total} courses
            </p>
            <div className="grid gap-6">
              {results.results.map((course) => (
                <div key={course.id} className="bg-white border border-neutral-light rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-6">
                    <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0">
                      {course.thumbnail_url && (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-neutral-dark mb-2">
                        {course.title}
                      </h3>
                      <p className="text-neutral-medium mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                          {course.ce_hours} CE Hours
                        </span>
                        <span className="text-neutral-medium">
                          ⭐ {course.average_rating.toFixed(1)}
                        </span>
                        <span className="text-neutral-medium">
                          {course.enrollment_count} students
                        </span>
                        {course.texas_approved && (
                          <span className="px-2 py-1 bg-secondary/10 text-secondary rounded">
                            Texas Approved
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-neutral-dark mb-2">
                        ${course.price}
                      </p>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors">
                        View Course
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-medium">
            Start searching to find courses
          </div>
        )}
      </div>
    </div>
  );
}
