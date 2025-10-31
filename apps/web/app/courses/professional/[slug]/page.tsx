import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, DollarSign, ArrowLeft } from 'lucide-react'
import { getCourseById } from '@/lib/resources/professionalCourses'
import AuthenticatedEnrollButton from '@/components/enrollment/AuthenticatedEnrollButton'

type Props = { params: { slug: string } }

export default function ProfessionalCourseDetailPage({ params }: Props) {
  const course = getCourseById(params.slug)
  if (!course) return notFound()

  return (
    <div className="min-h-screen bg-background-light py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/courses/professional" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Professional Courses
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10">
          <h1 className="text-3xl font-bold text-text-primary mb-2">{course.title}</h1>
          <div className="flex items-center gap-6 text-text-secondary mb-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{course.hours} CE Hours</span>
            </div>
            <div className="flex items-center font-semibold text-secondary">
              <DollarSign className="h-4 w-4" />
              <span>{course.price}</span>
            </div>
          </div>

          <div className="prose prose-neutral max-w-none">
            <p className="text-lg text-text-secondary whitespace-pre-line">{course.fullDescription}</p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <AuthenticatedEnrollButton
              courseId={course.id}
              productType="course"
              price={course.price}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition font-medium"
            >
              Enroll Now
            </AuthenticatedEnrollButton>
            <Link
              href="/pricing"
              className="w-full text-center bg-action text-white py-3 rounded-lg hover:bg-action/90 transition font-medium"
            >
              View Membership Options
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
