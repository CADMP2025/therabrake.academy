export default function TXLPCApprovedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-green-600">✅</span> Texas LPC Approved Continuing Education
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            TheraBrake Academy™ courses are designed to comply with the{' '}
            <strong>Texas Behavioral Health Executive Council (BHEC)</strong> and{' '}
            <strong>22 Texas Administrative Code § 681.140</strong> requirements for Licensed Professional Counselors (LPCs).
          </p>
        </div>

        {/* CEU Requirements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">CEU Requirements Under Texas LPC Rules</h2>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <ul className="space-y-3 text-gray-700">
              <li>• <strong>24 total CE hours</strong> are required each renewal period.</li>
              <li>• <strong>6 hours in Ethics</strong> are required each cycle.</li>
              <li>• <strong>3 hours in Cultural Diversity / Competency</strong> are required each cycle.</li>
              <li>• <strong>Texas Jurisprudence Exam</strong> must be completed every renewal; this counts as <strong>1 hour of ethics CE</strong>.</li>
              <li>• <strong>Supervisors</strong> must also complete <strong>6 hours in supervision</strong>.</li>
              <li>• Beginning <strong>January 1, 2024</strong>, at least <strong>50% of CE hours must come from qualifying providers</strong> (such as accredited universities, national professional associations, or governmental entities).</li>
              <li>• Up to <strong>10 CE hours may be carried forward</strong> into the next renewal cycle if not used.</li>
            </ul>
          </div>
        </section>

        {/* Documentation & Audit Compliance */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentation & Audit Compliance</h2>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <ul className="space-y-4 text-gray-700">
              <li>
                • Learners receive a <strong>certificate of completion</strong> that includes:
                <ul className="ml-8 mt-2 space-y-1">
                  <li>• Participant's name</li>
                  <li>• Course title and topic</li>
                  <li>• Date of completion</li>
                  <li>• Number of CE hours earned</li>
                </ul>
              </li>
              <li>
                • <strong>BHEC does not pre-approve individual courses or providers.</strong> Instead, licensees are responsible for ensuring their courses meet the above requirements.
              </li>
              <li>
                • All records of CE completion must be <strong>retained for at least 3 years</strong> in case of audit.
              </li>
            </ul>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Commitment</h2>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-gray-700 mb-4">
              TheraBrake Academy™ designs all professional development and CEU courses to:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Align with Texas LPC renewal requirements</li>
              <li>• Provide clear documentation for audit purposes</li>
              <li>• Deliver relevant, practical training directly related to the practice of professional counseling</li>
            </ul>
          </div>
        </section>

        {/* Official Reference */}
        <section className="mb-12">
          <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
            <p className="text-gray-700 mb-4">
              📜 For the full rule, please see <strong>22 TAC § 681.140 – Requirements for Continuing Education</strong> via the Texas Administrative Code.
            </p>
            <a 
              href="https://texreg.sos.state.tx.us/public/readtac$ext.ViewTAC?tac_view=5&ti=22&pt=30&ch=681&sch=D&rl=Y"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Official Texas Administrative Code
            </a>
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
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse CEU Courses
            </a>
            
              href="/contact"
              className="inline-block px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
