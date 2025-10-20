// app/auth/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Lock, Phone, Badge, MapPin, Eye, EyeOff, GraduationCap, BookOpen, Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface RegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  role: 'student' | 'instructor'
  
  // Student-specific
  studentType?: 'clinical' | 'non_clinical'
  licenseType?: string
  licenseNumber?: string
  licenseState?: string
  
  // Instructor-specific
  instructorLicenseType?: string
  instructorLicenseNumber?: string
  instructorLicenseState?: string
  licenseDocument?: File
  photoId?: File
  purposeStatement?: string
  
  agreeToTerms: boolean
  agreeToCERequirements?: boolean
}

interface FormErrors {
  [key: string]: string
}

export default function RegisterPage() {
  const router = useRouter()
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
    studentType: 'clinical',
    agreeToTerms: false,
    agreeToCERequirements: false
  })

  // Updated license types (removed Student/Intern)
  const clinicalLicenseTypes = [
    'Licensed Professional Counselor (LPC)',
    'LPC-Associate',
    'LPC-Supervisor',
    'Licensed Clinical Social Worker (LCSW)',
    'Licensed Marriage and Family Therapist (LMFT)',
    'Licensed Psychologist',
    'Licensed Psychiatrist',
    'Psychiatric Nurse Practitioner',
    'Licensed Substance Abuse Counselor',
    'School Counselor (Licensed)',
    'Other Licensed Professional'
  ]

  const instructorCredentialTypes = [
    'Licensed Professional Counselor (LPC)',
    'LPC-Supervisor',
    'Licensed Clinical Social Worker (LCSW)',
    'Licensed Marriage and Family Therapist (LMFT)',
    'Licensed Psychologist',
    'PhD (Mental Health/Psychology)',
    'PsyD (Psychology)',
    'EdD (Counseling/Education)',
    "Master's Degree (Counseling/Psychology)",
    'Other Advanced Degree'
  ]

  // ========================================
  // NEW: Get affiliate click ID from cookie (client-side)
  // ========================================
  const getAffiliateCookie = () => {
    const cookies = document.cookie.split(';')
    const affiliateCookie = cookies.find(c => c.trim().startsWith('affiliate_click_id='))
    return affiliateCookie ? affiliateCookie.split('=')[1] : null
  }
  // ========================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [fieldName]: 'File size must be less than 5MB' }))
        return
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [fieldName]: 'File must be JPG, PNG, or PDF' }))
        return
      }
      
      setFormData(prev => ({ ...prev, [fieldName]: file }))
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Basic validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
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
      newErrors.password = 'Must include uppercase, lowercase, number, and special character'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    // Student-specific validation
    if (formData.role === 'student') {
      if (!formData.studentType) {
        newErrors.studentType = 'Please select student type'
      }
      
      if (formData.studentType === 'clinical') {
        if (!formData.licenseType) newErrors.licenseType = 'License type is required'
        if (!formData.licenseNumber?.trim()) newErrors.licenseNumber = 'License number is required'
        if (!formData.licenseState) newErrors.licenseState = 'License state is required'
      }
    }
    
    // Instructor-specific validation
    if (formData.role === 'instructor') {
      if (!formData.instructorLicenseType) {
        newErrors.instructorLicenseType = 'Professional credential is required'
      }
      if (!formData.instructorLicenseNumber?.trim()) {
        newErrors.instructorLicenseNumber = 'Credential number is required'
      }
      if (!formData.instructorLicenseState) {
        newErrors.instructorLicenseState = 'State is required'
      }
      if (!formData.licenseDocument) {
        newErrors.licenseDocument = 'Professional license/degree is required'
      }
      if (!formData.photoId) {
        newErrors.photoId = 'Photo ID is required'
      }
      if (!formData.purposeStatement?.trim() || formData.purposeStatement.length < 200) {
        newErrors.purposeStatement = 'Purpose statement must be at least 200 characters'
      }
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadToSupabase = async (file: File, bucket: string, path: string) => {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${path}/${fileName}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return urlData.publicUrl
  }

  // ========================================
  // NEW: Function to associate affiliate click with user
  // ========================================
  const associateAffiliateClick = async (userId: string) => {
    const affiliateClickId = getAffiliateCookie()
    
    if (!affiliateClickId) {
      console.log('No affiliate click ID found')
      return
    }

    try {
      const supabase = createClient()
      
      // Associate the click with the newly registered user
      const { error } = await supabase
        .from('affiliate_clicks')
        .update({ conversion_user_id: userId })
        .eq('id', affiliateClickId)
      
      if (error) {
        console.error('Failed to associate affiliate click:', error)
      } else {
        console.log(`✅ Affiliate click ${affiliateClickId} associated with user ${userId}`)
      }
    } catch (error) {
      console.error('Error in affiliate association:', error)
    }
  }
  // ========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      
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
      if (!authData.user) throw new Error('User creation failed')

      // ========================================
      // NEW: Associate affiliate click with new user
      // ========================================
      await associateAffiliateClick(authData.user.id)
      // ========================================

      // Handle STUDENT registration
      if (formData.role === 'student') {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            role: 'student',
            phone: formData.phone || null,
            user_category: formData.studentType, // 'clinical' or 'non_clinical'
            is_licensed: formData.studentType === 'clinical',
            license_type: formData.studentType === 'clinical' ? formData.licenseType : null,
            license_number: formData.studentType === 'clinical' ? formData.licenseNumber : null,
            license_state: formData.studentType === 'clinical' ? formData.licenseState : null
          })
        
        if (profileError) throw profileError
        
        // Redirect to student dashboard
        router.push('/dashboard')
        
      } 
      // Handle INSTRUCTOR application
      else if (formData.role === 'instructor') {
        // Create user profile with 'pending' status
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            role: 'student', // Start as student until approved
            phone: formData.phone || null,
            instructor_application_status: 'pending'
          })
        
        if (profileError) throw profileError

        // Upload documents
        const licenseDocUrl = await uploadToSupabase(
          formData.licenseDocument!,
          'instructor-applications',
          `${authData.user.id}/license`
        )

        const photoIdUrl = await uploadToSupabase(
          formData.photoId!,
          'instructor-applications',
          `${authData.user.id}/photo-id`
        )

        // Create instructor application
        const { error: applicationError } = await supabase
          .from('instructor_applications')
          .insert({
            user_id: authData.user.id,
            license_type: formData.instructorLicenseType,
            license_number: formData.instructorLicenseNumber,
            license_state: formData.instructorLicenseState,
            license_document_url: licenseDocUrl,
            photo_id_url: photoIdUrl,
            purpose_statement: formData.purposeStatement,
            status: 'pending',
            submitted_at: new Date().toISOString()
          })

        if (applicationError) throw applicationError

        // Show success message
        alert('✅ Application Submitted!\n\nYour instructor application has been received and is pending admin review. You will receive an email within 3-5 business days.\n\nIn the meantime, you can browse courses as a student.')
        
        // Redirect to dashboard (as student for now)
        router.push('/dashboard')
      }
      
    } catch (error: any) {
      console.error('Registration error:', error)
      setErrors({ submit: error.message || 'Failed to create account. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-600 mt-2">Join TheraBrake Academy</p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">I want to:</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
              className={`p-6 border-2 rounded-lg transition-all ${
                formData.role === 'student'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <GraduationCap className="w-10 h-10 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold text-lg">Take Courses</h3>
              <p className="text-sm text-gray-600 mt-1">Access courses & earn CE credits</p>
            </button>
            
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'instructor' }))}
              className={`p-6 border-2 rounded-lg transition-all ${
                formData.role === 'instructor'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold text-lg">Teach Courses</h3>
              <p className="text-sm text-gray-600 mt-1">Create & manage courses</p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline w-4 h-4 mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  disabled={isLoading}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                  disabled={isLoading}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Lock className="inline w-4 h-4 mr-1" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Min. 12 characters"
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
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Lock className="inline w-4 h-4 mr-1" />
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
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
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Phone */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* REST OF YOUR FORM FIELDS - STUDENT SECTION, INSTRUCTOR SECTION, ETC. */}
          {/* I'm keeping the rest of your form as-is since it's working */}
          {/* Just add the rest of your existing form code here */}

          {/* STUDENT SECTION */}
          {formData.role === 'student' && (
            <div className="space-y-4 border-t pt-6">
              {/* Your existing student section code */}
            </div>
          )}

          {/* INSTRUCTOR SECTION */}
          {formData.role === 'instructor' && (
            <div className="space-y-6 border-t pt-6">
              {/* Your existing instructor section code */}
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                disabled={isLoading}
                className="mt-1 mr-3"
              />
              <label className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}

            {formData.role === 'student' && formData.studentType === 'clinical' && (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToCERequirements"
                  checked={formData.agreeToCERequirements}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="mt-1 mr-3"
                />
                <label className="text-sm text-gray-600">
                  I understand that CE credits require completing all course materials and passing quizzes with 80% or higher
                </label>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Processing...
              </>
            ) : (
              formData.role === 'instructor' ? 'Submit Application' : 'Create Account'
            )}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}