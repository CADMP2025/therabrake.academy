'use client'

import Link from 'next/link'
import { Star, Clock, Award, Users, Tag, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import type { CourseWithDetails } from '@/types/catalog'

interface CourseCardProps {
  course: CourseWithDetails
  showTags?: boolean
  showInstructor?: boolean
}

export function CourseCard({ course, showTags = true, showInstructor = false }: CourseCardProps) {
  const {
    id,
    slug,
    title,
    description,
    category,
    price,
    ce_hours,
    thumbnail_url,
    average_rating,
    total_reviews,
    total_enrollments,
    coming_soon,
    launch_date,
    difficulty_level,
    tags,
    instructor,
  } = course

  const courseUrl = slug ? `/courses/${slug}` : `/courses/${id}`

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Award className="w-16 h-16 text-white/50" />
          </div>
        )}
        
        {/* Coming Soon Badge */}
        {coming_soon && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-orange-500 text-white">
              Coming Soon
            </Badge>
          </div>
        )}
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {category}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        {/* Title */}
        <Link href={courseUrl}>
          <h3 className="text-lg font-semibold line-clamp-2 hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>

        {/* Instructor */}
        {showInstructor && instructor && (
          <p className="text-sm text-gray-600">
            by {instructor.full_name}
          </p>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        {/* Rating */}
        {average_rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(average_rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{average_rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({total_reviews})</span>
          </div>
        )}

        {/* Course Info */}
        <div className="space-y-2 text-sm">
          {ce_hours && (
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4" />
              <span>{ce_hours} CE Hours</span>
            </div>
          )}
          
          {total_enrollments > 0 && (
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="w-4 h-4" />
              <span>{total_enrollments.toLocaleString()} enrolled</span>
            </div>
          )}

          {difficulty_level && (
            <div className="flex items-center gap-2 text-gray-700">
              <Award className="w-4 h-4" />
              <span className="capitalize">{difficulty_level}</span>
            </div>
          )}

          {launch_date && coming_soon && (
            <div className="flex items-center gap-2 text-orange-600">
              <Calendar className="w-4 h-4" />
              <span>
                Launches {new Date(launch_date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {showTags && tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-xs"
                style={{ borderColor: tag.color, color: tag.color }}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.name}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        {/* Price */}
        <div className="text-2xl font-bold text-blue-600">
          ${price.toFixed(2)}
        </div>

        {/* CTA Button */}
        <Link href={courseUrl}>
          <Button
            variant={coming_soon ? 'outline' : 'default'}
            size="sm"
            className={coming_soon ? '' : 'bg-blue-600 hover:bg-blue-700'}
          >
            {coming_soon ? 'Learn More' : 'View Course'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
