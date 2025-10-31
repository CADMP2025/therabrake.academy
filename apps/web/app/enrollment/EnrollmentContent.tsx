import { Suspense } from 'react'
import EnrollmentContent from './EnrollmentContent'
import { Loader2 } from 'lucide-react'

export const metadata = {
  title: 'Enrollment | TheraBrake Academy',
  description: 'Complete your course enrollment',
}

export default function EnrollmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading enrollment details...</p>
        </div>
      </div>
    }>
      <EnrollmentContent />
    </Suspense>
  )
}
