'use client'

import { TrendingUp, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CourseProgress {
  course_id: string
  course_title: string
  ce_hours: number
  progress: number
  status: 'active' | 'completed'
  quiz_score: number | null
  quiz_passed?: boolean
}

interface ProgressShowcaseProps {
  courseProgress: CourseProgress[]
}

export default function ProgressShowcase({ courseProgress }: ProgressShowcaseProps) {
  const router = useRouter()

  if (!courseProgress || courseProgress.length === 0) return null

  const nearestCompletion = courseProgress
    .filter(c => c.status === 'active')
    .sort((a, b) => b.progress - a.progress)[0]

  const totalCEInProgress = courseProgress.reduce((sum, c) => sum + c.ce_hours, 0)
  const averageProgress = courseProgress.reduce((sum, c) => sum + c.progress, 0) / courseProgress.length

  return (
    <div className="mb-12 bg-white rounded-2xl shadow-lg p-8 border-2 border-primary/10">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold text-neutral-dark">
          You're Making Progress!
        </h2>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-neutral-dark">
            Overall Course Progress
          </p>
          <p className="text-sm font-semibold text-primary">
            {Math.round(averageProgress)}% Complete
          </p>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${averageProgress}%` }}
          />
        </div>
        <p className="text-xs text-neutral-medium mt-2">
          {totalCEInProgress} CE hours in progress across {courseProgress.length} course{courseProgress.length !== 1 ? 's' : ''}
        </p>
      </div>

      {nearestCompletion && (
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary mb-1">
                You're closest to completing:
              </p>
              <h3 className="text-lg font-semibold text-neutral-dark mb-2">
                {nearestCompletion.course_title}
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${nearestCompletion.progress}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm font-semibold text-primary">
                  {Math.round(nearestCompletion.progress)}%
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-medium">
                <span>{nearestCompletion.ce_hours} CE Hours</span>
                {nearestCompletion.quiz_score !== null && (
                  <span className={nearestCompletion.quiz_passed ? 'text-secondary' : 'text-alert'}>
                    Quiz: {nearestCompletion.quiz_score}%
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => router.push('/student/courses/')}
              className="btn-primary whitespace-nowrap"
            >
              Continue Course
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-neutral-dark mb-4">
          Your Active Courses
        </h3>
        {courseProgress.map((course) => (
          <div 
            key={course.course_id}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => router.push('/student/courses/')}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-neutral-medium" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-neutral-dark truncate">
                {course.course_title}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-medium">
                  {Math.round(course.progress)}%
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-neutral-dark">
                {course.ce_hours} CE
              </p>
              {course.quiz_score !== null && (
                <p className="text-xs text-neutral-medium">
                  {course.quiz_passed ? 'Passed' : 'Retry Quiz'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-neutral-dark mb-1">
              You're on the right track!
            </p>
            <p className="text-sm text-neutral-medium">
              {nearestCompletion && nearestCompletion.progress >= 80
                ? `Just a few more lessons to complete ${nearestCompletion.course_title} and earn your certificate!`
                : nearestCompletion && nearestCompletion.progress >= 50
                ? `You're halfway through ${nearestCompletion.course_title}. Keep up the great work!`
                : 'Consistent progress is key. Try to complete at least one lesson each day.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
