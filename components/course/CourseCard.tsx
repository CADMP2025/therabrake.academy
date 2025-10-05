'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  Clock, 
  Users, 
  Award, 
  Star, 
  Brain, 
  Heart, 
  Shield, 
  Zap,
  Target,
  Sparkles,
  BookOpen,
  GraduationCap
} from 'lucide-react'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    thumbnail_url?: string
    price: number
    ce_hours: number
    instructor: {
      full_name: string
    }
    category?: string
    difficulty?: string
    enrollment_count?: number
    rating?: number
  }
}

// Icon mapping for different course categories
const categoryIcons = {
  'mental-health': Brain,
  'therapy-techniques': Heart,
  'ethics': Shield,
  'trauma': Zap,
  'cognitive-behavioral': Target,
  'mindfulness': Sparkles,
  'general': BookOpen,
  'certification': GraduationCap,
}

// Color schemes for different categories
const categoryColors = {
  'mental-health': 'course-icon-primary',
  'therapy-techniques': 'course-icon-secondary',
  'ethics': 'course-icon-accent',
  'trauma': 'course-icon-action',
  'cognitive-behavioral': 'course-icon-primary',
  'mindfulness': 'course-icon-secondary',
  'general': 'course-icon-accent',
  'certification': 'course-icon-action',
}

export default function CourseCard({ course }: CourseCardProps) {
  const category = course.category || 'general'
  const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || BookOpen
  const iconColorClass = categoryColors[category as keyof typeof categoryColors] || 'course-icon-primary'

  return (
    <Link href={`/courses/${course.id}`}>
      <div className="card card-hover h-full">
        {/* Course Thumbnail or Icon */}
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className={`course-icon ${iconColorClass} scale-150`}>
                <IconComponent className="w-8 h-8" />
              </div>
            </div>
          )}
          
          {/* CE Hours Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-primary flex items-center gap-1">
              <Award className="w-4 h-4" />
              {course.ce_hours} CE
            </span>
          </div>

          {/* Difficulty Badge */}
          {course.difficulty && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-text-secondary">
                {course.difficulty}
              </span>
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="p-6 space-y-4">
          {/* Category Icon and Title */}
          <div className="flex items-start gap-3">
            <div className={`course-icon ${iconColorClass} flex-shrink-0`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-lg text-text-primary line-clamp-2 hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                by {course.instructor.full_name}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary line-clamp-3">
            {course.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.ce_hours}h
              </span>
              {course.enrollment_count && (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.enrollment_count}
                </span>
              )}
              {course.rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  {course.rating}
                </span>
              )}
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <span className="text-2xl font-bold text-primary">
                ${course.price}
              </span>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
              View Course
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
