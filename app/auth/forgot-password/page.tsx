'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Password reset requested for:', email)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Reset Password</h2>
        
        {!submitted ? (
          <>
            <p className="text-gray-600 text-center mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition mb-4"
              >
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
              <p className="text-gray-600">
                We've sent a password reset link to {email}
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t text-center">
          <Link href="/auth/login" className="text-primary hover:text-primary-hover font-semibold">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
