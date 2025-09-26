'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  Shield, 
  Clock, 
  AlertCircle, 
  CreditCard, 
  Lock, 
  User, 
  Loader2,
  GraduationCap,
  Sprout,
  Brain
} from 'lucide-react'

interface PlanDetails {
  name: string
  price: number
  duration: string
  type: 'ce' | 'personal' | 'premium'
  features: string[]
  color: string
  icon: React.ElementType
  discount?: number
}

const planDetails: Record<string, PlanDetails> = {
  // CE Plans
  'ce-1year': {
    name: '🎓 1-Year CE Membership',
    price: 199,
    duration: '12 months',
    type: 'ce',
    features: [
      'Full access to all CEU courses (31+ credit hours)',
      'Complete your annual CE requirement',
      'Self-paced learning with videos and quizzes',
      'Instant digital certificates',
      'New courses added regularly',
      'Save over $100 vs individual courses'
    ],
    color: 'blue',
    icon: GraduationCap,
    discount: 0
  },
  'ce-2year': {
    name: '🎓 2-Year CE Membership',
    price: 299,
    duration: '24 months',
    type: 'ce',
    features: [
      'Everything in 1-Year Membership',
      'Extended to 24 months access',
      '$100 discount on So What Mindset',
      '$100 discount on Leap & Launch',
      'Lock in current pricing for 2 years',
      'Best for biennial license renewals'
    ],
    color: 'blue',
    icon: GraduationCap,
    discount: 0
  },
  'ce-lifetime': {
    name: '🌟 5-Year CE + Personal',
    price: 699,
    duration: '60 months',
    type: 'ce',
    features: [
      'Complete professional access (200+ CE hours)',
      'All personal development courses included',
      'Valid for 60 months (5 years)',
      '$100 off So What Mindset ($399 instead of $499)',
      '$100 off Leap & Launch ($199 instead of $299)',
      'Save over $2,500 - Best value!'
    ],
    color: 'blue',
    icon: GraduationCap,
    discount: 0
  },

  // Personal Development Plans
  'personal-1year': {
    name: '🌱 1-Year Personal Growth',
    price: 299,
    duration: '12 months',
    type: 'personal',
    features: [
      'Access to all personal growth courses',
      'Tools for relationships & resilience',
      'Health and finance modules',
      'Downloadable workbooks',
      'Self-paced learning',
      'Community access'
    ],
    color: 'green',
    icon: Sprout,
    discount: 0
  },
  'personal-2year': {
    name: '🌱 2-Year Personal Growth',
    price: 399,
    duration: '24 months',
    type: 'personal',
    features: [
      'Everything in 1-Year membership',
      'Extended 24-month access',
      'Bonus discounts on premium programs',
      'Priority support',
      'Best for long-term transformation',
      'Lock in current pricing'
    ],
    color: 'green',
    icon: Sprout,
    discount: 0
  },
  'personal-5year': {
    name: '🌱 5-Year Personal Growth',
    price: 699,
    duration: '60 months',
    type: 'personal',
    features: [
      'All personal growth content',
      'Valid for 60 months (5 years)',
      'Exclusive discounts on new programs',
      'VIP support access',
      'Future courses included',
      'Lowest per-month rate'
    ],
    color: 'green',
    icon: Sprout,
    discount: 0
  },

  // Premium Programs (existing)
  'so-what-mindset': {
    name: 'So What Mindset',
    price: 499,
    duration: 'Lifetime access',
    type: 'premium',
    features: [
      '12 transformative modules',
      'Live monthly Q&A sessions',
      'Private community access',
      'Personal breakthrough toolkit',
      'Certificate of completion',
      'Bonus: 1-on-1 coaching session'
    ],
    color: 'purple',
    icon: Brain
  },
  'leap-and-launch': {
    name: 'Leap & Launch',
    price: 299,
    duration: 'Lifetime access',
    type: 'premium',
    features: [
      '8-week transformation program',
      'Weekly live sessions',
      'Action planning workbooks',
      'Accountability partner matching',
      'Success metrics dashboard',
      'Money-back guarantee'
    ],
    color: 'orange',
    icon: Brain
  }
}

function EnrollmentContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseState: 'TX',
    agreeToTerms: false
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  
  const type = searchParams.get('type') as 'ce' | 'personal' | 'premium' | null
  const planId = searchParams.get('plan')
  const price = searchParams.get('price')
  
  const plan = planId ? planDetails[planId] : null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }

    setIsProcessing(true)
    setTimeout(() => {
      setStep('payment')
      setIsProcessing(false)
    }, 1500)
  }

  if (!type && !planId) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-therabrake">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-dark mb-2 text-center">
              Choose Your Learning Path
            </h1>
            <p className="text-neutral-medium text-center mb-8">
              Select a membership plan or browse individual courses
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Link
                href="/pricing"
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary transition-all group"
              >
                <GraduationCap className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-neutral-dark mb-2 group-hover:text-primary">
                  CE Memberships
                </h3>
                <p className="text-neutral-medium mb-4">
                  Texas LPC approved continuing education with certificates
                </p>
                <p className="text-primary font-bold">
                  View CE Plans →
                </p>
              </Link>
              <Link
                href="/pricing#personal"
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-secondary transition-all group"
              >
                <Sprout className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-xl font-bold text-neutral-dark mb-2 group-hover:text-secondary">
                  Personal Development
                </h3>
                <p className="text-neutral-medium mb-4">
                  Transform your life with our personal growth programs
                </p>
                <p className="text-secondary font-bold">
                  View Personal Plans →
                </p>
              </Link>
            </div>
            <div className="text-center">
              <p className="text-neutral-medium mb-4">Ready to browse courses?</p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600"
              >
                Browse Individual Courses
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (type && !planId) {
    const typePlans = Object.entries(planDetails).filter(([_, details]) => details.type === type)
    
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
              Choose Your {type === 'ce' ? 'CE' : type === 'personal' ? 'Personal Development' : 'Premium'} Plan
            </h1>
            <div className="grid lg:grid-cols-3 gap-6">
              {typePlans.map(([id, details]) => (
                <div key={id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-center mb-4">
                    <details.icon className="w-12 h-12 mx-auto text-primary mb-2" />
                    <h3 className="text-xl font-bold mt-2">{details.name}</h3>
                    <p className="text-3xl font-bold text-primary mt-2">${details.price}</p>
                    <p className="text-neutral-medium">{details.duration}</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {details.features.map((feature, idx) => (
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

  if (!plan) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container-therabrake">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-alert mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-neutral-dark mb-4">
              Plan Not Found
            </h1>
            <p className="text-neutral-medium mb-8">
              The selected plan could not be found. Please choose a valid plan.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600"
            >
              <ArrowLeft className="w-4 h-4" />
              View Available Plans
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container-therabrake">
        <div className="max-w-5xl mx-auto">
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
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-neutral-dark mb-4">
                  Order Summary
                </h2>
                <div className="mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-${plan.color}/10`}>
                      <plan.icon className="w-6 h-6 text-primary" />
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
                    {plan.discount && plan.discount > 0 && (
                      <div className="flex justify-between items-center mb-2 text-secondary">
                        <span>Member Discount</span>
                        <span>-${plan.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl text-primary">
                        ${plan.discount && plan.discount > 0 ? plan.price - plan.discount : plan.price}
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
            <div className="lg:col-span-2">
              {step === 'details' ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h1 className="text-2xl font-bold text-neutral-dark mb-2">
                    Complete Your Enrollment
                  </h1>
                  <p className="text-neutral-medium mb-6">
                    Enter your details to create your account and continue to payment
                  </p>
                  {error && (
                    <div className="mb-6 p-4 bg-alert/10 border border-alert rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-alert mt-0.5" />
                      <span className="text-alert">{error}</span>
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <div>
                          <h3 className="font-semibold text-neutral-dark mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Personal Information
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
                            {type === 'ce' && (
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
                        <div className="text-center py-4 border-y mt-6">
                          <p className="text-neutral-medium mb-2">Already have an account?</p>
                          <Link
                            href={`/login?redirect=/enrollment?type=${type}&plan=${planId}&price=${price}`}
                            className="text-primary hover:text-blue-600 font-medium"
                          >
                            Sign in to continue
                          </Link>
                        </div>
                      </div>
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
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-primary hover:underline">
                              Privacy Policy
                            </Link>
                          </span>
                        </label>
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
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
                    </div>
                  </form>
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
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-neutral-dark mb-6">
                    Complete Payment
                  </h2>
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-neutral-medium mb-4">
                      Redirecting to secure Stripe checkout...
                    </p>
                    <p className="text-sm text-neutral-medium">
                      You will be redirected to Stripe to complete your payment securely.
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

export default function EnrollmentPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    }>
      <EnrollmentContent />
    </Suspense>
  )
}
