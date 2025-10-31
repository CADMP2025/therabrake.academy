import { 
  Shield,
  Lock,
  FileText,
  Users,
  Database,
  Globe,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'

export default function PrivacyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex justify-center mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-blue-100">
            Effective Date: {currentDate}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="mb-12">
          <p className="text-lg text-gray-700">
            TheraBrake Academy™ ("we," "our," or "us") values your privacy and is committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, share, and safeguard your information when you access or use our website, 
            online learning platform, and related services (collectively, the "Services"). By using our Services, you agree to the 
            practices described below.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-gray-700 mb-4">We may collect the following types of information when you interact with TheraBrake Academy™:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <strong>Personal Information:</strong> Name, email address, phone number, billing information, and professional license details (for CEU courses).
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <strong>Account Information:</strong> Login credentials, enrollment history, certificates earned, and progress data.
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <strong>Payment Information:</strong> Processed securely by third-party providers (e.g., Stripe). We do not store your full credit card details.
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <strong>Technical Data:</strong> IP address, browser type, device information, and usage statistics.
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <strong>Communications:</strong> Emails, messages, or inquiries you send to us.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-gray-700 mb-4">Your information is used to:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                Provide and improve our Services, including course delivery and certification tracking.
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                Process payments and maintain accurate financial records.
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                Verify eligibility for CEU credit with applicable boards and authorities.
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                Communicate with you about courses, updates, or support.
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                Protect the integrity and security of our platform.
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">•</span>
                Comply with legal, regulatory, and accreditation requirements.
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3. How We Share Information</h2>
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <p className="text-gray-700 mb-4">We do not sell or rent your personal data. Information may be shared only in these limited cases:</p>
            <div className="space-y-3">
              <div className="flex items-start">
                <Database className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <strong>Service Providers:</strong> Trusted partners (e.g., Supabase for secure database hosting, Stripe for payment processing) who help us operate our platform.
                </div>
              </div>
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <strong>Compliance:</strong> When required by law, licensing boards, or legal processes.
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <strong>Protection:</strong> To prevent fraud, abuse, or security threats.
                </div>
              </div>
              <div className="flex items-start">
                <Users className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <strong>With Consent:</strong> When you give us explicit permission.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Data Protection & Security</h2>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <p className="text-gray-700 mb-4">We take reasonable technical and organizational measures to protect your information, including:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <Lock className="w-5 h-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                Encrypted payment processing via Stripe.
              </li>
              <li className="flex items-start">
                <Lock className="w-5 h-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                Secure hosting and authentication through Supabase.
              </li>
              <li className="flex items-start">
                <Lock className="w-5 h-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                Access controls to protect sensitive course and user data.
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              While we strive to protect your information, no system is 100% secure. Users are responsible for safeguarding 
              their login credentials and reporting unauthorized activity immediately.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5. User Responsibilities</h2>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <p className="text-gray-700 mb-4">By using TheraBrake Academy™, you agree to:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Provide accurate and truthful information during registration and enrollment.</li>
              <li>• Keep your login credentials private and secure.</li>
              <li>• Use our Services only for lawful purposes and in accordance with our Terms of Use.</li>
              <li>• Understand that our courses are educational only and do not replace therapy, counseling, or medical treatment.</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Data Retention</h2>
          <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
            <p className="text-gray-700">
              We retain your data as long as necessary to provide Services, comply with regulations, and maintain course 
              completion and CEU records. You may request account deletion, though certain records may be retained as 
              required by law.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Your Rights</h2>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-gray-700 mb-4">Depending on your location, you may have rights to:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Access, correct, or delete your personal data.</li>
              <li>• Withdraw consent for non-essential data processing.</li>
              <li>• Request a copy of your data in a portable format.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@therabrake.academy" className="text-blue-600 hover:text-blue-700 font-medium underline">
                privacy@therabrake.academy
              </a>
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Third-Party Links & Content</h2>
          <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
            <p className="text-gray-700">
              Our Services may link to third-party websites or tools. We are not responsible for their privacy 
              practices and encourage you to review their policies.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Children's Privacy</h2>
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <p className="text-gray-700">
              Our Services are not directed to children under 18. We do not knowingly collect data from minors 
              without parental or guardian consent.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Changes to This Policy</h2>
          <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
            <p className="text-gray-700">
              We may update this Privacy Policy periodically. Updates will be posted with a revised effective date. 
              Continued use of the Services after changes constitutes acceptance.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Contact Us</h2>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-gray-700 mb-6">For questions, concerns, or privacy requests, please contact us:</p>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <a href="mailto:privacy@therabrake.academy" className="text-blue-600 hover:text-blue-700 font-medium underline">
                    privacy@therabrake.academy
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <a href="mailto:info@therabrake.academy" className="text-blue-600 hover:text-blue-700 font-medium underline">
                    info@therabrake.academy
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <a href="tel:3462982988" className="text-blue-600 hover:text-blue-700 font-medium underline">
                    (346) 298-2988
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <p className="text-gray-700">
                    TheraBrake Academy™<br />
                    6120 College St. Suite D185<br />
                    Beaumont, TX 77707
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
