import { 
  CheckCircle, 
  FileText, 
  Book, 
  Award, 
  Clock,
  Users,
  Calendar,
  AlertCircle,
  Shield,
  GraduationCap,
  ScrollText,
  FolderOpen,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react'

export default function TXLPCApprovedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-white animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Texas LPC Approved Continuing Education
          </h1>
          <p className="text-lg text-green-100 max-w-3xl mx-auto">
            TheraBrake Academy™ courses are designed to comply with the{' '}
            <strong className="text-white">Texas Behavioral Health Executive Council (BHEC)</strong> and{' '}
            <strong className="text-white">22 Texas Administrative Code § 681.140</strong> requirements for 
            Licensed Professional Counselors (LPCs).
          </p>
        </div>
      </section>

      {/* CEU Requirements Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            CEU Requirements Under Texas LPC Rules
          </h2>
          <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
            <div className="grid md:grid-cols-1 gap-4">
              {[
                {
                  icon: <Clock className="w-6 h-6 text-blue-600" />,
                  text: "24 total CE hours are required each renewal period."
                },
                {
                  icon: <Shield className="w-6 h-6 text-blue-600" />,
                  text: "6 hours in Ethics are required each cycle."
                },
                {
                  icon: <Users className="w-6 h-6 text-blue-600" />,
                  text: "3 hours in Cultural Diversity / Competency are required each cycle."
                },
                {
                  icon: <ScrollText className="w-6 h-6 text-blue-600" />,
                  text: "Texas Jurisprudence Exam must be completed every renewal; this counts as 1 hour of ethics CE."
                },
                {
                  icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
                  text: "Supervisors must also complete 6 hours in supervision."
                },
                {
                  icon: <Calendar className="w-6 h-6 text-orange-600" />,
                  text: "Beginning January 1, 2024, at least 50% of CE hours must come from qualifying providers."
                },
                {
                  icon: <Award className="w-6 h-6 text-blue-600" />,
                  text: "Up to 10 CE hours may be carried forward into the next renewal cycle if not used."
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 mt-1">{item.icon}</div>
                  <p className="text-gray-700 text-lg">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Documentation & Audit Compliance */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Documentation & Audit Compliance
          </h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Certificate of Completion</h3>
              <p className="text-gray-600 mb-3">Learners receive certificates that include:</p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Participant's name</li>
                <li>• Course title and topic</li>
                <li>• Date of completion</li>
                <li>• Number of CE hours earned</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">BHEC Requirements</h3>
              <p className="text-gray-600">
                BHEC does not pre-approve individual courses or providers. 
                Licensees are responsible for ensuring their courses meet the requirements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                <FolderOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Record Retention</h3>
              <p className="text-gray-600">
                All records of CE completion must be retained for at least 3 years in case of audit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Our Commitment
          </h2>
          <div className="bg-green-50 p-8 rounded-lg border border-green-200">
            <p className="text-center text-lg text-gray-700 mb-8">
              TheraBrake Academy™ designs all professional development and CEU courses to:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                "Align with Texas LPC renewal requirements",
                "Provide clear documentation for audit purposes",
                "Deliver relevant, practical training directly related to the practice of professional counseling"
              ].map((item, index) => (
                <div key={index} className="flex items-center bg-white p-4 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Official Reference */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <ScrollText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Official Texas Administrative Code</h3>
            <p className="text-gray-700 mb-6">
              For the full rule, please see <strong>22 TAC § 681.140 – Requirements for Continuing Education</strong>{' '}
              via the Texas Administrative Code.
            </p>
            <a 
              href="https://texreg.sos.state.tx.us/public/readtac$ext.ViewTAC?tac_view=5&ti=22&pt=30&ch=681&sch=D&rl=Y"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Official Texas Administrative Code
              <ExternalLink className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <Award className="w-12 h-12 text-white animate-bounce" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Earn Your Texas LPC CEUs?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Browse our selection of BHEC-compliant continuing education courses designed specifically 
            for Texas Licensed Professional Counselors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
              href="/courses"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-bold text-lg rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              Browse CEU Courses
              <ChevronRight className="w-6 h-6 ml-2" />
            </a>
            
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-800 text-white font-bold text-lg rounded-lg hover:bg-blue-900 transition-colors"
            >
              Contact Support
              <Info className="w-6 h-6 ml-2" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
