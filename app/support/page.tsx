import Link from 'next/link'
import { Clock, AlertCircle, Users, Shield, Mail, Phone, HelpCircle, CheckCircle } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Support Center
          </h1>
          <p className="text-xl text-center text-white/90 max-w-3xl mx-auto">
            TheraBrake Academy™ Support and Service Level Agreement (SLA)
          </p>
        </div>
      </section>

      {/* SLA Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="prose max-w-none">
            <p className="text-lg text-text-secondary mb-8">
              This Support and Service Level Agreement applies to customers enrolled in TheraBrake Academy courses and memberships.
            </p>
            
            <div className="bg-background-secondary p-6 rounded-lg mb-8">
              <p className="text-text-primary">
                Provided that the Customer remains current in payment obligations, TheraBrake Academy will use commercially 
                reasonable efforts to provide the services specified herein to meet the service levels defined below. 
                Support services are outsourced to trained representatives but managed under TheraBrake Academy quality standards.
              </p>
            </div>

            {/* Customer Support Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                <HelpCircle className="h-6 w-6 text-primary mr-3" />
                1. CUSTOMER SUPPORT
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">1.1 Support Hours</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-action mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-action">Severity Level 1 (Critical / Site Down):</span>
                        <span className="text-text-secondary ml-2">Live support available 24×7.</span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-text-primary">All Other Levels:</span>
                        <span className="text-text-secondary ml-2">Support is available 8 am – 8 pm CST, Monday – Friday (excluding U.S. federal holidays).</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">1.2 Customer Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-secondary mr-3" />
                      <span className="text-text-secondary">Email: </span>
                      <a href="mailto:support@therabrake.academy" className="text-primary hover:text-primary-dark ml-2 font-semibold">
                        support@therabrake.academy
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-secondary mr-3" />
                      <span className="text-text-secondary">Support Portal: via LMS dashboard "Help" section</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-secondary mr-3" />
                      <span className="text-text-secondary">Phone (escalations only): </span>
                      <a href="tel:+13462982988" className="text-primary hover:text-primary-dark ml-2 font-semibold">
                        (346) 298-2988
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">1.3 Customer Designated Contacts</h3>
                  <p className="text-text-secondary">
                    Organizations with group enrollments may designate up to three (3) points of contact to interface with TheraBrake Academy support.
                  </p>
                </div>
              </div>
            </div>

            {/* Support Severity Levels */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                <AlertCircle className="h-6 w-6 text-primary mr-3" />
                2. SUPPORT SEVERITY LEVELS & RESPONSE TIMES
              </h2>

              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">2.1 Severity Descriptions</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                      <p><span className="font-semibold text-red-700">Severity 1 – Critical:</span> Site is inaccessible to all users (no login, checkout, or course access).</p>
                    </div>
                    <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                      <p><span className="font-semibold text-orange-700">Severity 2 – High:</span> Major function failure (e.g., course enrollment broken, certificates not generating) affecting many users.</p>
                    </div>
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                      <p><span className="font-semibold text-yellow-700">Severity 3 – Medium:</span> Feature malfunction (e.g., quiz not saving, video playback issues) but core platform usable.</p>
                    </div>
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p><span className="font-semibold text-blue-700">Severity 4 – Low:</span> Minor bugs, cosmetic issues, or general "how-to" inquiries.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-4">2.2 Target Response & Resolution Times</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-primary text-white">
                          <th className="border border-gray-300 px-4 py-2 text-left">Severity</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">First Response</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Workaround / Resolution</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-red-50">
                          <td className="border border-gray-300 px-4 py-2 font-semibold">Level 1 – Critical</td>
                          <td className="border border-gray-300 px-4 py-2">Within 1 hour (24/7)</td>
                          <td className="border border-gray-300 px-4 py-2">Workaround within 4 hours; permanent fix within 24 hours</td>
                          <td className="border border-gray-300 px-4 py-2">Escalated immediately</td>
                        </tr>
                        <tr className="bg-orange-50">
                          <td className="border border-gray-300 px-4 py-2 font-semibold">Level 2 – High</td>
                          <td className="border border-gray-300 px-4 py-2">Within 4 business hours</td>
                          <td className="border border-gray-300 px-4 py-2">Workaround within 1 business day; permanent fix within 3 business days</td>
                          <td className="border border-gray-300 px-4 py-2">After-hours escalation allowed</td>
                        </tr>
                        <tr className="bg-yellow-50">
                          <td className="border border-gray-300 px-4 py-2 font-semibold">Level 3 – Medium</td>
                          <td className="border border-gray-300 px-4 py-2">Within 1 business day</td>
                          <td className="border border-gray-300 px-4 py-2">Fix scheduled in next release (typically within 7–10 business days)</td>
                          <td className="border border-gray-300 px-4 py-2"></td>
                        </tr>
                        <tr className="bg-blue-50">
                          <td className="border border-gray-300 px-4 py-2 font-semibold">Level 4 – Low</td>
                          <td className="border border-gray-300 px-4 py-2">Within 2 business days</td>
                          <td className="border border-gray-300 px-4 py-2">Addressed in routine maintenance</td>
                          <td className="border border-gray-300 px-4 py-2">Includes feature requests</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Escalation Procedures */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                <Users className="h-6 w-6 text-primary mr-3" />
                3. ESCALATION PROCEDURES
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Severity Escalation:</span> Customers may request escalation by updating a ticket with "ESCALATE" in the subject line.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Managerial Escalation:</span> If resolution stalls, cases may be escalated to Academy administrators within 1 business day.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Uptime Commitment */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                <Shield className="h-6 w-6 text-primary mr-3" />
                4. UPTIME COMMITMENT
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary mt-1 mr-3 flex-shrink-0" />
                    <div>TheraBrake Academy will maintain <span className="font-semibold text-primary">99.5% uptime</span> each calendar quarter (excluding scheduled maintenance).</div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary mt-1 mr-3 flex-shrink-0" />
                    <div><span className="font-semibold">Scheduled Maintenance:</span> Limited to 12 hours per quarter, with 72-hour advance notice provided through the platform.</div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Exclusions */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-text-primary mb-6">5. EXCLUSIONS</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-text-secondary mb-3">Support does not cover:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-action mr-2">•</span>
                    <span className="text-text-secondary">Issues caused by third-party software or hardware outside TheraBrake Academy's control.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-action mr-2">•</span>
                    <span className="text-text-secondary">Customer misuse or negligence.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-action mr-2">•</span>
                    <span className="text-text-secondary">Direct one-on-one tutoring, coaching, or modifications outside the scope of platform use.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Realistic Wait Times */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-text-primary mb-6">6. REALISTIC WAIT TIMES</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-text-secondary mb-4">Given outsourcing and standard online education norms, realistic wait times for customers are:</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Critical Issues:</span> 1 hour to initial response, 4–24 hours to workaround/fix.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">General Issues:</span> Same business day for urgent cases, 1–2 business days for standard tickets.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <HelpCircle className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Minor / Feature Requests:</span> 3–5 business days acknowledgment, scheduled in future release.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Key Takeaway */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">✨ Key Takeaway for Customers</h2>
              <p className="text-lg">
                TheraBrake Academy ensures critical learning disruptions are prioritized immediately, 
                while general inquiries and improvements are resolved within 1–3 business days. 
                Customers always have a clear escalation path.
              </p>
            </div>

            {/* Contact Section */}
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Need Immediate Support?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@therabrake.academy"
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition inline-flex items-center justify-center"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Email Support
                </a>
                <Link 
                  href="/dashboard"
                  className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary-dark transition inline-flex items-center justify-center"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Access Support Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
