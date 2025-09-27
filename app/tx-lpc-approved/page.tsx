export default function TXLPCApprovedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Texas LPC Approved Continuing Education
          </h1>
          <p className="text-lg text-green-100 max-w-3xl mx-auto">
            TheraBrake Academy courses are designed to comply with the Texas Behavioral Health Executive Council (BHEC) 
            and 22 Texas Administrative Code section 681.140 requirements for Licensed Professional Counselors (LPCs).
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            CEU Requirements Under Texas LPC Rules
          </h2>
          <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
            <ul className="space-y-4 text-gray-700 text-lg">
              <li><strong>24 total CE hours</strong> are required each renewal period.</li>
              <li><strong>6 hours in Ethics</strong> are required each cycle.</li>
              <li><strong>3 hours in Cultural Diversity / Competency</strong> are required each cycle.</li>
              <li><strong>Texas Jurisprudence Exam</strong> must be completed every renewal; this counts as <strong>1 hour of ethics CE</strong>.</li>
              <li><strong>Supervisors</strong> must also complete <strong>6 hours in supervision</strong>.</li>
              <li>Beginning <strong>January 1, 2024</strong>, at least <strong>50% of CE hours must come from qualifying providers</strong>.</li>
              <li>Up to <strong>10 CE hours may be carried forward</strong> into the next renewal cycle if not used.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Documentation and Audit Compliance
          </h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-center">Certificate of Completion</h3>
              <p className="text-gray-600 mb-3">Learners receive certificates that include:</p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>Participant name</li>
                <li>Course title and topic</li>
                <li>Date of completion</li>
                <li>Number of CE hours earned</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-center">BHEC Requirements</h3>
              <p className="text-gray-600">
                BHEC does not pre-approve individual courses or providers. 
                Licensees are responsible for ensuring their courses meet the requirements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-center">Record Retention</h3>
              <p className="text-gray-600">
                All records of CE completion must be retained for at least 3 years in case of audit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Our Commitment
          </h2>
          <div className="bg-green-50 p-8 rounded-lg border border-green-200">
            <p className="text-center text-lg text-gray-700 mb-8">
              TheraBrake Academy designs all professional development and CEU courses to:
            </p>
            <ul className="space-y-4 text-gray-700">
              <li>Align with Texas LPC renewal requirements</li>
              <li>Provide clear documentation for audit purposes</li>
              <li>Deliver relevant, practical training directly related to the practice of professional counseling</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Official Texas Administrative Code</h3>
            <p className="text-gray-700 mb-6">
              For the full rule, please see <strong>22 TAC section 681.140 Requirements for Continuing Education</strong> 
              via the Texas Administrative Code.
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
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Earn Your Texas LPC CEUs?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Browse our selection of BHEC-compliant continuing education courses designed specifically 
            for Texas Licensed Professional Counselors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
              href="/courses"
              className="inline-block px-8 py-4 bg-white text-blue-700 font-bold text-lg rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              Browse CEU Courses
            </a>
            
              href="/contact"
              className="inline-block px-8 py-4 bg-blue-800 text-white font-bold text-lg rounded-lg hover:bg-blue-900 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
