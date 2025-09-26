'use client'

import Link from 'next/link'
import { Clock, Award, Star } from 'lucide-react'
import { Course } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="card overflow-hidden group cursor-pointer h-full">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 relative overflow-hidden">
          {course.thumbnail_url ? (
            <img 
              src={course.thumbnail_url} 
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Award className="w-16 h-16 text-primary-300" />
            </div>
          )}
          {course.featured && (
            <span className="absolute top-4 left-4 bg-accent text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.ce_hours} CE Hours
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              {course.average_rating || 'New'}
            </span>
          </div>
          
          <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.short_description || course.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(course.price)}
            </span>
            <span className="text-sm text-gray-500">
              {course.enrollment_count} enrolled
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
