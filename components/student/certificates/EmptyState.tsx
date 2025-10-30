'use client'

import { Award, BookOpen, TrendingUp, Target } from 'lucide-react'
import Link from 'next/link'
import ProgressShowcase from '@/components/student/certificates/ProgressShowcase'
import CourseRecommendations from '@/components/student/certificates/CourseRecommendations'
import CERequirementCalculator from '@/components/student/certificates/CERequirementCalculator'

interface EmptyStateProps {
  inProgressCount: number
  completedCount: number
  totalCEHours: number
  courseProgress: Array<{
    course_id: string
    course_title: string
    ce_hours: number
    progress: number
    status: 'active' | 'completed'
    quiz_score: number | null
    quiz_passed?: boolean
  }>
}

export default function EmptyState({ inProgressCount, completedCount, totalCEHours, courseProgress }: EmptyStateProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section - Motivational Message */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
          <Award className="h-10 w-10 text-primary" />
        </div>
        <h2 className="mb-3 text-3xl font-bold text-neutral-dark">
          Your Certificate Journey Starts Here
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-lg text-neutral-medium">
          Every expert was once a beginner. Complete your first course to earn your Texas LPC-approved CE certificate 
          and take the next step in your professional development.
        </p>
        
        {/* Quick Stats */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-1 text-3xl font-bold text-primary">{inProgressCount}</div>
            <div className="text-sm text-neutral-medium">Courses in Progress</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-1 text-3xl font-bold text-secondary">{completedCount}</div>
            <div className="text-sm text-neutral-medium">Courses Completed</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-1 text-3xl font-bold text-accent">{totalCEHours.toFixed(1)}</div>
            <div className="text-sm text-neutral-medium">CE Hours Earned</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/courses" className="btn-primary inline-flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Browse Courses
          </Link>
          {inProgressCount > 0 && (
            <Link href="/dashboard" className="btn-secondary inline-flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Continue Learning
            </Link>
          )}
        </div>
      </div>

      {/* Progress Showcase */}
      {inProgressCount > 0 && courseProgress.length > 0 && (
        <ProgressShowcase courseProgress={courseProgress} />
      )}

      {/* CE Requirements Calculator */}
      <CERequirementCalculator currentHours={totalCEHours} />

      {/* Course Recommendations */}
      <CourseRecommendations />

      {/* Benefits Section */}
      <div className="rounded-xl border-2 border-dashed border-neutral-light bg-white p-8">
        <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-neutral-dark">
          <Target className="h-6 w-6 text-primary" />
          Why Earn Your Certificates?
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold text-neutral-dark">Texas LPC Approved</h4>
            <p className="text-sm text-neutral-medium">
              All our certificates meet Texas State Board requirements for continuing education credits.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
              <BookOpen className="h-6 w-6 text-secondary" />
            </div>
            <h4 className="font-semibold text-neutral-dark">Instant Verification</h4>
            <p className="text-sm text-neutral-medium">
              Every certificate includes a unique QR code and verification number for instant validation.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <h4 className="font-semibold text-neutral-dark">Track Your Growth</h4>
            <p className="text-sm text-neutral-medium">
              Build your professional portfolio with documented proof of your continuing education journey.
            </p>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="rounded-xl bg-neutral-50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-neutral-dark">
          How to Earn Your First Certificate
        </h3>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              1
            </span>
            <div>
              <div className="font-medium text-neutral-dark">Choose a Course</div>
              <div className="text-sm text-neutral-medium">
                Browse our catalog and select a course that interests you
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              2
            </span>
            <div>
              <div className="font-medium text-neutral-dark">Complete the Content</div>
              <div className="text-sm text-neutral-medium">
                Watch all videos, read materials, and engage with the content
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              3
            </span>
            <div>
              <div className="font-medium text-neutral-dark">Pass the Quiz</div>
              <div className="text-sm text-neutral-medium">
                Demonstrate your knowledge with a passing score of 70% or higher
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              4
            </span>
            <div>
              <div className="font-medium text-neutral-dark">Receive Your Certificate</div>
              <div className="text-sm text-neutral-medium">
                Download your official certificate with QR verification instantly
              </div>
            </div>
          </li>
        </ol>
      </div>
    </div>
  )
}
