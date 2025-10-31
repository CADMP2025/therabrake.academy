'use client'

import { BookOpen, Clock, Star } from 'lucide-react'
import Link from 'next/link'
import { currentCECourses, type ProfessionalCourse } from '@/lib/resources/professionalCourses'

export default function CourseRecommendations() {
  // Get top 3 recommended courses
  const recommendedCourses = currentCECourses.slice(0, 3)

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-neutral-dark">
          Recommended Courses to Get Started
        </h3>
        <Link href="/courses" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </div>
      <p className="mb-6 text-sm text-neutral-medium">
        Start earning CE credits with these popular Texas LPC-approved courses
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendedCourses.map((course: ProfessionalCourse) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group rounded-xl border border-neutral-light p-4 transition-all hover:border-primary hover:shadow-md"
          >
            {/* Course Badge */}
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                <Star className="h-3 w-3" />
                Popular
              </span>
              <span className="text-xs text-neutral-medium">{course.hours} CE</span>
            </div>

            {/* Course Title */}
            <h4 className="mb-2 font-semibold text-neutral-dark group-hover:text-primary">
              {course.title}
            </h4>

            {/* Course Description */}
            <p className="mb-3 line-clamp-2 text-sm text-neutral-medium">
              {course.shortDescription}
            </p>

            {/* Course Meta */}
            <div className="flex items-center gap-3 text-xs text-neutral-medium">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.hours} hours
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                ${course.price}
              </span>
            </div>

            {/* CTA */}
            <div className="mt-4 pt-3 border-t border-neutral-light">
              <span className="text-sm font-medium text-primary group-hover:underline">
                Start Learning →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* View All CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-dark transition-colors hover:bg-neutral-100"
        >
          <BookOpen className="h-4 w-4" />
          Browse All Courses
        </Link>
      </div>
    </div>
  )
}
