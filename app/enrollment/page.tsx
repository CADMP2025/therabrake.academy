'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  Rocket,
  Shield,
  User,
  AlertCircle,
  Loader2,
  Calendar,
  Award,
  BookOpen,
  Sprout
} from 'lucide-react'

// Type definitions
type EnrollmentType = 'ce' | 'personal' | 'premium' | 'individual' | 'membership'
type PaymentFrequency = 'monthly' | 'annual' | 'onetime'

interface PlanDetails {
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  duration: string
  features: string[]
  type: EnrollmentType
  icon: React.ReactNode
  color: string
}

// Plan configurations
const PLAN_DETAILS: Record<string, PlanDetails> = {
  // CE Memberships
  'ce-1year': {
    name: '1-Year CE Membership',
    description: 'Complete access to all CE courses for annual license renewal',
    price: 199,
    duration: '12 months',
    features: [
      'Access to all 31+ CE credit hours',
      'Texas LPC approved courses',
      'Instant certificate generation',
      'Progress tracking dashboard',
      'New courses added monthly'
    ],
    type: 'ce',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'primary'
  },
  'ce-2year': {
    name: '2-Year CE Membership',
    description: 'Best value for biennial license renewals',
    price: 299,
    duration: '24 months',
    features: [
      'Everything in 1-Year membership',
      '$100 discount on So What Mindset',
      '$100 discount on Leap & Launch',
      'Priority customer support',
      'Early access to new content'
    ],
    type: 'ce',
    icon: <Award className="w-6 h-6" />,
    color: 'action'
  },
  'ce-5year': {
    name: '5-Year CE + Personal Development',
    description: 'Ultimate professional and personal growth package',
    price: 699,
    duration: '60 months',
    features: [
      'All CE courses (200+ hours when complete)',
      'All personal development courses',
      'Premium program discounts',
      'VIP member benefits',
      'Lifetime course updates'
    ],
    type: 'ce',
    icon: <Rocket className="w-6 h-6" />,
    color: 'secondary'
  },
  // Personal Development
  'personal-1year': {
    name: '1-Year Personal Development',
    description: 'Transform your personal and professional life',
    price: 299,
    duration: '12 months',
    features: [
      'All personal growth courses',
      'Relationship enhancement tools',
      'Resilience building programs',
      'Health & wellness modules',
      'Financial planning resources'
    ],
    type: 'personal',
    icon: <Sprout className="w-6 h-6" />,
    color: 'secondary'
  },
  'personal-2year': {
    name: '2-Year Personal Development',
    description: 'Extended access for lasting transformation',
    price: 399,
    duration: '24 months',
    features: [
      'Everything in 1-Year membership',
      '$100 off So What Mindset',
      '$100 off Leap & Launch',
      'Bonus workshops and webinars',
      'Community access'
    ],
    type: 'personal',
    icon: <Sprout className="w-6 h-6" />,
    color: 'secondary'
  },
  'personal-5year': {
    name: '5-Year Personal Development',
    description: 'Lock in the lowest rate for continuous growth',
    price: 699,
    duration: '60 months',
    features: [
      'All personal development content',
      'Exclusive member-only courses',
      'Premium program discounts',
      'Quarterly coaching calls',
      'Lifetime updates'
    ],
    type: 'personal',
    icon: <Sprout className="w-6 h-6" />,
    color: 'secondary'
  },
  // Premium Programs
  'so-what-mindset': {
    name: 'The So What Mindset',
    description: 'Transformational thinking and resilience training',
    price: 499,
    originalPrice: 499,
    discount: 100,
    duration: '6 months',
    features: [
      'Complete transformation framework',
      'Weekly video modules',
      'Interactive workbooks',
      'Group coaching sessions',
      'Certificate of completion',
      'Member discount available ($399)'
    ],
    type: 'premium',
    icon: <Rocket className="w-6 h-6" />,
    color: 'action'
  },
  'leap-launch': {
    name: 'Leap & Launch!',
    description: 'Build and scale your dream practice',
    price: 299,
    originalPrice: 299,
    discount: 100,
    duration: '6 months',
    features: [
      'Business development blueprint',
      'Marketing strategies',
      'Financial planning tools',
      'Client acquisition systems',
      'Practice management resources',
      'Member discount available ($199)'
    ],
    type: 'premium',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'primary'
  }
}

export default function EnrollmentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Extract query parameters
  const type = searchParams.get('type') as EnrollmentType
  const planId = searchParams.get('plan')
  const price = searchParams.get('price')
  const category = searchParams.get('category')
  
  // State management
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    licenseNumber: '',
    licenseState: 'TX',
    agreeToTerms: false
  })
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // Get plan details
  const plan = planId ? PLAN_DETAILS[planId] : null
  
  useEffect(() => {
    // Check if user is logged in (mock check - replace with actual auth check)
    const checkAuth = async () => {
      // In production, check Supabase auth status
      setIsLoggedIn(false) // For now, assume not logged in
    }
    checkAuth()
  }, [])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validation
    if (!formData.email || !formData.fullName) {
      setError('Please fill in all required fields')
      return
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }
    
    setLoading(true)
    
    try {
      // In production, this would:
      // 1. Create/update user account
      // 2. Initialize Stripe checkout
      // 3. Redirect to payment
      
      console.log('Enrollment data:', {
        plan: planId,
        type,
        price,
        user: formData
      })
      
      // Mock successful submission
      setTimeout(() => {
        setStep('payment')
        setLoading(false)
      }, 1500)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }
  
  // Handle individual course browsing
  if (type === 'individual') {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-therabrake">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 text-primary hover:text-blue-600 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Pricing
            </Link>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-neutral-dark mb-4">
                Browse Individual Courses
              </h1>
              <p className="text-neutral-medium mb-8">
                Select the perfect course for your needs. Each course is priced individually based on CE credit hours.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Link 
                  href="/courses?category=ce"
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary transition-all group"
                >
                  <GraduationCap className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-dark mb-2 group-hover:text-primary">
                    CE Courses
                  </h3>
                  <p className="text-neutral-medium mb-4">
                    Texas LPC approved continuing education courses
                  </p>
                  <p className="text-primary font-bold">
                    Starting at $19.99 →
                  </p>
                </Link>
                
                <Link 
                  href="/courses?category=personal"
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-secondary transition-all group"
                >
                  <Sprout className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-neutral-dark mb-2 group-hover:text-secondary">
                    Personal Development
                  </h3>
                  <p className="text-neutral-medium mb-4">
                    Transform your personal and professional life
                  </p>
                  <p className="text-secondary font-bold">
                    From $99 →
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
  
  // Handle membership comparison
  if (type === 'membership' && !planId) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-therabrake">
          <div className="max-w-6xl mx-auto">
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 text-primary hover:text-blue-600 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Pricing
            </Link>
            
            <h1 className="text-3xl font-bold text-neutral-dark mb-8 text-center">
              Choose Your Membership Plan
            </h1>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {Object.entries(PLAN_DETAILS)
                .filter(([_, details]) => details.type === 'ce' || details.type === 'personal')
                .slice(0, 6)
                .map(([id, details]) => (
                  <div key={id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="text-center mb-4">
                      {details.icon}
                      <h3 className="text-xl font-bold mt-2">{details.name}</h3>
                      <p className="text-3xl font-bold text-primary mt-2">${details.price}</p>
                      <p className="text-neutral-medium">{details.duration}</p>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {details.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/enrollment?type=${details.type}&plan=${id}&price=${details.price}`}
                      className="block w-full text-center py-2 px-4 bg-primary text-white rounded-lg font-medium hover:bg-blue-600"
                    >
                      Select Plan
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    )
  }
  
  // No plan selected
  if (!plan) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-therabrake">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-alert mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-neutral-dark mb-4">
              No Plan Selected
            </h1>
            <p className="text-neutral-medium mb-8">
              Please select a membership plan or course to continue with enrollment.
            </p>
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Pricing
            </Link>
          </div>
        </div>
      </main>
    )
  }
  
  // Main enrollment form
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container-therabrake">
        <div className="max-w-5xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'details' ? 'text-primary' : 'text-neutral-medium'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'details' ? 'bg-primary text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="font-medium">Your Details</span>
              </div>
              
              <div className="w-12 h-0.5 bg-gray-300" />
              
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-neutral-medium'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'payment' ? 'bg-primary text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Plan Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-neutral-dark mb-4">
                  Order Summary
                </h2>
                
                <div className="mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-${plan.color}/10`}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-dark">{plan.name}</h3>
                      <p className="text-sm text-neutral-medium">{plan.duration}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-neutral-medium">Subtotal</span>
                      <span className="font-semibold">${plan.price}</span>
                    </div>
                    {plan.discount && (
                      <div className="flex justify-between items-center mb-2 text-secondary">
                        <span>Member Discount</span>
                        <span>-${plan.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl text-primary">
                        ${plan.discount ? plan.price - plan.discount : plan.price}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-neutral-medium">
                    <Shield className="w-4 h-4 text-secondary" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-medium">
                    <Clock className="w-4 h-4 text-secondary" />
                    <span>Instant access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-medium">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    <span>30-day guarantee</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Form */}
            <div className="lg:col-span-2">
              {step === 'details' ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h1 className="text-2xl font-bold text-neutral-dark mb-2">
                    Complete Your Enrollment
                  </h1>
                  <p className="text-neutral-medium mb-6">
                    {isLoggedIn ? 'Confirm your details to proceed' : 'Create your account or sign in to continue'}
                  </p>
                  
                  {error && (
                    <div className="mb-6 p-4 bg-alert/10 border border-alert rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-alert mt-0.5" />
                      <span className="text-alert">{error}</span>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      {/* Account Section */}
                      {!isLoggedIn && (
                        <div>
                          <h3 className="font-semibold text-neutral-dark mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Account Information
                          </h3>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-neutral-dark mb-2">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-neutral-dark mb-2">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-neutral-dark mb-2">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            
                            {(type === 'ce' || type === 'premium') && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                                    License Number
                                  </label>
                                  <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="LPC12345"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                                    License State
                                  </label>
                                  <select
                                    name="licenseState"
                                    value={formData.licenseState}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                  >
                                    <option value="TX">Texas</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="NM">New Mexico</option>
                                  </select>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Already have account */}
                      {!isLoggedIn && (
                        <div className="text-center py-4 border-y">
                          <p className="text-neutral-medium mb-2">Already have an account?</p>
                          <Link 
                            href={`/login?redirect=/enrollment?type=${type}&plan=${planId}&price=${price}`}
                            className="text-primary hover:text-blue-600 font-medium"
                          >
                            Sign in instead →
                          </Link>
                        </div>
                      )}
                      
                      {/* Terms */}
                      <div>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleInputChange}
                            className="mt-1"
                            required
                          />
                          <span className="text-sm text-neutral-medium">
                            I agree to the{' '}
                            <Link href="/terms" className="text-primary hover:underline">
                              Terms of Service
                            </Link>
                            {' '}and{' '}
                            <Link href="/privacy" className="text-primary hover:underline">
                              Privacy Policy
                            </Link>
                            . I understand that my enrollment will auto-renew if applicable and I can cancel anytime.
                          </span>
                        </label>
                      </div>
                      
                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading || !formData.agreeToTerms}
                        className="w-full py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Continue to Payment
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                  
                  {/* Security badges */}
                  <div className="mt-8 pt-6 border-t flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-neutral-medium">
                      <Lock className="w-4 h-4" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-medium">
                      <CreditCard className="w-4 h-4" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-medium">
                      <Shield className="w-4 h-4" />
                      <span>PCI Compliant</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Payment step (placeholder)
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-neutral-dark mb-6">
                    Payment Information
                  </h2>
                  
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-neutral-medium mb-4">
                      Redirecting to secure checkout...
                    </p>
                    <p className="text-sm text-neutral-medium">
                      You will be redirected to Stripe for secure payment processing
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setStep('details')}
                    className="w-full py-3 px-6 bg-gray-200 text-neutral-dark rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Back to Details
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
