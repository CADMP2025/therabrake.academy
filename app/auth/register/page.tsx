'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    licenseNumber: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Registration:', formData)
  }

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Create Your Account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Account Type</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          
          {formData.role === 'student' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Texas LPC License # (Optional)</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="Enter for CE credit eligibility"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-action hover:bg-action-hover text-white py-3 rounded-lg font-semibold transition mb-4"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t text-center">
          <p>Already have an account? {' '}
            <Link href="/auth/login" className="text-primary hover:text-primary-hover font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
