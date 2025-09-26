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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-green-600">✅</span> Texas LPC Approved Continuing Education
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            TheraBrake Academy™ courses are designed to comply with the{' '}
            <strong>Texas Behavioral Health Executive Council (BHEC)</strong> and{' '}
            <strong>22 Texas Administrative Code § 681.140</strong> requirements for 
            Licensed Professional Counselors (LPCs).
          </p>
        </div>

        {/* CEU Requirements Section */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Book className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">CEU Requirements Under Texas LPC Rules</h2>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <ul className="space-y-4">
              <li className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong className="font-semibold">24 total CE hours</strong> are required each renewal period.
                </span>
              </li>
              <li className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong className="font-semibold">6 hours in Ethics</strong> are required each cycle.
                </span>
              </li>
              <li className="flex items-start">
                <Users className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong className="font-semibold">3 hours in Cultural Diversity / Competency</strong> are required each cycle.
                </span>
              </li>
              <li className="flex items-start">
                <ScrollText className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong className="font-semibold">Texas Jurisprudence Exam</strong> must be completed every renewal; 
                  this counts as <strong>1 hour of ethics CE</strong>.
                </span>
              </li>
              <li className="flex items-start">
                <GraduationCap className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong className="font-semibold">Supervisors</strong> must also complete{' '}
                  <strong>6 hours in supervision</strong>.
                </span>
              </li>
              <li className="flex items-start">
                <Calendar className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Beginning <strong className="font-semibold">January 1, 2024</strong>, at least{' '}
                  <strong>50% of CE hours must come from qualifying providers</strong> (such as accredited 
                  universities, national professional associations, or governmental entities).
                </span>
              </li>
              <li className="flex items-start">
                <Award className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Up to <strong className="font-semibold">10 CE hours may be carried forward</strong> into 
                  the next renewal cycle if not used.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Documentation & Audit Compliance */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Documentation & Audit Compliance</h2>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <ul className="space-y-4">
              <li className="text-gray-700">
                <div className="flex items-start mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Learners receive a <strong className="font-semibold">certificate of completion</strong> that includes:</span>
                </div>
                <ul className="ml-12 mt-2 space-y-1">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    <span className="text-gray-600">Participant's name</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    <span className="text-gray-600">Course title and topic</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    <span className="text-gray-600">Date of completion</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    <span className="text-gray-600">Number of CE hours earned</span>
                  </li>
                </ul>
              </li>
              
              <li className="flex items-start">
                <AlertCircle className="w-5 h-5 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong className="font-semibold">BHEC does not pre-approve individual courses or providers.</strong>{' '}
                  Instead, licensees are responsible for ensuring their courses meet the above requirements.
                </span>
              </li>
              
              <li className="flex items-start">
                <FolderOpen className="w-5 h-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  All records of CE completion must be <strong className="font-semibold">retained for at least 3 years</strong>{' '}
                  in case of audit.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Award className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Our Commitment</h2>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-gray-700 mb-4">
              TheraBrake Academy™ designs all professional development and CEU courses to:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Align with Texas LPC renewal requirements
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Provide clear documentation for audit purposes
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">
                  Deliver relevant, practical training directly related to the practice of professional counseling
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Official Reference */}
        <section className="mb-12">
          <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
            <div className="flex items-start">
              <ScrollText className="w-6 h-6 text-gray-700 mt-1 mr-3 flex-shrink-0" />
              <div>
                <p className="text-gray-700">
                  📜 For the full rule, please see{' '}
                  <strong className="font-semibold">22 TAC § 681.140 – Requirements for Continuing Education</strong>{' '}
                  via the Texas Administrative Code.
                </p>
                <a 
                  href="https://texreg.sos.state.tx.us/public/readtac$ext.ViewTAC?tac_view=5&ti=22&pt=30&ch=681&sch=D&rl=Y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  View Official Texas Administrative Code
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-blue-50 p-8 rounded-lg text-center border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Earn Your Texas LPC CEUs?
          </h3>
          <p className="text-gray-700 mb-6">
            Browse our selection of BHEC-compliant continuing education courses designed specifically 
            for Texas Licensed Professional Counselors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse CEU Courses
              <ChevronRight className="w-5 h-5 ml-2" />
            </a>
            
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Contact Support
              <Info className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
