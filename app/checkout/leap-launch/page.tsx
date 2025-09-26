'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Lock, CheckCircle } from 'lucide-react'

export default function LeapLaunchCheckoutPage() {
  const [processing, setProcessing] = useState(false)

  const handleEnrollment = () => {
    setProcessing(true)
    // Stripe integration will go here
    setTimeout(() => {
      alert('Enrollment process will be connected to Stripe payment gateway')
      setProcessing(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-therabrake max-w-4xl">
        <Link 
          href="/courses/leap-launch"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course Details
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Enrollment</h1>
            <p className="text-lg">Leap & Launch - Build Your Private Practice</p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Leap & Launch Program</span>
                    <span className="font-semibold">$299.00</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-action">$299.00</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold">Instant Access To:</h3>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Complete workbook with templates</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">10 video modules</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Downloadable resources & forms</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Lifetime access & updates</span>
                  </div>
                </div>
              </div>

              {/* Payment Form Placeholder */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-2">Secure Stripe Checkout</p>
                    <p className="text-sm text-gray-500">
                      Payment processing will be integrated with your Stripe account
                    </p>
                  </div>

                  <button
                    onClick={handleEnrollment}
                    disabled={processing}
                    className="w-full bg-action hover:bg-orange-600 text-white py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Complete Enrollment - $299.00
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
