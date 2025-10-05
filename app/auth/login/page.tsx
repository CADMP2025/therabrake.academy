'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', credentials)
  }

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold transition mb-4"
          >
            Sign In
          </button>
        </form>
        
        <div className="text-center">
          <Link href="/auth/forgot-password" className="text-primary hover:text-primary-hover">
            Forgot Password?
          </Link>
        </div>
        
        <div className="mt-6 pt-6 border-t text-center">
          <p>Don't have an account? {' '}
            <Link href="/auth/register" className="text-primary hover:text-primary-hover font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}