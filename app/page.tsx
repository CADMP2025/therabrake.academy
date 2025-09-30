import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Award,
  Brain,
  Heart,
  Shield,
  Zap,
  Target,
  Sparkles,
  BookOpen,
  GraduationCap,
  Clock,
  TrendingUp
} from 'lucide-react'

export default function HomePage() {
  const featuredCourses = [
    {
      id: '1',
      title: 'Cognitive Behavioral Therapy Fundamentals',
      icon: Brain,
      color: 'from-primary/20 to-primary/10 text-primary',
      ce_hours: 6,
      price: 149,
      category: 'mental-health'
    },
    {
      id: '2',
      title: 'Trauma-Informed Care Practices',
      icon: Heart,
      color: 'from-secondary/20 to-secondary/10 text-secondary',
      ce_hours: 8,
      price: 199,
      category: 'therapy-techniques'
    },
    {
      id: '3',
      title: 'Ethics in Mental Health Practice',
      icon: Shield,
      color: 'from-accent/20 to-accent/10 text-accent',
      ce_hours: 4,
      price: 99,
      category: 'ethics'
    },
    {
      id: '4',
      title: 'Advanced EMDR Techniques',
      icon: Zap,
      color: 'from-action/20 to-action/10 text-action',
      ce_hours: 10,
      price: 299,
      category: 'trauma'
    }
  ]

  const stats = [
    { icon: Users, value: '5,000+', label: 'Active Students' },
    { icon: BookOpen, value: '150+', label: 'CE Courses' },
    { icon: Award, value: '98%', label: 'Pass Rate' },
    { icon: Star, value: '4.9/5', label: 'Average Rating' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/logo/logo.png"
                alt="TheraBrake Academy"
                width={80}
                height={80}
                className="animate-fadeIn"
              />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-text-primary mb-6 animate-slideDown">
              Texas-Approved CE Credits for{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Mental Health Professionals
              </span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 animate-fadeIn">
              Advance your career with our innovative cut & paste course builder.
              Create, learn, and earn CE credits seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn">
              <Link href="/courses" className="btn-primary flex items-center justify-center gap-2">
                Browse Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/auth/register" className="btn-outline">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-3">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-background-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Featured CE Courses
            </h2>
            <p className="text-lg text-text-secondary">
              Explore our most popular continuing education courses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <div className="card card-hover h-full">
                  <div className="p-6">
                    <div className={`w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br ${course.color} mb-4`}>
                      <course.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-lg text-text-primary mb-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.ce_hours} CE Hours
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Certificate
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${course.price}</span>
                      <span className="text-primary font-medium flex items-center gap-1">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses" className="btn-primary inline-flex items-center gap-2">
              View All Courses
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Programs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Premium Learning Programs
            </h2>
            <p className="text-lg text-text-secondary">
              Comprehensive programs designed for professional excellence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* So What Mindset Program */}
            <div className="card relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-secondary text-white px-4 py-1 rounded-bl-lg">
                <span className="text-sm font-semibold">PREMIUM</span>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">So What Mindset</h3>
                    <p className="text-text-secondary">Transform Your Practice</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
                    <span className="text-text-secondary">12-week intensive program</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
                    <span className="text-text-secondary">30 CE credits included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
                    <span className="text-text-secondary">Live coaching sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
                    <span className="text-text-secondary">Exclusive community access</span>
                  </li>
                </ul>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-primary">$499</span>
                    <span className="text-text-secondary ml-2">one-time</span>
                  </div>
                  <Link href="/programs/so-what-mindset" className="btn-primary text-sm">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>

            {/* Leap & Launch Program */}
            <div className="card relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-secondary to-primary text-white px-4 py-1 rounded-bl-lg">
                <span className="text-sm font-semibold">ACCELERATOR</span>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10">
                    <TrendingUp className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">Leap & Launch</h3>
                    <p className="text-text-secondary">Scale Your Impact</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
                    <span className="text-text-secondary">8-week business accelerator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
                    <span className="text-text-secondary">20 CE credits included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
                    <span className="text-text-secondary">Marketing templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
                    <span className="text-text-secondary">1-on-1 mentorship</span>
                  </li>
                </ul>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-secondary">$299</span>
                    <span className="text-text-secondary ml-2">one-time</span>
                  </div>
                  <Link href="/programs/leap-and-launch" className="btn-secondary text-sm">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Advance Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of mental health professionals earning CE credits with TheraBrake Academy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started Free
            </Link>
            <Link href="/courses" className="px-8 py-4 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
