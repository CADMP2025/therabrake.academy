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

          {/* STUDENT SECTION */}
          {formData.role === 'student' && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Student Information</h3>
              
              {/* Student Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">I am a: *</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, studentType: 'clinical' }))}
                    disabled={isLoading}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.studentType === 'clinical'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Badge className="w-6 h-6 mb-2 text-blue-600" />
                    <h4 className="font-semibold">Clinical Student</h4>
                    <p className="text-sm text-gray-600">Licensed mental health professional seeking CE credits</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, studentType: 'non_clinical' }))}
                    disabled={isLoading}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.studentType === 'non_clinical'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <GraduationCap className="w-6 h-6 mb-2 text-green-600" />
                    <h4 className="font-semibold">Non-Clinical Student</h4>
                    <p className="text-sm text-gray-600">Personal development courses (no CE credits needed)</p>
                  </button>
                </div>
                {errors.studentType && <p className="text-red-500 text-xs mt-1">{errors.studentType}</p>}
              </div>

              {/* Clinical Student Fields */}
              {formData.studentType === 'clinical' && (
                <div className="grid md:grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Type *
                    </label>
                    <select
                      name="licenseType"
                      value={formData.licenseType}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select your license...</option>
                      {clinicalLicenseTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.licenseType && <p className="text-red-500 text-xs mt-1">{errors.licenseType}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number *
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="LPC123456"
                    />
                    {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State of Licensure *
                    </label>
                    <select
                      name="licenseState"
                      value={formData.licenseState}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select state...</option>
                      <option value="TX">Texas</option>
                      <option value="OK">Oklahoma</option>
                      <option value="LA">Louisiana</option>
                      <option value="NM">New Mexico</option>
                      <option value="AR">Arkansas</option>
                    </select>
                    {errors.licenseState && <p className="text-red-500 text-xs mt-1">{errors.licenseState}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INSTRUCTOR SECTION */}
          {formData.role === 'instructor' && (
            <div className="space-y-6 border-t pt-6">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">Application Review Required</h4>
                    <p className="text-sm text-yellow-800 mt-1">
                      Your instructor application will be reviewed by our admin team within 3-5 business days. 
                      You'll receive an email notification with the decision.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold">Professional Credentials</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional License/Credential *
                  </label>
                  <select
                    name="instructorLicenseType"
                    value={formData.instructorLicenseType}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your credential...</option>
                    {instructorCredentialTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.instructorLicenseType && <p className="text-red-500 text-xs mt-1">{errors.instructorLicenseType}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License/Credential Number *
                  </label>
                  <input
                    type="text"
                    name="instructorLicenseNumber"
                    value={formData.instructorLicenseNumber}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="LPC-S123456"
                  />
                  {errors.instructorLicenseNumber && <p className="text-red-500 text-xs mt-1">{errors.instructorLicenseNumber}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    name="instructorLicenseState"
                    value={formData.instructorLicenseState}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select state...</option>
                    <option value="TX">Texas</option>
                    <option value="OK">Oklahoma</option>
                    <option value="LA">Louisiana</option>
                    <option value="NM">New Mexico</option>
                    <option value="AR">Arkansas</option>
                  </select>
                  {errors.instructorLicenseState && <p className="text-red-500 text-xs mt-1">{errors.instructorLicenseState}</p>}
                </div>
              </div>

              {/* Document Uploads */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Required Documents</h3>
                <p className="text-sm text-gray-600">All files must be PDF, JPG, or PNG format (max 5MB each)</p>
                
                {/* License/Degree Upload */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Professional License or Degree Certificate *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, 'licenseDocument')}
                    disabled={isLoading}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {formData.licenseDocument && (
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {formData.licenseDocument.name}
                    </p>
                  )}
                  {errors.licenseDocument && <p className="text-red-500 text-xs mt-1">{errors.licenseDocument}</p>}
                </div>
                
                {/* Photo ID Upload */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="inline w-4 h-4 mr-1" />
                    Government-Issued Photo ID *
                  </label>
                  <p className="text-xs text-gray-600 mb-2">Driver's license, passport, or state ID</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, 'photoId')}
                    disabled={isLoading}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {formData.photoId && (
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {formData.photoId.name}
                    </p>
                  )}
                  {errors.photoId && <p className="text-red-500 text-xs mt-1">{errors.photoId}</p>}
                </div>
              </div>

              {/* Purpose Statement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to become a course provider at TheraBrake Academy? *
                </label>
                <p className="text-xs text-gray-600 mb-2">
                  Tell us about your teaching experience, expertise, and what you hope to contribute (minimum 200 characters)
                </p>
                <textarea
                  name="purposeStatement"
                  value={formData.purposeStatement}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="I am passionate about teaching mental health professionals because..."
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {formData.purposeStatement?.length || 0} / 200 minimum characters
                  </span>
                  {errors.purposeStatement && <p className="text-red-500 text-xs">{errors.purposeStatement}</p>}
                </div>
              </div>
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