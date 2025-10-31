import { 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  Mail, 
  Phone, 
  Clock,
  CreditCard,
  Shield,
  AlertTriangle,
  Info,
  Calendar
} from 'lucide-react'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Refund Policy
          </h1>
          <div className="inline-flex items-center justify-center p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <p className="text-lg font-semibold text-red-700">
              All Sales Final – No Refunds
            </p>
          </div>
        </div>

        {/* Main Notice */}
        <section className="mb-12 bg-white p-8 rounded-lg shadow-lg border-l-4 border-red-500">
          <p className="text-gray-700 leading-relaxed text-lg">
            All sales are final and non-refundable due to the digital nature of our content. 
            Upon enrollment, you receive immediate access to proprietary course materials, 
            and for this reason, refunds, cancellations, or exchanges cannot be issued.
          </p>
        </section>

        {/* Purchase Acknowledgment */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Purchase Acknowledgment</h2>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-gray-700 mb-4">
              By completing your purchase, you acknowledge and agree that:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  You are purchasing access to digital content which is made available immediately upon payment.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Due to the non-returnable and easily replicable nature of digital goods, all sales are final.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  To the fullest extent permitted by law, you waive any right of chargeback, cancellation, 
                  refund, or withdrawal once access has been granted.
                </span>
              </li>
              <li className="flex items-start">
                <Calendar className="w-5 h-5 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong className="font-semibold">Your access to courses and/or membership benefits is limited to 
                  the duration of the membership period purchased. At the conclusion of that period, 
                  your access will automatically terminate unless you renew.</strong>
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Pre-Purchase Review */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-orange-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Pre-Purchase Review</h2>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <p className="text-gray-700">
              It is your responsibility to review course descriptions, membership details, 
              and any previews before purchase. If you have questions about course suitability, 
              you must contact{' '}
              <a 
                href="mailto:support@therabrake.academy" 
                className="text-blue-600 hover:text-blue-700 font-semibold underline"
              >
                support@therabrake.academy
              </a>{' '}
              prior to enrollment.
            </p>
          </div>
        </section>

        {/* Digital Content Access */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Digital Content Access</h2>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-gray-700 mb-4">
              Upon successful payment, you will receive immediate access to your purchased course(s) 
              or membership benefits. This immediate access to proprietary educational materials is 
              why refunds cannot be provided.
            </p>
            <div className="flex items-start p-4 bg-green-100 rounded-lg border border-green-300">
              <Calendar className="w-5 h-5 text-green-700 mt-1 mr-3 flex-shrink-0" />
              <p className="text-gray-700">
                <strong className="font-semibold">Access to content will continue only for the purchased membership term.</strong>{' '}
                Once that period expires, your account access to those materials will end automatically.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Issues */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Technical Issues</h2>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <p className="text-gray-700">
              If you experience technical difficulties accessing your purchased content, 
              please contact our support team immediately. We will work to resolve any 
              technical issues promptly, but technical difficulties do not constitute 
              grounds for refunds.
            </p>
          </div>
        </section>

        {/* Contact for Questions */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Info className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Contact for Questions</h2>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
            <p className="text-gray-700 mb-6">
              We encourage all users to carefully review course descriptions, previews, 
              and membership options before purchase. For any questions about this refund 
              policy or course content, please contact us at:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <span className="text-gray-700">Email: </span>
                  <a 
                    href="mailto:support@therabrake.academy" 
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    support@therabrake.academy
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <span className="text-gray-700">Phone: </span>
                  <a 
                    href="tel:3462982988" 
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    (346) 298-2988
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <span className="text-gray-700">Business Hours: </span>
                  <span className="text-gray-700">
                    Monday–Friday, 9:00 AM – 5:00 PM CST
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Notice */}
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            This refund policy is effective immediately and applies to all purchases made through 
            TheraBrake Academy™. By using our services, you agree to be bound by this policy.
          </p>
        </div>
      </div>
    </div>
  )
}
