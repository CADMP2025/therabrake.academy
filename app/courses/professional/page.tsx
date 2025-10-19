import Link from 'next/link'
import { Clock, Award, DollarSign } from 'lucide-react'
import AuthenticatedEnrollButton from '@/components/enrollment/AuthenticatedEnrollButton'

const currentCourses = [
  {
    id: 'trauma-informed-telehealth',
    title: 'Building a Trauma-Informed Practice & Telehealth',
    hours: 6,
    price: 59.99,
    description: 'Transform Your Practice for the Modern Era',
    fullDescription: 'Understanding trauma\'s pervasive impact while mastering digital delivery methods. Learn evidence-based trauma-informed approaches and master telehealth delivery.',
    emoji: '🌐'
  },
  {
    id: 'cultural-diversity',
    title: 'Cultural Diversity in Texas Counseling Practice',
    hours: 3,
    price: 29.99,
    description: 'Serve Every Texan with Cultural Competence',
    fullDescription: 'Bridge differences with skill and sensitivity. Explore unique cultural dynamics of Texas communities.',
    emoji: '🌎'
  },
  {
    id: 'ethics-counselors',
    title: 'Ethics for Professional Counselors',
    hours: 6,
    price: 59.99,
    description: 'Navigate Complex Ethical Challenges with Clarity',
    fullDescription: 'Develop robust ethical decision-making frameworks using Texas-specific case law and LPC board decisions.',
    emoji: '⚖️'
  },
  {
    id: 'regulating-storm',
    title: 'Regulating the Storm: Trauma, Anger, and the Brain',
    hours: 6,
    price: 59.99,
    description: 'Master the Neuroscience of Emotional Dysregulation',
    fullDescription: 'Reveal neurobiological connections between trauma and anger, implement brain-based interventions.',
    emoji: '🌩️'
  },
  {
    id: 'risk-management',
    title: 'Risk Management in Counseling',
    hours: 2,
    price: 19.99,
    description: 'Protect Your Practice, Serve with Peace of Mind',
    fullDescription: 'Learn from real Texas malpractice cases, develop systems for managing high-risk situations.',
    emoji: '🛡️'
  },
  {
    id: 'telehealth',
    title: 'Telehealth in Counseling',
    hours: 3,
    price: 29.99,
    description: 'Build a Thriving Virtual Practice',
    fullDescription: 'Excel in virtual counseling with HIPAA-compliant platforms and therapeutic presence techniques.',
    emoji: '💻'
  },
  {
    id: 'business-ethics',
    title: 'Business Ethics for Mental Health Professionals',
    hours: 2,
    price: 19.99,
    description: 'Where Clinical Ethics Meets Business Reality',
    fullDescription: 'Navigate financial sustainability while maintaining clinical ethics and professional values.',
    emoji: '💼'
  },
  {
    id: 'suicide-prevention',
    title: 'Suicide Risk Assessment and Prevention',
    hours: 3,
    price: 29.99,
    description: 'Recognize, Assess, and Respond to Suicidal Ideation',
    fullDescription: 'Master critical skills using evidence-based tools and Texas legal requirements.',
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
        description: 'Navigate the Uncharted Territory of Digital Mental Health',
        fullDescription: 'Technology is reshaping therapy faster than ethics boards can write guidelines. Tackle emerging ethical challenges of digital mental health.',
        emoji: '🔒'
      },
      {
        id: 'legal-issues',
        title: 'Legal Issues and Documentation for Counselors',
        hours: 4,
        price: 39.99,
        description: 'Master the Law to Protect Your Practice',
        fullDescription: 'Demystify the complex legal landscape surrounding counseling practice, from Texas state regulations to federal privacy laws.',
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
        description: 'Beyond Traditional PTSD Treatment',
        fullDescription: 'When trauma occurs early, repeatedly, or in relationships, it creates complex wounds. Learn phase-oriented treatment approaches.',
        emoji: '🧩'
      },
      {
        id: 'emdr-level1',
        title: 'EMDR Level 1 Training',
        hours: 15,
        price: 149.99,
        description: 'Evidence-Based Trauma Treatment',
        fullDescription: 'Comprehensive Level 1 training in Eye Movement Desensitization and Reprocessing, one of the most researched trauma treatments.',
        emoji: '👁️'
      },
      {
        id: 'somatic-approaches',
        title: 'Somatic Approaches to Trauma Recovery',
        hours: 6,
        price: 59.99,
        description: 'Healing Trauma Through Body Wisdom',
        fullDescription: 'Trauma lives in the body. Learn body-based interventions that help clients regulate their nervous systems.',
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
        description: 'Build Expertise in Addiction Treatment',
        fullDescription: 'Comprehensive foundation for understanding and treating addiction across all substances and behaviors.',
        emoji: '🍷'
      },
      {
        id: 'co-occurring',
        title: 'Co-Occurring Disorders: Mental Health and Substance Use',
        hours: 6,
        price: 59.99,
        description: 'Treat the Whole Person',
        fullDescription: 'Learn integrated treatment approaches for co-occurring disorders, addressing mental health and addiction simultaneously.',
        emoji: '⚖️'
      },
      {
        id: 'motivational-interviewing',
        title: 'Motivational Interviewing for Addiction Recovery',
        hours: 6,
        price: 59.99,
        description: 'Master the Art of Change Conversation',
        fullDescription: 'Collaborative, client-centered approach that helps people find their own motivation for change.',
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
        description: 'Transform Relationships with Science-Based Interventions',
        fullDescription: 'Most researched approach to couples therapy, with over 40 years of data on what makes relationships succeed.',
        emoji: '💑'
      },
      {
        id: 'family-systems',
        title: 'Family Systems and Structural Family Therapy',
        hours: 8,
        price: 79.99,
        description: 'Understand and Transform Family Dynamics',
        fullDescription: 'Learn to see beyond the identified patient to understand family dynamics and create lasting systemic change.',
        emoji: '🏠'
      }
    ]
  },
  {
    category: 'Child and Adolescent Specialization',
    courses: [
      {
        id: 'play-therapy',
        title: 'Play Therapy Fundamentals',
        hours: 12,
        price: 119.99,
        description: 'Speak the Language Children Understand',
        fullDescription: 'Children process the world through play. Learn to use play as both assessment and intervention tool.',
        emoji: '🧸'
      },
      {
        id: 'adolescent-treatment',
        title: 'Adolescent Depression and Anxiety Treatment',
        hours: 8,
        price: 79.99,
        description: 'Navigate the Unique Challenges of Teenage Mental Health',
        fullDescription: 'Evidence-based approaches specifically designed for adolescent clients, including CBT for teens and family involvement.',
        emoji: '🎧'
      }
    ]
  },
  {
    category: 'Crisis Intervention & Specialty Populations',
    courses: [
      {
        id: 'crisis-intervention',
        title: 'Crisis Intervention and De-escalation Techniques',
        hours: 6,
        price: 59.99,
        description: 'Stay Calm and Effective When Stakes Are Highest',
        fullDescription: 'Learn to assess, intervene, and de-escalate crisis situations safely and effectively.',
        emoji: '🚑'
      },
      {
        id: 'military-veterans',
        title: 'Working with Military Veterans and PTSD',
        hours: 6,
        price: 59.99,
        description: 'Honor Their Service Through Expert Care',
        fullDescription: 'Specialized understanding of military culture and evidence-based treatments for veteran populations.',
        emoji: '🎖️'
      },
      {
        id: 'grief-bereavement',
        title: 'Grief and Bereavement Counseling',
        hours: 8,
        price: 79.99,
        description: 'Guide Others Through Life\'s Most Difficult Journey',
        fullDescription: 'Support clients through devastating experiences of loss using contemporary grief theories and compassionate techniques.',
        emoji: '🕊️'
      }
    ]
  },
  {
    category: 'Clinical Supervision & Leadership',
    courses: [
      {
        id: 'clinical-supervision',
        title: 'Clinical Supervision Skills for New Supervisors',
        hours: 12,
        price: 119.99,
        description: 'Lead the Next Generation of Mental Health Professionals',
        fullDescription: 'Learn the art and science of clinical supervision, from legal responsibilities to developmental models.',
        emoji: '👥'
      },
      {
        id: 'leadership-mental-health',
        title: 'Leadership in Mental Health Organizations',
        hours: 8,
        price: 79.99,
        description: 'Transform Mental Health Care Through Effective Leadership',
        fullDescription: 'Develop leadership skills for mental health settings, covering team building, change management, and ethical leadership.',
        emoji: '🌟'
      }
    ]
  },
  {
    category: 'Practice Development & Innovation',
    courses: [
      {
        id: 'private-practice',
        title: 'Advanced Private Practice Management',
        hours: 8,
        price: 79.99,
        description: 'Build a Practice That Serves You While You Serve Others',
        fullDescription: 'Sophisticated aspects of practice management: scaling, hiring staff, implementing group therapy programs.',
        emoji: '📈'
      },
      {
        id: 'group-therapy',
        title: 'Group Therapy Facilitation and Development',
        hours: 6,
        price: 59.99,
        description: 'Harness the Healing Power of Community',
        fullDescription: 'Learn group leadership techniques, member selection, and stage-based group development models.',
        emoji: '🔄'
      },
      {
        id: 'integrative-holistic',
        title: 'Integrative and Holistic Treatment Approaches',
        hours: 6,
        price: 59.99,
        description: 'Expand Your Therapeutic Toolkit with Mind-Body Approaches',
        fullDescription: 'Incorporate holistic approaches including mindfulness, yoga therapy, and energy psychology.',
        emoji: '🌿'
      }
    ]
  },
  {
    category: 'Continuing Education Electives',
    courses: [
      {
        id: 'mindfulness-interventions',
        title: 'Mindfulness-Based Interventions in Therapy',
        hours: 6,
        price: 59.99,
        description: 'Bring Ancient Wisdom to Modern Therapy',
        fullDescription: 'Practical mindfulness techniques adapted for therapeutic settings, including MBSR and MBCT.',
        emoji: '🧘'
      },
      {
        id: 'neurofeedback',
        title: 'Neurofeedback and Brain-Based Therapies',
        hours: 6,
        price: 59.99,
        description: 'Train the Brain for Optimal Mental Health',
        fullDescription: 'Cutting edge brain-based therapies offering hope for conditions that don\'t respond to traditional approaches.',
        emoji: '🧠'
      },
      {
        id: 'art-expressive',
        title: 'Art and Expressive Therapies Techniques',
        hours: 4,
        price: 39.99,
        description: 'Unlock Healing Through Creative Expression',
        fullDescription: 'Basic art therapy techniques for clients who struggle with verbal processing or need additional healing pathways.',
        emoji: '🎨'
      },
      {
        id: 'lgbtq-clients',
        title: 'Working with LGBTQ+ Clients',
        hours: 4,
        price: 39.99,
        description: 'Provide Affirming, Competent Care for Sexual and Gender Minorities',
        fullDescription: 'Culturally competent therapy for LGBTQ+ clients, covering identity development and affirming approaches.',
        emoji: '🏳️‍🌈'
      },
      {
        id: 'eating-disorders',
        title: 'Eating Disorders Assessment and Treatment',
        hours: 6,
        price: 59.99,
        description: 'Understand and Treat the Intersection of Food, Body, and Mind',
        fullDescription: 'Recognition and evidence-based treatment of eating disorders across the spectrum.',
        emoji: '🍽️'
      },
      {
        id: 'chronic-pain',
        title: 'Chronic Pain and Medical Psychology',
        hours: 4,
        price: 39.99,
        description: 'Address the Psychological Impact of Physical Suffering',
        fullDescription: 'Psychological approaches to pain management and the biopsychosocial model of chronic pain.',
        emoji: '💊'
      },
      {
        id: 'digital-mental-health',
        title: 'Digital Mental Health Tools and Apps',
        hours: 3,
        price: 29.99,
        description: 'Navigate the Digital Revolution in Mental Health Care',
        fullDescription: 'Evaluate mental health technology and guide clients in selecting appropriate apps and online resources.',
        emoji: '📱'
      },
      {
        id: 'cultural-competency-populations',
        title: 'Cultural Competency: Specific Populations',
        hours: 3,
        price: 29.99,
        description: 'Deepen Your Understanding of Diverse Communities',
        fullDescription: 'In-depth exploration of specific cultural populations with culturally adapted interventions.',
        emoji: '🌐'
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
        
        {/* Current Courses Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Current CE Catalog (31 Credit Hours)</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{course.emoji}</span>
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
                  
                  <div className="space-y-2">
                    <Link 
                      href={`/courses/${course.id}`}
                      className="block bg-gray-100 text-primary text-center py-2 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      View Course Details
                    </Link>
                    
                    <AuthenticatedEnrollButton
                      courseId={course.id}
                      productType="course"
                      price={course.price}
                      className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition font-medium"
                    >
                      Enroll Now
                    </AuthenticatedEnrollButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Expanded Courses Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Expanded CE Catalog (169+ Additional Hours)</h2>
          {expandedCourses.map((category) => (
            <div key={category.category} className="mb-12">
              <h3 className="text-xl font-semibold mb-6 text-primary border-b-2 border-primary/20 pb-2">{category.category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group">
                    <div className="bg-gradient-to-br from-primary to-primary-dark p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{course.emoji}</span>
                        <span className="text-white font-bold bg-white/20 px-2 py-1 rounded">{course.hours} CE</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-text-primary mb-2">{course.title}</h4>
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
                      
                      <div className="space-y-2">
                        <Link 
                          href={`/courses/${course.id}`}
                          className="block bg-gray-100 text-primary text-center py-2 rounded-lg hover:bg-gray-200 transition font-medium"
                        >
                          View Course Details
                        </Link>
                        
                        <AuthenticatedEnrollButton
                          courseId={course.id}
                          productType="course"
                          price={course.price}
                          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition font-medium"
                        >
                          Enroll Now
                        </AuthenticatedEnrollButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        <div className="text-center my-12">
          <Link 
            href="/pricing"
            className="bg-action text-white px-8 py-3 rounded-lg hover:bg-action/90 transition inline-block font-semibold text-lg shadow-lg"
          >
            View All Courses & Membership Options
          </Link>
        </div>
      </div>
    </div>
  )
}
