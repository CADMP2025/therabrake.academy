import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
            Pause, Process, <span className="text-primary">Progress</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Texas-approved continuing education courses for mental health professionals. 
            Build your knowledge, expand your practice, and maintain your license with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="btn-primary">
              Browse Courses
            </Link>
            <Link href="/auth/register" className="btn-secondary">
              Start Free Trial
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary">31+</div>
              <div className="text-gray-600">CE Hours Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">100%</div>
              <div className="text-gray-600">Texas LPC Approved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-action">$9.99</div>
              <div className="text-gray-600">Per CE Hour</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
