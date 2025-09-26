'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface FormData {
  // Basic Information
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  
  // Professional Information
  role: 'student' | 'instructor'
  profession: string
  licenseType: string
  licenseNumber: string
  licenseState: string
  
  // Enrollment Information
  enrollmentType: 'course' | 'membership' | 'program' | 'general'
  courseId?: string
  membershipTier?: string
  programId?: string
  
  // Compliance & Terms
  agreeToTerms: boolean
  agreeToCERequirements: boolean
  marketingConsent: boolean
}

const professions = [
  'Licensed Professional Counselor (LPC)',
  'Licensed Clinical Social Worker (LCSW)',
  'Licensed Marriage and Family Therapist (LMFT)',
  'Psychologist',
  'Psychiatrist',
  'Counselor Associate',
  'Social Work Associate',
  'Other Mental Health Professional',
  'Student/Intern'
]

const membershipTiers = [
  { id: 'basic', name: 'Basic Membership', price: '$199/year', features: ['10 CE hours', 'Basic courses'] },
  { id: 'professional', name: 'Professional', price: '$399/year', features: ['25 CE hours', 'All courses', 'Certificates'] },
  { id: 'premium', name: 'Premium', price: '$699/year', features: ['Unlimited CE hours', 'All courses', 'Priority support', 'Exclusive content'] }
]

const programs = [
  { id: 'so-what-mindset', name: 'So What Mindset', price: '$499', description: 'Transform your practice with evidence-based mindset techniques' },
  { id: 'leap-and-launch', name: 'Leap & Launch', price: '$299', description: 'Launch your private practice with confidence' }
]

export default function Register() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'student',
    profession: '',
    licenseType: 'LPC',
    licenseNumber: '',
    licenseState: 'TX',
    enrollmentType: 'general',
    agreeToTerms: false,
    agreeToCERequirements: false,
    marketingConsent: false
  })

  // Check for enrollment parameters from URL
  useEffect(() => {
    const courseId = searchParams.get('course')
    const membership = searchParams.get('membership')
    const program = searchParams.get('program')
    
    if (courseId) {
      setFormData(prev => ({
        ...prev,
        enrollmentType: 'course',
        courseId
      }))
    } else if (membership) {
      setFormData(prev => ({
        ...prev,
        enrollmentType: 'membership',
        membershipTier: membership
      }))
    } else if (program) {
      setFormData(prev => ({
        ...prev,
        enrollmentType: 'program',
        programId: program
      }))
    }
  }, [searchParams])

  // Password strength calculator
  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 12) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    setPasswordStrength(strength)
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {}
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required'
      if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = 'Valid 10-digit phone number required'
    }
    
    if (step === 2) {
      if (formData.role === 'student') {
        if (!formData.profession) newErrors.profession = 'Profession is required'
        if (formData.profession !== 'Student/Intern' && !formData.licenseNumber) {
          newErrors.licenseNumber = 'License number is required for CE credits'
        }
      }
    }
    
    if (step === 3) {
      if (formData.password.length < 12) {
        newErrors.password = 'Password must be at least 12 characters'
      }
      if (passwordStrength < 3) {
        newErrors.password = 'Password must include uppercase, lowercase, numbers, and special characters'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms'
      }
      if (formData.role === 'student' && formData.profession !== 'Student/Intern' && !formData.agreeToCERequirements) {
        newErrors.agreeToCERequirements = 'You must agree to CE requirements'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate API call
    console.log('Registration data:', formData)
    
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect based on enrollment type
      if (formData.enrollmentType === 'course' && formData.courseId) {
        window.location.href = `/checkout?course=${formData.courseId}`
      } else if (formData.enrollmentType === 'membership') {
        window.location.href = `/checkout?membership=${formData.membershipTier}`
      } else if (formData.enrollmentType === 'program') {
        window.location.href = `/checkout?program=${formData.programId}`
      } else {
        window.location.href = '/dashboard'
      }
    }, 2000)
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'password') {
      calculatePasswordStrength(value)
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-primary to-background-secondary">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-primary">TheraBrake Academy</div>
            </Link>
            <div className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:text-primary-hover font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Enrollment Context Banner */}
        {formData.enrollmentType !== 'general' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-blue-800">
                {formData.enrollmentType === 'course' && `Enrolling in Course: ${formData.courseId}`}
                {formData.enrollmentType === 'membership' && `Purchasing ${membershipTiers.find(t => t.id === formData.membershipTier)?.name}`}
                {formData.enrollmentType === 'program' && `Enrolling in ${programs.find(p => p.id === formData.programId)?.name}`}
              </span>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-24 h-1 ${
                      currentStep > step ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-4">
            <span className="text-sm text-gray-600">Basic Info</span>
            <span className="text-sm text-gray-600">Professional</span>
            <span className="text-sm text-gray-600">Security</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value.replace(/\D/g, ''))}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="2145551234"
                    maxLength={10}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    I am registering as a:
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => updateFormData('role', 'student')}
                      className={`p-4 border-2 rounded-lg transition ${
                        formData.role === 'student'
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold mb-1">Student</div>
                      <div className="text-xs text-gray-600">Take courses & earn CE credits</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => updateFormData('role', 'instructor')}
                      className={`p-4 border-2 rounded-lg transition ${
                        formData.role === 'instructor'
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold mb-1">Instructor</div>
                      <div className="text-xs text-gray-600">Create & sell courses</div>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold transition"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Professional Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Professional Information</h2>
                
                {formData.role === 'student' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Profession <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.profession}
                        onChange={(e) => updateFormData('profession', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.profession ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select your profession</option>
                        {professions.map(prof => (
                          <option key={prof} value={prof}>{prof}</option>
                        ))}
                      </select>
                      {errors.profession && (
                        <p className="text-red-500 text-xs mt-1">{errors.profession}</p>
                      )}
                    </div>
                    
                    {formData.profession && formData.profession !== 'Student/Intern' && (
                      <>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-yellow-800">
                              <strong>CE Credit Eligibility:</strong> To receive CE credits, you must provide your professional license information.
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              License Type
                            </label>
                            <select
                              value={formData.licenseType}
                              onChange={(e) => updateFormData('licenseType', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="LPC">LPC</option>
                              <option value="LCSW">LCSW</option>
                              <option value="LMFT">LMFT</option>
                              <option value="PhD">PhD</option>
                              <option value="MD">MD</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              License Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.licenseNumber}
                              onChange={(e) => updateFormData('licenseNumber', e.target.value.toUpperCase())}
                              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="123456"
                            />
                            {errors.licenseNumber && (
                              <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              State
                            </label>
                            <select
                              value={formData.licenseState}
                              onChange={(e) => updateFormData('licenseState', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="TX">Texas</option>
                              <option value="OK">Oklahoma</option>
                              <option value="LA">Louisiana</option>
                              <option value="NM">New Mexico</option>
                              <option value="AR">Arkansas</option>
                              <option value="Other">Other State</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                      <h3 className="font-semibold mb-3 text-primary">Instructor Account Benefits</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Create unlimited courses with our Cut & Paste builder
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Earn 70% commission on course sales
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Access to analytics and student management tools
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Automatic CE credit approval for Texas
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-orange-800">
                          Instructor accounts require manual approval and verification within 24 hours
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Membership Options (if applicable) */}
                {formData.enrollmentType === 'membership' && (
                  <div className="space-y-4 mt-6">
                    <h3 className="font-semibold text-lg">Select Your Membership</h3>
                    {membershipTiers.map(tier => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => updateFormData('membershipTier', tier.id)}
                        className={`w-full p-4 border-2 rounded-lg text-left transition ${
                          formData.membershipTier === tier.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{tier.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {tier.features.map((f, i) => (
                                <span key={i}>{f}{i < tier.features.length - 1 && ' • '}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-lg font-bold text-primary">{tier.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-8 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold transition"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Security & Terms */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Secure Your Account</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Minimum 12 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded ${
                              passwordStrength >= level
                                ? level === 1 ? 'bg-red-500'
                                : level === 2 ? 'bg-yellow-500'
                                : level === 3 ? 'bg-blue-500'
                                : 'bg-green-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs mt-1 text-gray-600">
                        {passwordStrength === 0 && 'Very Weak'}
                        {passwordStrength === 1 && 'Weak'}
                        {passwordStrength === 2 && 'Fair'}
                        {passwordStrength === 3 && 'Good'}
                        {passwordStrength === 4 && 'Strong'}
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Re-enter your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
                
                {/* Terms & Agreements */}
                <div className="space-y-4 border-t pt-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                      className="mt-1 mr-3"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the {' '}
                      <Link href="/terms" className="text-primary hover:underline" target="_blank">
                        Terms of Service
                      </Link>
                      {' '} and {' '}
                      <Link href="/privacy" className="text-primary hover:underline" target="_blank">
                        Privacy Policy
                      </Link>
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  
                  {formData.role === 'student' && formData.profession !== 'Student/Intern' && (
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.agreeToCERequirements}
                        onChange={(e) => updateFormData('agreeToCERequirements', e.target.checked)}
                        className="mt-1 mr-3"
                      />
                      <span className="text-sm text-gray-700">
                        I understand the CE requirements for Texas and agree to complete all course requirements
                        to receive credit <span className="text-red-500">*</span>
                      </span>
                    </label>
                  )}
                  
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={(e) => updateFormData('marketingConsent', e.target.checked)}
                      className="mt-1 mr-3"
                    />
                    <span className="text-sm text-gray-700">
                      Send me tips, updates, and special offers (you can unsubscribe anytime)
                    </span>
                  </label>
                  
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>
                  )}
                  {errors.agreeToCERequirements && (
                    <p className="text-red-500 text-xs">{errors.agreeToCERequirements}</p>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-8 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-action hover:bg-action-hover text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        {formData.enrollmentType === 'general' ? 'Complete Registration' : 'Continue to Payment'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-8 mb-4">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              SSL Secured
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              PCI Compliant
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Texas CE Approved
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            Questions? Contact us at{' '}
            <a href="mailto:support@therabrakeacademy.com" className="text-primary hover:underline">
              support@therabrakeacademy.com
            </a>
            {' '}or call (214) 555-0123
          </p>
        </div>
      </div>
    </div>
  )
}
