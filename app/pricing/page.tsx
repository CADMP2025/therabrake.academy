import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  CheckCircle, 
  Star, 
  Gift, 
  DollarSign, 
  Infinity, 
  Rocket, 
  BookOpen, 
  GraduationCap, 
  Sprout, 
  Lightbulb,
  ArrowRight,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing - TheraBrake Academy™',
  description: 'Choose your learning path with flexible pricing options for CE credits and personal development courses.',
  keywords: 'CE credits pricing, Texas LPC courses, mental health continuing education, course membership',
}

interface PricingCardProps {
  title: string
  price: string
  popular?: boolean
  color: 'primary' | 'action' | 'secondary'
  features?: string[]
  bonus?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  whatYouGet?: string[]
  bestFor?: string
  value?: string[]
}

function PricingCard({ 
  title, 
  price, 
  popular, 
  color, 
  features, 
  bonus, 
  description,
  buttonText = "Get Started",
  buttonLink = "/register",
  whatYouGet,
  bestFor,
  value
}: PricingCardProps) {
  const colorClasses = {
    primary: 'bg-primary',
    action: 'bg-action',
    secondary: 'bg-secondary'
  }

  const buttonColorClasses = {
    primary: 'bg-primary hover:bg-blue-600',
    action: 'bg-action hover:bg-orange-600',
    secondary: 'bg-secondary hover:bg-green-600'
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 ${popular ? 'border-2 border-action' : ''} flex flex-col`}>
      <div className={`${colorClasses[color]} p-6 text-white relative`}>
        {popular && (
          <div className="absolute top-2 right-2 bg-white text-action px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            MOST POPULAR
          </div>
        )}
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="text-4xl font-bold">{price}</div>
        {description && <p className="text-sm mt-2 opacity-90">{description}</p>}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        {whatYouGet && (
          <>
            <h4 className="font-bold text-neutral-dark mb-3">What You Get:</h4>
            <ul className="space-y-2 mb-4 text-sm">
              {whatYouGet.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-dark" dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </>
        )}
        
        {features && (
          <ul className="space-y-3 mb-6 flex-grow">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <span className="text-neutral-dark" dangerouslySetInnerHTML={{ __html: feature }} />
              </li>
            ))}
          </ul>
        )}
        
        {bestFor && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-sm">
              <strong className="text-primary">Best For:</strong> {bestFor}
            </p>
          </div>
        )}
        
        {value && value.length > 0 && (
          <div className="bg-green-50 p-3 rounded-lg mb-4">
            <p className="text-sm font-semibold text-secondary mb-2">💡 Value:</p>
            <ul className="space-y-1">
              {value.map((item, idx) => (
                <li key={idx} className="text-xs text-neutral-dark">• {item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {bonus && (
          <div className="bg-accent/10 p-3 rounded-lg mb-4">
            <p className="text-sm font-semibold text-action flex items-start gap-2">
              <Gift className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{bonus}</span>
            </p>
          </div>
        )}
        
        <Link 
          href={buttonLink}
          className={`w-full text-center py-3 px-6 rounded-lg font-semibold text-white transition-colors ${buttonColorClasses[color]} mt-auto flex items-center justify-center gap-2 group`}
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}

interface BenefitCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

function BenefitCard({ icon, title, description, color }: BenefitCardProps) {
  return (
    <div className="text-center group">
      <div className={`${color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 transform transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="font-bold text-neutral-dark mb-2">{title}</h3>
      <p className="text-sm text-neutral-medium">{description}</p>
    </div>
  )
}

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-16">
        <div className="container-therabrake text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-10 h-10 text-accent animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-neutral-dark">
              Choose Your Learning Path
            </h1>
          </div>
          <p className="text-lg text-neutral-medium max-w-3xl mx-auto">
            At TheraBrake Academy™, you decide how you want to grow. Whether you&apos;re looking for a single course 
            to meet a requirement or a membership that unlocks unlimited learning, we&apos;ve designed flexible options 
            to fit your needs and budget.
          </p>
        </div>
      </section>

      {/* Individual Course Pricing */}
      <section className="py-12">
        <div className="container-therabrake">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-3xl font-bold font-heading text-neutral-dark">
                  Individual Course Pricing
                </h2>
                <p className="text-lg text-neutral-medium">Perfect for focused learning.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-neutral-dark">CEU Courses</p>
                  <p className="text-neutral-medium">Starting at just <span className="font-bold text-primary text-xl">$19.99</span></p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-neutral-dark">Personal Development</p>
                  <p className="text-neutral-medium">From <span className="font-bold text-primary text-xl">$99</span></p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-neutral-dark">Access Duration</p>
                  <p className="text-neutral-medium">6 months per course</p>
                </div>
              </div>
            </div>
            
            <div className="bg-accent/10 border-l-4 border-accent p-4 rounded-lg">
              <p className="text-neutral-dark flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-action flex-shrink-0" />
                <strong>Great if you need a specific credit hour or want to try us out before committing.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CE Membership Packages */}
      <section className="py-12 bg-gray-100">
        <div className="container-therabrake">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <GraduationCap className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold font-heading text-neutral-dark">
                CE Membership Packages
              </h2>
            </div>
            <p className="text-lg text-action font-semibold">(Best Value)</p>
            <p className="text-neutral-medium">Unlock more courses, more savings, and more growth.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <PricingCard
              title="🎓 1-Year CE Membership"
              price="$199"
              color="primary"
              whatYouGet={[
                "Full access to <strong>all CEU courses</strong> (currently 31+ credit hours, with more added regularly)",
                "Complete your <strong>annual CE requirement</strong> with just one purchase",
                "Self-paced learning: videos, interactive quizzes, and downloadable workbooks",
                "Earn <strong>instant digital certificates</strong> for completed courses",
                "Access valid for <strong>12 months</strong> from the day you join"
              ]}
              bestFor="Professionals who need to complete annual CE hours and want affordable, flexible access"
              value={[
                "Buying 30 CE hours individually costs about $300+",
                "Membership gives you the same credits for $199",
                "Save over $100"
              ]}
              buttonText="Enroll Now - Save $100"
              buttonLink="/enrollment?type=ce&plan=ce-1year&price=199"
            />

            <PricingCard
              title="🎓 2-Year CE Membership"
              price="$299"
              color="action"
              popular={true}
              whatYouGet={[
                "All benefits of the 1-Year Membership, extended to <strong>24 months</strong>",
                "Access to every CEU course released during your membership",
                "<strong>$100 discount</strong> on <em>The So What Mindset</em> program",
                "<strong>$100 discount</strong> on <em>Leap & Launch!</em> program",
                "Unlimited certificates and CE hours—submit anytime"
              ]}
              bestFor="Clinicians who renew their license every two years and want to lock in training at a low cost"
              value={[
                "Two annual memberships ($398 value) for only $299",
                "Plus bonus discounts worth $200 savings"
              ]}
              buttonText="Most Popular - Enroll Now"
              buttonLink="/enrollment?type=ce&plan=ce-2year&price=299"
            />

            <PricingCard
              title="�� 5-Year CE + Personal"
              price="$699"
              color="secondary"
              whatYouGet={[
                "<strong>Complete professional access</strong>: every CEU course (200+ hours when fully developed)",
                "<strong>Complete personal growth access</strong>: all courses for healing, resilience, relationships",
                "Access valid for <strong>60 months (5 years)</strong>—no renewals, no stress",
                "Bonus: <em>So What Mindset</em> for $399 (instead of $499)",
                "Bonus: <em>Leap & Launch!</em> for $199 (instead of $299)",
                "Certificates for all CE courses and lifetime skills"
              ]}
              bestFor="Professionals committed to long-term growth for career advancement and personal healing"
              value={[
                "200 CE hours individually = $1,999+",
                "Personal courses individually = $1,299+",
                "Total value over $3,000",
                "You pay just $699 - Save over $2,500!"
              ]}
              bonus="Ultimate value—grow your practice and yourself for less than $12/month"
              buttonText="Best Value - Enroll Now"
              buttonLink="/enrollment?type=ce&plan=ce-lifetime&price=699"
            />
          </div>
        </div>
      </section>

      {/* Personal Development Memberships */}
      <section className="py-12" id="personal">
        <div className="container-therabrake">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sprout className="w-8 h-8 text-secondary" />
            <h2 className="text-3xl font-bold font-heading text-neutral-dark text-center">
              Personal Development Memberships
            </h2>
          </div>
          <p className="text-lg text-neutral-medium text-center mb-8">
            Designed for healing, growth, and empowerment.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              title="🌱 1-Year Personal"
              price="$299"
              color="primary"
              whatYouGet={[
                "Access to <strong>all personal growth courses</strong>",
                "Tools for relationships, resilience, health, and finance",
                "Monthly group coaching calls",
                "Community access and support",
                "Downloadable workbooks and resources",
                "Valid for <strong>12 months</strong>"
              ]}
              bestFor="Individuals ready to invest in personal transformation"
              value={[
                "Individual courses cost $500+",
                "Get everything for just $299",
                "Save over $200"
              ]}
              buttonText="Start Your Journey"
              buttonLink="/enrollment?type=personal&plan=personal-1year&price=299"
            />

            <PricingCard
              title="🌱 2-Year Personal"
              price="$399"
              color="action"
              whatYouGet={[
                "Everything in 1-Year membership",
                "Extended <strong>24-month access</strong>",
                "Priority coaching slots",
                "Bonus discounts on premium programs",
                "Early access to new courses",
                "Best for steady transformation"
              ]}
              bestFor="Those committed to long-term personal development"
              value={[
                "Two 1-year memberships = $598",
                "You pay only $399",
                "Save almost $200"
              ]}
              buttonText="Enroll for 2 Years"
              buttonLink="/enrollment?type=personal&plan=personal-2year&price=399"
            />

            <PricingCard
              title="🌟 5-Year Personal"
              price="$699"
              color="secondary"
              whatYouGet={[
                "All personal growth content",
                "Valid for <strong>60 months (5 years)</strong>",
                "VIP support access",
                "Exclusive discounts on all programs",
                "Future courses included",
                "Lowest per-month rate"
              ]}
              bestFor="Maximum value seekers who want lifetime-like access"
              value={[
                "5 years of courses = $1,500+",
                "Get everything for $699",
                "Save over $800"
              ]}
              buttonText="Best Value - Enroll"
              buttonLink="/enrollment?type=personal&plan=personal-5year&price=699"
            />
          </div>
        </div>
      </section>

      {/* Premium Programs */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="container-therabrake">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading text-neutral-dark mb-2">
              Premium Transformation Programs
            </h2>
            <p className="text-lg text-neutral-medium">Intensive programs for breakthrough results</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              title="🧠 So What Mindset"
              price="$499"
              color="primary"
              features={[
                "12 transformative modules",
                "Live monthly Q&A sessions",
                "Private community access",
                "Personal breakthrough toolkit",
                "Certificate of completion",
                "Bonus: 1-on-1 coaching session"
              ]}
              description="Transform your thinking, transform your life"
              buttonText="Enroll in Program"
              buttonLink="/enrollment?type=premium&plan=so-what-mindset&price=499"
            />

            <PricingCard
              title="🚀 Leap & Launch"
              price="$299"
              color="action"
              features={[
                "8-week transformation program",
                "Weekly live sessions",
                "Action planning workbooks",
                "Accountability partner matching",
                "Success metrics dashboard",
                "30-day money-back guarantee"
              ]}
              description="Build your dream practice with confidence"
              buttonText="Start Your Launch"
              buttonLink="/enrollment?type=premium&plan=leap-and-launch&price=299"
            />
          </div>
        </div>
      </section>

      {/* Why Members Choose Packages */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container-therabrake">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Lightbulb className="w-8 h-8 text-accent" />
              <h2 className="text-3xl font-bold font-heading text-neutral-dark">
                Why Members Choose Packages
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <BenefitCard
                icon={<DollarSign className="w-8 h-8 text-primary" />}
                title="Massive Savings"
                description="Save hundreds or even thousands compared to individual course purchases"
                color="bg-primary/10"
              />

              <BenefitCard
                icon={<Infinity className="w-8 h-8 text-secondary" />}
                title="Unlimited Access"
                description="Explore all courses without worrying about additional costs"
                color="bg-secondary/10"
              />

              <BenefitCard
                icon={<Gift className="w-8 h-8 text-accent" />}
                title="Exclusive Bonuses"
                description="Get special discounts on premium programs worth hundreds in savings"
                color="bg-accent/10"
              />

              <BenefitCard
                icon={<Rocket className="w-8 h-8 text-action" />}
                title="Future-Proof"
                description="Access all new courses released during your membership period"
                color="bg-action/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-therabrake text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ArrowRight className="w-8 h-8 animate-pulse" />
            <h2 className="text-3xl font-bold font-heading">
              Ready to Start Your Journey?
            </h2>
          </div>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of professionals and individuals who are transforming their practices and lives with TheraBrake Academy™.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/courses" 
              className="px-8 py-4 bg-white text-primary rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Browse Individual Courses
            </Link>
            <Link 
              href="/enrollment?type=ce" 
              className="px-8 py-4 bg-action text-white rounded-lg font-bold hover:bg-orange-600 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Start Your Membership Today
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
