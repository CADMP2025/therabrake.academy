import Link from 'next/link'
import { Clock, Award, DollarSign, Brain, Globe, Scale, Zap, Shield, Monitor, Briefcase, AlertTriangle, Lock, FileText, Puzzle, Eye, Activity, Wine, Pill, MessageCircle, Heart, Home, Baby, Headphones, Cross, Medal, Bird, Users, Star, TrendingUp, Leaf, Palette, Flag, Smartphone, Sun, HeartOff, Handshake, Gift, CreditCard, Coins, Key, Rocket } from 'lucide-react'

const currentCourses = [
  {
    id: 'trauma-informed-telehealth',
    title: 'Building a Trauma-Informed Practice & Telehealth',
    hours: 6,
    price: 59.99,
    description: 'Transform Your Practice for the Modern Era',
    fullDescription: 'Understanding trauma\'s pervasive impact while mastering digital delivery methods. Learn evidence-based trauma-informed approaches and master telehealth delivery.',
    icon: Brain,
    emoji: '🌐'
  },
  {
    id: 'cultural-diversity',
    title: 'Cultural Diversity in Texas Counseling Practice',
    hours: 3,
    price: 29.99,
    description: 'Serve Every Texan with Cultural Competence',
    fullDescription: 'Bridge differences with skill and sensitivity. Explore unique cultural dynamics of Texas communities.',
    icon: Globe,
    emoji: '🌎'
  },
  {
    id: 'ethics-counselors',
    title: 'Ethics for Professional Counselors',
    hours: 6,
    price: 59.99,
    description: 'Navigate Complex Ethical Challenges with Clarity',
    fullDescription: 'Develop robust ethical decision-making frameworks using Texas-specific case law and LPC board decisions.',
    icon: Scale,
    emoji: '⚖️'
  },
  {
    id: 'regulating-storm',
    title: 'Regulating the Storm: Trauma, Anger, and the Brain',
    hours: 6,
    price: 59.99,
    description: 'Master the Neuroscience of Emotional Dysregulation',
    fullDescription: 'Reveal neurobiological connections between trauma and anger, implement brain-based interventions.',
    icon: Zap,
    emoji: '🌩️'
  },
  {
    id: 'risk-management',
    title: 'Risk Management in Counseling',
    hours: 2,
    price: 19.99,
    description: 'Protect Your Practice, Serve with Peace of Mind',
    fullDescription: 'Learn from real Texas malpractice cases, develop systems for managing high-risk situations.',
    icon: Shield,
    emoji: '🛡️'
  },
  {
    id: 'telehealth',
    title: 'Telehealth in Counseling',
    hours: 3,
    price: 29.99,
    description: 'Build a Thriving Virtual Practice',
    fullDescription: 'Excel in virtual counseling with HIPAA-compliant platforms and therapeutic presence techniques.',
    icon: Monitor,
    emoji: '💻'
  },
  {
    id: 'business-ethics',
    title: 'Business Ethics for Mental Health Professionals',
    hours: 2,
    price: 19.99,
    description: 'Where Clinical Ethics Meets Business Reality',
    fullDescription: 'Navigate financial sustainability while maintaining clinical ethics and professional values.',
    icon: Briefcase,
    emoji: '💼'
  },
  {
    id: 'suicide-prevention',
    title: 'Suicide Risk Assessment and Prevention',
    hours: 3,
    price: 29.99,
    description: 'Recognize, Assess, and Respond to Suicidal Ideation',
    fullDescription: 'Master critical skills using evidence-based tools and Texas legal requirements.',
    icon: AlertTriangle,
    emoji: '🚨'
  }
]

const expandedCourses = [
  {
    category: 'Foundation Courses',
    courses: [
      {
        id: 'advanced-ethics-digital',
        title: 'Advanced Ethics in Digital Age Counseling',
        hours: 4,
        price: 39.99,
        icon: Lock,
        description: 'Navigate the Uncharted Territory of Digital Mental Health',
        emoji: '🔒'
      },
      {
        id: 'legal-issues',
        title: 'Legal Issues and Documentation for Counselors',
        hours: 4,
        price: 39.99,
        icon: FileText,
        description: 'Master the Law to Protect Your Practice',
        emoji: '📜'
      }
    ]
  },
  {
    category: 'Trauma Specialization',
    courses: [
      {
        id: 'complex-ptsd',
        title: 'Complex PTSD and Developmental Trauma',
        hours: 8,
        price: 79.99,
        icon: Puzzle,
        description: 'Beyond Traditional PTSD Treatment',
        emoji: '🧩'
      },
      {
        id: 'emdr-level1',
        title: 'EMDR Level 1 Training',
        hours: 15,
        price: 149.99,
        icon: Eye,
        description: 'Evidence-Based Trauma Treatment',
        emoji: '👁️'
      },
      {
        id: 'somatic-approaches',
        title: 'Somatic Approaches to Trauma Recovery',
        hours: 6,
        price: 59.99,
        icon: Activity,
        description: 'Healing Trauma Through Body Wisdom',
        emoji: '🧘'
      }
    ]
  },
  {
    category: 'Substance Abuse & Addiction',
    courses: [
      {
        id: 'addiction-fundamentals',
        title: 'Addiction Counseling Fundamentals',
        hours: 8,
        price: 79.99,
        icon: Wine,
        description: 'Build Expertise in Addiction Treatment',
        emoji: '🍷'
      },
      {
        id: 'co-occurring',
        title: 'Co-Occurring Disorders',
        hours: 6,
        price: 59.99,
        icon: Pill,
        description: 'Treat the Whole Person',
        emoji: '⚖️'
      },
      {
        id: 'motivational-interviewing',
        title: 'Motivational Interviewing for Recovery',
        hours: 6,
        price: 59.99,
        icon: MessageCircle,
        description: 'Master the Art of Change Conversation',
        emoji: '💬'
      }
    ]
  },
  {
    category: 'Family and Couples Therapy',
    courses: [
      {
        id: 'gottman-method',
        title: 'Gottman Method Couples Therapy Level 1',
        hours: 12,
        price: 119.99,
        icon: Heart,
        description: 'Transform Relationships with Science-Based Interventions',
        emoji: '💑'
      },
      {
        id: 'family-systems',
        title: 'Family Systems and Structural Family Therapy',
        hours: 8,
        price: 79.99,
        icon: Home,
        description: 'Understand and Transform Family Dynamics',
        emoji: '🏠'
      }
    ]
  },
  {
    category: 'Child and Adolescent',
    courses: [
      {
        id: 'play-therapy',
        title: 'Play Therapy Fundamentals',
        hours: 12,
        price: 119.99,
        icon: Baby,
        description: 'Speak the Language Children Understand',
        emoji: '🧸'
      },
      {
        id: 'adolescent-depression',
        title: 'Adolescent Depression and Anxiety Treatment',
        hours: 8,
        price: 79.99,
        icon: Headphones,
        description: 'Navigate the Unique Challenges of Teenage Mental Health',
        emoji: '🎧'
      }
    ]
  },
  {
    category: 'Crisis and Specialty Populations',
    courses: [
      {
        id: 'crisis-intervention',
        title: 'Crisis Intervention and De-escalation',
        hours: 6,
        price: 59.99,
        icon: Cross,
        description: 'Stay Calm and Effective When Stakes Are Highest',
        emoji: '🚑'
      },
      {
        id: 'veterans-ptsd',
        title: 'Working with Military Veterans and PTSD',
        hours: 6,
        price: 59.99,
        icon: Medal,
        description: 'Honor Their Service Through Expert Care',
        emoji: '🎖️'
      },
      {
        id: 'grief-bereavement',
        title: 'Grief and Bereavement Counseling',
        hours: 8,
        price: 79.99,
        icon: Bird,
        description: 'Guide Others Through Life\'s Most Difficult Journey',
        emoji: '🕊️'
      }
    ]
  },
  {
    category: 'Leadership and Practice Development',
    courses: [
      {
        id: 'clinical-supervision',
        title: 'Clinical Supervision Skills',
        hours: 12,
        price: 119.99,
        icon: Users,
        description: 'Lead the Next Generation of Mental Health Professionals',
        emoji: '👥'
      },
      {
        id: 'leadership-mental-health',
        title: 'Leadership in Mental Health Organizations',
        hours: 8,
        price: 79.99,
        icon: Star,
        description: 'Transform Mental Health Care Through Effective Leadership',
        emoji: '🌟'
      },
      {
        id: 'private-practice',
        title: 'Advanced Private Practice Management',
        hours: 8,
        price: 79.99,
        icon: TrendingUp,
        description: 'Build a Practice That Serves You While You Serve Others',
        emoji: '📈'
      }
    ]
  }
]

export default function ProfessionalCoursesPage() {
  return (
    <div className="min-h-screen bg-background-light py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-2 text-center">
          Professional Development & CEU Courses
        </h1>
        <p className="text-center text-text-secondary mb-4">
          Texas LPC Board Approved CE Credits
        </p>
        <p className="text-center text-lg font-semibold text-primary mb-12">
          $9.99 per CE credit hour
        </p>
        
        {/* Current CE Catalog */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Current CE Catalog (31 Credit Hours)</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{course.emoji}</span>
                      <course.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-white font-bold bg-white/20 px-2 py-1 rounded">{course.hours} CE</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-text-primary mb-2">{course.title}</h3>
                  <p className="text-text-secondary text-sm mb-3">{course.description}</p>
                  <p className="text-xs text-text-secondary/80 mb-4 line-clamp-2">{course.fullDescription}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-text-secondary text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.hours} Hours</span>
                    </div>
                    <div className="flex items-center text-secondary font-bold">
                      <DollarSign className="h-4 w-4" />
                      <span>{course.price}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/courses/${course.id}`}
                    className="block bg-primary text-white text-center py-2 rounded-lg hover:bg-primary-dark transition font-medium"
                  >
                    View Course Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Membership CTA */}
        <div className="text-center my-12">
          <Link 
            href="/memberships"
            className="bg-action text-white px-8 py-3 rounded-lg hover:bg-action/90 transition inline-block font-semibold text-lg"
          >
            View All Courses & Membership Options
          </Link>
        </div>
      </div>
    </div>
  )
}
