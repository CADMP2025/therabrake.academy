#!/bin/bash

# Fix the register page TypeScript error
cat > app/auth/register/page.tsx << 'EOFILE'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { User, Mail, Lock, Phone, Badge, MapPin, Loader2, Eye, EyeOff, GraduationCap, BookOpen, Briefcase, Heart, Users, UserCheck, Building2 } from 'lucide-react'

// Define the form data interface
interface RegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  role: 'student' | 'instructor'
  licenseNumber?: string
  licenseState?: string
  profession?: string
  agreeToTerms: boolean
  agreeToCERequirements?: boolean
}

// Define the errors interface with string types for error messages
interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  phone?: string
  licenseNumber?: string
  licenseState?: string
  profession?: string
  agreeToTerms?: string
  agreeToCERequirements?: string
  submit?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'student',
    licenseNumber: '',
    licenseState: '',
    profession: '',
    agreeToTerms: false,
    agreeToCERequirements: false
  })

  const professionOptions = [
    'Licensed Professional Counselor (LPC)',
    'Licensed Clinical Social Worker (LCSW)',
    'Licensed Marriage and Family Therapist (LMFT)',
    'Psychologist',
    'Psychiatrist',
    'Psychiatric Nurse Practitioner',
    'Substance Abuse Counselor',
    'School Counselor',
    'Student/Intern',
    'Other Mental Health Professional'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 12) {
      newErrors.password = 'Password must be at least 12 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number, and special character'
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    // Role-specific validation
    if (formData.role === 'instructor') {
      if (!formData.licenseNumber?.trim()) {
        newErrors.licenseNumber = 'License number is required for instructors'
      }
      if (!formData.licenseState) {
        newErrors.licenseState = 'License state is required for instructors'
      }
    }
    
    // Student-specific validation
    if (formData.role === 'student') {
      if (!formData.profession) {
        newErrors.profession = 'Please select your profession'
      }
    }
    
    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms'
    }
    
    // CE requirements for non-student mental health professionals
    if (formData.role === 'student' && formData.profession !== 'Student/Intern' && !formData.agreeToCERequirements) {
      newErrors.agreeToCERequirements = 'You must agree to CE requirements'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role
          }
        }
      })
      
      if (authError) throw authError
      
      // Create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            role: formData.role,
            phone: formData.phone || null,
            license_number: formData.role === 'instructor' ? formData.licenseNumber : null,
            license_state: formData.role === 'instructor' ? formData.licenseState : null,
            profession: formData.role === 'student' ? formData.profession : null
          })
        
        if (profileError) throw profileError
        
        // Redirect based on role
        router.push(formData.role === 'instructor' ? '/instructor' : '/dashboard')
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create account' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Create Your Account</h1>
          <p className="text-text-secondary mt-2">Join TheraBrake Academy and start learning</p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-text-secondary mb-3">I am a:</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.role === 'student'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <GraduationCap className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Student</h3>
              <p className="text-sm text-text-secondary">Access courses & earn CE credits</p>
            </button>
            
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'instructor' }))}
              className={`p-4 border-2 rounded-lg transition-all ${
                formData.role === 'instructor'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-secondary" />
              <h3 className="font-semibold">Instructor</h3>
              <p className="text-sm text-text-secondary">Create & manage courses</p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                <User className="inline w-4 h-4 mr-1" />
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="John Doe"
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                <Mail className="inline w-4 h-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="john@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                <Lock className="inline w-4 h-4 mr-1" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                <Lock className="inline w-4 h-4 mr-1" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                <Phone className="inline w-4 h-4 mr-1" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="(555) 123-4567"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Profession (for students) */}
            {formData.role === 'student' && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  <Briefcase className="inline w-4 h-4 mr-1" />
                  Profession
                </label>
                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="">Select Profession</option>
                  {professionOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.profession && (
                  <p className="text-red-500 text-xs mt-1">{errors.profession}</p>
                )}
              </div>
            )}

            {/* License fields for instructors */}
            {formData.role === 'instructor' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    <Badge className="inline w-4 h-4 mr-1" />
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="LPC123456"
                    disabled={isLoading}
                  />
                  {errors.licenseNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    License State
                  </label>
                  <select
                    name="licenseState"
                    value={formData.licenseState}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="">Select State</option>
                    <option value="TX">Texas</option>
                    <option value="OK">Oklahoma</option>
                    <option value="LA">Louisiana</option>
                    <option value="NM">New Mexico</option>
                    <option value="AR">Arkansas</option>
                  </select>
                  {errors.licenseState && (
                    <p className="text-red-500 text-xs mt-1">{errors.licenseState}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-3">
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 mr-2"
                disabled={isLoading}
              />
              <label className="text-sm text-text-secondary">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:text-primary-hover underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:text-primary-hover underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>
            )}

            {/* CE Requirements for non-student professionals */}
            {formData.role === 'student' && formData.profession && formData.profession !== 'Student/Intern' && (
              <>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToCERequirements"
                    checked={formData.agreeToCERequirements}
                    onChange={handleInputChange}
                    className="mt-1 mr-2"
                    disabled={isLoading}
                  />
                  <label className="text-sm text-text-secondary">
                    I understand that CE credits require passing quizzes with 70% or higher and completing all course materials
                  </label>
                </div>
                {errors.agreeToCERequirements && (
                  <p className="text-red-500 text-xs">{errors.agreeToCERequirements}</p>
                )}
              </>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:text-primary-hover font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
EOFILE

echo "Fixed TypeScript errors in register page"
npm run build
