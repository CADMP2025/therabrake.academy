import Link from 'next/link'
import { ArrowRight, Award, Users, Clock, Star, BookOpen, Brain, Heart, Rocket } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Breakthrough Starts Here
          </h1>
          <p className="text-2xl mb-4 text-accent font-semibold">
            At TheraBrake Academy™, growth isn’t just academic, it’s personal.
          </p>
          <p className="text-lg mb-10 text-white/90 max-w-3xl mx-auto">
            Whether you’re rebuilding after loss, redefining your purpose, or reigniting your career, our courses help you transform from the inside out.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="text-xl font-semibold mb-2">🌱 For Personal Growth & Healing</h3>
              <p className="text-white/90">
                Discover step-by-step programs for overcoming emotional pain, financial setbacks, and self-doubt and build a stronger, more grounded version of yourself.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">🎓 For Mental Health & Professional Growth</h3>
              <p className="text-white/90">
                Earn accredited CE Hours while expanding your expertise with courses trusted by therapists and wellness professionals nationwide.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link 
              href="/courses"
              className="bg-action text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-action/90 transition inline-flex items-center justify-center"
            >
              Browse Our Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/auth/register"
              className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Enroll Today
            </Link>
          </div>
        </div>
      </section>

      {/* Two Paths Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Two Paths. One Purpose: Transformation
          </h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Personal Growth */}
            <div className="p-6 rounded-xl bg-background-light/60">
              <h3 className="text-2xl font-bold text-secondary mb-2">🌱 For Personal Growth</h3>
              <p className="text-text-primary mb-4">Heal emotional wounds, rediscover confidence, and create new meaning.</p>
              <p className="text-text-primary font-semibold mb-2">Courses like:</p>
              <ul className="space-y-2 text-text-primary">
                <li>💔➡️❤️ Healing Forward</li>
                <li>🌉 Rebuilding After Betrayal</li>
                <li>🧠⚡ The So What Mindset™</li>
                <li>💰📈 Financial Literacy & Independence</li>
              </ul>
              <div className="mt-6">
                <Link 
                  href="/courses/personal"
                  className="inline-flex items-center text-secondary hover:text-secondary-dark font-semibold text-lg transition"
                >
                  👉 Visit our Personal Development Catalog
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            {/* Professional Growth */}
            <div className="p-6 rounded-xl bg-background-light/60">
              <h3 className="text-2xl font-bold text-primary mb-2">🎓 For Professional Growth</h3>
              <p className="text-text-primary mb-4">Strengthen your skills, stay current, and elevate your impact.</p>
              <p className="text-text-primary font-semibold mb-2">Courses like:</p>
              <ul className="space-y-2 text-text-primary">
                <li>⚖️ Ethics for Counselors</li>
                <li>🌱 Building a Trauma-Informed Practice</li>
                <li>💻 Telehealth in Counseling</li>
                <li>🚀 Leap & Launch! Build Your Private Practice</li>
              </ul>
              <div className="mt-6">
                <Link 
                  href="/courses/professional"
                  className="inline-flex items-center text-primary hover:text-primary-dark font-semibold text-lg transition"
                >
                  👉 Explore our Professional Development Catalog
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Life Change Tracks */}
      <section className="py-16 bg-background-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary">Featured Life Change Tracks</h2>
          <div className="max-w-4xl mx-auto">
            <ul className="space-y-6 text-text-primary text-lg">
              <li>
                <span className="font-semibold">•	💔 Relationship Recovery & Rebuilding Trust</span><br />
                Turn pain into power with courses like <em>Healing Forward</em> and <em>Rebuilding After Betrayal</em>.
              </li>
              <li>
                <span className="font-semibold">•	💼 Career & Purpose Reinvention</span><br />
                From burnout to breakthrough — learn to pivot with purpose, whether you’re changing jobs or building your own practice.
              </li>
              <li>
                <span className="font-semibold">•	💸 Financial Empowerment & Stability</span><br />
                Learn to manage credit, overcome debt, and create a sustainable foundation for peace of mind.
              </li>
              <li>
                <span className="font-semibold">•	🧠 Mindset & Identity Growth</span><br />
                The So What Mindset™ helps you release old limitations and step into authentic confidence.
              </li>
              <li>
                <span className="font-semibold">•	🩺 Professional Evolution & Clinical Growth</span><br />
                Strengthen your therapeutic skills with trauma-informed, ethical, and culturally competent training (earn CE Hours that count).
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            🚀 Why People and Professionals Trust TheraBrake Academy™
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Dual-Stream Learning</h3>
              <p className="text-text-primary">Professional CE Hours + Personal Development</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition">
              <Award className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Trusted & Accredited</h3>
              <p className="text-text-primary">Courses that meet state and national requirements</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition">
              <Rocket className="h-12 w-12 text-action mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Practical & Transformational</h3>
              <p className="text-text-primary">Step-by-step guidance you can actually apply</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition">
              <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Learn Your Way</h3>
              <p className="text-text-primary">Self-paced video lessons, interactive quizzes, and downloadable workbooks</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition">
              <Star className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Certificates You Can Share</h3>
              <p className="text-text-primary">Celebrate your progress and add credibility to your career</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition">
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Expert Support</h3>
              <p className="text-text-primary">Learn from licensed professionals with years of experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            🔑 Your Next Step Starts Here
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
            <div>
              <p className="text-lg font-semibold mb-2 text-white">📚 Browse Our Courses</p>
              <p className="text-white/90">Find the right program for your needs</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2 text-white">💻 Enroll Today</p>
              <p className="text-white/90">Gain instant access to your learning dashboard</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2 text-white">🎉 Transform Tomorrow</p>
              <p className="text-white/90">Apply what you learn for real, lasting change</p>
            </div>
          </div>
          <p className="text-xl mb-8 font-semibold text-white">
            ✨ TheraBrake Academy™ isn't just another online school,it's where education meets empowerment.
          </p>
          <Link 
            href="/auth/register"
            className="bg-accent text-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-accent-light transition inline-block"
          >
            Start Your Journey Today
          </Link>
        </div>
      </section>
    </div>
  )
}