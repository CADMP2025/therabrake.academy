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
  ArrowRight
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
  features: string[]
  bonus?: string
  description?: string
  buttonText?: string
  buttonLink?: string
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
  buttonLink = "/register"
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
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105 ${popular ? 'border-2 border-action' : ''}`}>
      <div className={`${colorClasses[color]} p-6 text-white relative`}>
        {popular && (
          <div className="absolute top-2 right-2 bg-white text-action px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            POPULAR
          </div>
        )}
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="text-4xl font-bold">{price}</div>
        {description && <p className="text-sm mt-2 opacity-90">{description}</p>}
      </div>
      <div className="p-6 flex flex-col h-full">
        <ul className="space-y-3 mb-6 flex-grow">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
              <span className="text-neutral-dark" dangerouslySetInnerHTML={{ __html: feature }} />
            </li>
          ))}
        </ul>
        {bonus && (
          <div className="bg-secondary/10 p-3 rounded-lg mb-4">
            <p className="text-sm font-semibold text-secondary flex items-start gap-2">
              <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{bonus}</span>
            </p>
          </div>
        )}
        <Link 
          href={buttonLink}
          className={`w-full text-center py-3 px-6 rounded-lg font-semibold text-white transition-colors ${buttonColorClasses[color]}`}
        >
          {buttonText}
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
                Membership Packages
              </h2>
            </div>
            <p className="text-lg text-action font-semibold">(Best Value)</p>
            <p className="text-neutral-medium">Unlock more courses, more savings, and more growth.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <PricingCard
              title="1-Year CE Membership"
              price="$199"
              color="primary"
              features={[
                'Access to all CEU courses (31+ hours)',
                'Covers annual license renewal requirements'
              ]}
              bonus="Save over $100 compared to buying courses individually"
              buttonText="Start Learning"
              buttonLink="/register?plan=ce-1year"
            />

            <PricingCard
              title="2-Year CE Membership"
              price="$299"
              color="action"
              popular={true}
              features={[
                'Double the access for less than double the cost',
                '<strong>Bonus:</strong> $100 off <em>So What Mindset</em> & <em>Leap & Launch</em>'
              ]}
              bonus="Perfect for biennial renewals"
              buttonText="Most Popular Choice"
              buttonLink="/register?plan=ce-2year"
            />

            <PricingCard
              title="5-Year CE + Personal"
              price="$699"
              color="secondary"
              features={[
                'All CEU + all personal development courses',
                'Access for 60 months',
                'Bonus discounts on premium programs'
              ]}
              bonus="Ultimate value—grow your practice and yourself for less than $12/month"
              buttonText="Maximum Value"
              buttonLink="/register?plan=ce-5year"
            />
          </div>
        </div>
      </section>

      {/* Personal Development Memberships */}
      <section className="py-12">
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
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-neutral-dark mb-4">1-Year – $299</h3>
              <ul className="space-y-2 text-neutral-medium mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Access to all personal growth courses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Tools for relationships, resilience, health, and finance</span>
                </li>
              </ul>
              <Link 
                href="/register?plan=personal-1year"
                className="block w-full text-center py-2 px-4 bg-secondary text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-neutral-dark mb-4">2-Year – $399</h3>
              <ul className="space-y-2 text-neutral-medium mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Everything in 1-Year plus bonus discounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Best for steady, long-term transformation</span>
                </li>
              </ul>
              <Link 
                href="/register?plan=personal-2year"
                className="block w-full text-center py-2 px-4 bg-secondary text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-neutral-dark mb-4">5-Year – $699</h3>
              <ul className="space-y-2 text-neutral-medium mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>All personal growth content + exclusive discounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Lock in long-term access at the lowest rate</span>
                </li>
              </ul>
              <Link 
                href="/register?plan=personal-5year"
                className="block w-full text-center py-2 px-4 bg-secondary text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
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
                title="Savings Add Up"
                description="30 CE hours individually cost ~$300. A 1-Year Membership is just $199."
                color="bg-primary/10"
              />

              <BenefitCard
                icon={<Infinity className="w-8 h-8 text-secondary" />}
                title="Flexibility"
                description="Explore multiple tracks without paying per course."
                color="bg-secondary/10"
              />

              <BenefitCard
                icon={<Gift className="w-8 h-8 text-accent" />}
                title="Exclusive Bonuses"
                description="Discounts on premium programs like So What Mindset and Leap & Launch."
                color="bg-accent/10"
              />

              <BenefitCard
                icon={<Rocket className="w-8 h-8 text-action" />}
                title="Future-Proof Learning"
                description="Access new courses released during your membership."
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
              Your Choice, Your Pace
            </h2>
          </div>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Take one course today or invest in a membership for the greatest value. 
            Either way, you&apos;re moving forward with TheraBrake Academy™.
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
              href="/register" 
              className="px-8 py-4 bg-action text-white rounded-lg font-bold hover:bg-orange-600 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Get Started with Membership
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
