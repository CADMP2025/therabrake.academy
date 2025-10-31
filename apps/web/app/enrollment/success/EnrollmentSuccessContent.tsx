import { Suspense } from 'react'
import EnrollmentSuccessContent from './EnrollmentSuccessContent'
import { Loader2 } from 'lucide-react'

export const metadata = {
  title: 'Enrollment Successful | TheraBrake Academy',
  description: 'Your enrollment is complete',
}

export default function EnrollmentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Verifying your enrollment...</p>
        </div>
      </div>
    }>
      <EnrollmentSuccessContent />
    </Suspense>
  )
}
