'use client'

import { 
  CheckCircle,
  FileText,
  Shield,
  AlertTriangle,
  Lock,
  Info,
  BookOpen,
  UserCheck,
  Key,
  Copyright,
  Gavel
} from 'lucide-react'

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Use
          </h1>
          <p className="text-gray-600">
            Last updated: {currentDate}
          </p>
        </div>

        {/* Acceptance of Terms */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <CheckCircle className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-gray-700">
              By enrolling in or accessing any TheraBrake Academy course, membership, or digital program, 
              you agree to these Terms of Use, our Refund Policy, and our Privacy Policy. 
              If you do not agree, please do not use this website or enroll in our courses.
            </p>
          </div>
        </section>

        {/* Educational Purpose Only */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <BookOpen className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Educational Purpose Only</h2>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-gray-700">
              TheraBrake Academy provides educational content for professional development, 
              CEU completion, and personal growth. Courses are not a substitute for professional 
              counseling, psychotherapy, medical treatment, or emergency services. 
              If you require clinical care, please consult a licensed mental health or medical 
              professional in your area.
            </p>
          </div>
        </section>

        {/* User Responsibilities */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <UserCheck className="w-8 h-8 text-orange-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">User Responsibilities</h2>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Shield className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  You agree to use this website and its content in compliance with all applicable 
                  laws and regulations.
                </span>
              </li>
              <li className="flex items-start">
                <Key className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  You are responsible for maintaining the confidentiality of your login credentials.
                </span>
              </li>
              <li className="flex items-start">
                <Lock className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Unauthorized distribution, reproduction, or resale of course content is strictly prohibited.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* License Grant and Restrictions */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">License Grant and Restrictions</h2>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <p className="text-gray-700 mb-4">
              Upon purchase, you are granted a limited, non-exclusive, non-transferable, revocable 
              license to access the content for your own personal, non-commercial use during the 
              access period defined at purchase.
            </p>
            <p className="text-gray-700 font-semibold mb-3">You may not:</p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span className="text-gray-700">
                  Copy, reproduce, distribute, sublicense, or otherwise exploit content for commercial purposes
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span className="text-gray-700">
                  Circumvent access restrictions
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span className="text-gray-700">
                  Share login credentials with unauthorized individuals
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Intellectual Property Rights */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Copyright className="w-8 h-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Intellectual Property Rights</h2>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <p className="text-gray-700 mb-4">
              All course materials, documentation, logos, names, videos, and digital assets are 
              the exclusive intellectual property of TheraBrake Academy and MHDF Venture Holdings LLC. 
              All rights not expressly granted to you are reserved.
            </p>
            <div className="flex items-start p-4 bg-indigo-100 rounded-lg border border-indigo-300">
              <AlertTriangle className="w-5 h-5 text-indigo-700 mt-1 mr-3 flex-shrink-0" />
              <p className="text-gray-700">
                <strong className="font-semibold">Warning:</strong> Unauthorized use may result in 
                civil and/or criminal liability.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimers & Limitation of Liability */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Disclaimers & Limitation of Liability</h2>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">No Warranty:</h3>
              <p className="text-gray-700">
                The Academy disclaims all warranties, express or implied, including merchantability, 
                fitness for a particular purpose, or non-infringement. Content is provided &quot;as is&quot; 
                and &quot;as available.&quot;
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Limitation of Liability:</h3>
              <p className="text-gray-700">
                To the maximum extent permitted by law, TheraBrake Academy and MHDF Venture Holdings LLC 
                shall not be liable for any direct, indirect, incidental, consequential, or punitive 
                damages arising out of your use of the website, platform, or courses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Indemnification:</h3>
              <p className="text-gray-700">
                You agree to indemnify, defend, and hold harmless TheraBrake Academy, its officers, 
                affiliates, and instructors from any claims, liabilities, damages, or expenses resulting 
                from your violation of these Terms or misuse of content.
              </p>
            </div>
          </div>
        </section>

        {/* Governing Law and Venue */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Gavel className="w-8 h-8 text-gray-700 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Governing Law and Venue</h2>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
            <p className="text-gray-700">
              These Terms shall be governed by and construed under the laws of the State of Texas, 
              without regard to conflict-of-law provisions. Any disputes shall be resolved exclusively 
              in the state or federal courts located in Texas.
            </p>
          </div>
        </section>

        {/* Additional Notice */}
        <div className="bg-blue-100 p-6 rounded-lg text-center border border-blue-300">
          <p className="text-gray-700">
            By using TheraBrake Academy, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms of Use. If you have any questions, please contact us at{' '}
            <a 
              href="mailto:support@therabrake.academy" 
              className="text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              support@therabrake.academy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
