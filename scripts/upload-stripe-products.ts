/**
 * TheraBrake Academy - Complete Stripe Product Catalog Upload
 * ALL 50 PRODUCTS - CE Memberships, Personal Dev, Courses, Premium Programs
 * 
 * ⚠️  WARNING: This uploads to your LIVE Stripe account
 * 
 * SETUP:
 * 1. Ensure STRIPE_SECRET_KEY in .env.local is set to LIVE key
 * 2. Run: npx ts-node scripts/upload-stripe-products.ts
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

interface ProductData {
  name: string
  description: string
  price: number
  billingPeriod?: 'year' | 'month' | null
  metadata: Record<string, string>
  category: string
  memberPrice?: number
}

// ============================================
// COMPLETE PRODUCT CATALOG - ALL 50 PRODUCTS
// ============================================

const COMPLETE_CATALOG: ProductData[] = [
  // ==========================================
  // CE MEMBERSHIPS (6 products)
  // ==========================================
  {
    name: '1-Year CE Membership',
    description: 'Access to ALL Professional Development & CEU Courses. Includes 31+ CE credit hours with 12-month access. Perfect for annual CE requirement completion.',
    price: 199.00,
    billingPeriod: 'year', // RECURRING
    metadata: {
      product_id: 'ce_membership_1y',
      product_type: 'membership',
      payment_type: 'recurring',
      membership_type: 'ce_1y',
      access_duration_months: '12',
      ce_hours_included: '31',
    },
    category: 'CE Membership',
  },
  {
    name: '2-Year CE Membership',
    description: 'Access to ALL Professional Development & CEU Courses for 24 months. Includes all CE courses plus $100 discount on So What Mindset and Leap & Launch programs. One-time payment.',
    price: 299.00,
    billingPeriod: null, // ONE-TIME
    metadata: {
      product_id: 'ce_membership_2y',
      product_type: 'membership',
      payment_type: 'one_time',
      membership_type: 'ce_2y',
      access_duration_months: '24',
      sowhat_discount: '100',
      leap_discount: '100',
    },
    category: 'CE Membership',
  },
  {
    name: '5-Year CE Membership',
    description: 'Complete Professional & Personal Development Access. ALL CE courses (200+ credit hours when fully developed) plus ALL Personal Development courses for 60 months. Includes $100 discounts on premium programs. One-time payment.',
    price: 699.00,
    billingPeriod: null, // ONE-TIME
    metadata: {
      product_id: 'ce_membership_5y',
      product_type: 'membership',
      payment_type: 'one_time',
      membership_type: 'ce_5y',
      access_duration_months: '60',
      includes_personal_dev: 'true',
      ce_hours_projected: '200',
      sowhat_discount: '100',
      leap_discount: '100',
    },
    category: 'CE Membership',
  },
  {
    name: '1-Year Personal Development Membership',
    description: 'Access to all personal development courses (excludes So What Mindset & Leap & Launch). Includes 6-month download access per course during 12-month membership period.',
    price: 299.00,
    billingPeriod: 'year', // RECURRING
    metadata: {
      product_id: 'personal_dev_1y',
      product_type: 'membership',
      payment_type: 'recurring',
      membership_type: 'pd_1y',
      access_duration_months: '12',
      download_access_months: '6',
    },
    category: 'Personal Development Membership',
  },
  {
    name: '2-Year Personal Development Membership',
    description: 'Access to all personal development courses for 24 months with 6-month download access per course. Includes $100 discount on So What Mindset and Leap & Launch. One-time payment.',
    price: 399.00,
    billingPeriod: null, // ONE-TIME
    metadata: {
      product_id: 'personal_dev_2y',
      product_type: 'membership',
      payment_type: 'one_time',
      membership_type: 'pd_2y',
      access_duration_months: '24',
      sowhat_discount: '100',
      leap_discount: '100',
    },
    category: 'Personal Development Membership',
  },
  {
    name: '5-Year Personal Development Membership',
    description: 'Access to all personal development courses for 60 months with 6-month download access per course. Includes $100 discounts on So What Mindset and Leap & Launch. One-time payment.',
    price: 699.00,
    billingPeriod: null, // ONE-TIME
    metadata: {
      product_id: 'personal_dev_5y',
      product_type: 'membership',
      payment_type: 'one_time',
      membership_type: 'pd_5y',
      access_duration_months: '60',
      sowhat_discount: '100',
      leap_discount: '100',
    },
    category: 'Personal Development Membership',
  },

  // ==========================================
  // CURRENT CE COURSES (8 products)
  // ==========================================
  {
    name: 'Building a Trauma-Informed Practice & Telehealth',
    description: '6 CE Hours - Comprehensive training on trauma-informed practices and telehealth delivery for Texas LPCs. Includes Texas state board-approved continuing education certificate.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_trauma_telehealth',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'professional_development',
    },
    category: 'CE Course',
  },
  {
    name: 'Cultural Diversity in Texas Counseling Practice',
    description: '3 CE Hours - Essential training on cultural competency and diversity in Texas counseling practice. Texas LPC board-approved.',
    price: 29.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_cultural_diversity',
      product_type: 'course',
      ce_hours: '3',
      course_category: 'professional_development',
    },
    category: 'CE Course',
  },
  {
    name: 'Ethics for Professional Counselors',
    description: '6 CE Hours - Comprehensive ethics training covering professional conduct, boundaries, and ethical decision-making for counselors.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_ethics',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'professional_development',
    },
    category: 'CE Course',
  },
  {
    name: 'Regulating the Storm: Trauma, Anger, and the Brain',
    description: '6 CE Hours - Neuroscience-based approach to understanding and treating trauma, anger regulation, and emotional dysregulation.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_regulating_storm',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'trauma_specialization',
    },
    category: 'CE Course',
  },
  {
    name: 'Risk Management in Counseling',
    description: '2 CE Hours - Essential risk management strategies for protecting your practice and maintaining professional standards.',
    price: 19.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_risk_management',
      product_type: 'course',
      ce_hours: '2',
      course_category: 'professional_development',
    },
    category: 'CE Course',
  },
  {
    name: 'Telehealth in Counseling',
    description: '3 CE Hours - Practical training on delivering effective telehealth services, including technology, ethics, and clinical considerations.',
    price: 29.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_telehealth',
      product_type: 'course',
      ce_hours: '3',
      course_category: 'professional_development',
    },
    category: 'CE Course',
  },
  {
    name: 'Business Ethics for Mental Health Professionals',
    description: '2 CE Hours - Ethical considerations in private practice, marketing, billing, and business relationships in mental health.',
    price: 19.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_business_ethics',
      product_type: 'course',
      ce_hours: '2',
      course_category: 'professional_development',
    },
    category: 'CE Course',
  },
  {
    name: 'Suicide Risk Assessment and Prevention',
    description: '3 CE Hours - Critical training on suicide risk assessment, safety planning, and evidence-based prevention strategies.',
    price: 29.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_suicide_prevention',
      product_type: 'course',
      ce_hours: '3',
      course_category: 'crisis_intervention',
    },
    category: 'CE Course',
  },

  // ==========================================
  // EXPANDED CE COURSES (34 products)
  // ==========================================
  
  // Foundation Courses
  {
    name: 'Advanced Ethics in Digital Age Counseling',
    description: '4 CE Hours - Navigate ethical challenges in digital counseling, social media boundaries, and technology-related ethical dilemmas.',
    price: 39.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_advanced_ethics_digital',
      product_type: 'course',
      ce_hours: '4',
      course_category: 'foundation',
    },
    category: 'CE Course',
  },
  {
    name: 'Legal Issues and Documentation for Counselors',
    description: '4 CE Hours - Essential legal knowledge and documentation standards for professional counselors in clinical practice.',
    price: 39.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_legal_documentation',
      product_type: 'course',
      ce_hours: '4',
      course_category: 'foundation',
    },
    category: 'CE Course',
  },

  // Trauma Specialization
  {
    name: 'Complex PTSD and Developmental Trauma',
    description: '8 CE Hours - Advanced training on complex trauma, developmental impacts, and specialized treatment approaches for long-term trauma survivors.',
    price: 79.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_complex_ptsd',
      product_type: 'course',
      ce_hours: '8',
      course_category: 'trauma_specialization',
    },
    category: 'CE Course',
  },
  {
    name: 'EMDR Level 1 Training',
    description: '15 CE Hours - Comprehensive introduction to Eye Movement Desensitization and Reprocessing therapy. Foundational training in EMDR protocols and techniques.',
    price: 149.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_emdr_level1',
      product_type: 'course',
      ce_hours: '15',
      course_category: 'trauma_specialization',
    },
    category: 'CE Course',
  },
  {
    name: 'Somatic Approaches to Trauma Recovery',
    description: '6 CE Hours - Body-centered trauma treatment approaches including somatic experiencing, sensorimotor psychotherapy, and trauma-sensitive yoga.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_somatic_trauma',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'trauma_specialization',
    },
    category: 'CE Course',
  },

  // Substance Abuse
  {
    name: 'Addiction Counseling Fundamentals',
    description: '8 CE Hours - Comprehensive foundation in addiction assessment, treatment planning, and evidence-based interventions for substance use disorders.',
    price: 79.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_addiction_fundamentals',
      product_type: 'course',
      ce_hours: '8',
      course_category: 'substance_abuse',
    },
    category: 'CE Course',
  },
  {
    name: 'Co-Occurring Disorders: Mental Health and Substance Use',
    description: '6 CE Hours - Integrated treatment approaches for clients with dual diagnosis of mental health and substance use disorders.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_cooccurring_disorders',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'substance_abuse',
    },
    category: 'CE Course',
  },
  {
    name: 'Motivational Interviewing for Addiction Recovery',
    description: '6 CE Hours - Master motivational interviewing techniques specifically applied to substance abuse treatment and recovery support.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_motivational_interviewing',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'substance_abuse',
    },
    category: 'CE Course',
  },

  // Family & Couples
  {
    name: 'Gottman Method Couples Therapy Level 1',
    description: '12 CE Hours - Introduction to Gottman Method including Sound Relationship House, Four Horsemen, and assessment tools for couples therapy.',
    price: 119.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_gottman_level1',
      product_type: 'course',
      ce_hours: '12',
      course_category: 'family_couples',
    },
    category: 'CE Course',
  },
  {
    name: 'Family Systems and Structural Family Therapy',
    description: '8 CE Hours - Core family therapy theories including Bowen, Minuchin, and structural family therapy techniques.',
    price: 79.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_family_systems',
      product_type: 'course',
      ce_hours: '8',
      course_category: 'family_couples',
    },
    category: 'CE Course',
  },

  // Child & Adolescent
  {
    name: 'Play Therapy Fundamentals',
    description: '12 CE Hours - Essential play therapy techniques, child development, and therapeutic play interventions for working with children.',
    price: 119.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_play_therapy',
      product_type: 'course',
      ce_hours: '12',
      course_category: 'child_adolescent',
    },
    category: 'CE Course',
  },
  {
    name: 'Adolescent Depression and Anxiety Treatment',
    description: '8 CE Hours - Evidence-based interventions for teen depression and anxiety including CBT, DBT, and family involvement strategies.',
    price: 79.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_adolescent_depression',
      product_type: 'course',
      ce_hours: '8',
      course_category: 'child_adolescent',
    },
    category: 'CE Course',
  },

  // Crisis Intervention
  {
    name: 'Crisis Intervention and De-escalation Techniques',
    description: '6 CE Hours - Practical skills for managing crisis situations, de-escalation strategies, and safety planning.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_crisis_intervention',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'crisis_intervention',
    },
    category: 'CE Course',
  },
  {
    name: 'Working with Military Veterans and PTSD',
    description: '6 CE Hours - Specialized training on military culture, combat trauma, and evidence-based PTSD treatments for veteran populations.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_veterans_ptsd',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'crisis_intervention',
    },
    category: 'CE Course',
  },
  {
    name: 'Grief and Bereavement Counseling',
    description: '8 CE Hours - Comprehensive grief therapy training including complicated grief, loss types, and therapeutic interventions.',
    price: 79.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_grief_bereavement',
      product_type: 'course',
      ce_hours: '8',
      course_category: 'crisis_intervention',
    },
    category: 'CE Course',
  },

  // Clinical Supervision
  {
    name: 'Clinical Supervision Skills for New Supervisors',
    description: '12 CE Hours - Essential supervision models, ethical responsibilities, and practical skills for new clinical supervisors.',
    price: 119.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_clinical_supervision',
      product_type: 'course',
      ce_hours: '12',
      course_category: 'supervision',
    },
    category: 'CE Course',
  },
  {
    name: 'Leadership in Mental Health Organizations',
    description: '8 CE Hours - Leadership development for mental health professionals including team management, organizational dynamics, and strategic planning.',
    price: 79.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_leadership',
      product_type: 'course',
      ce_hours: '8',
      course_category: 'supervision',
    },
    category: 'CE Course',
  },

  // Practice Development
  {
    name: 'Advanced Private Practice Management',
    description: '8 CE Hours - Business strategies for growing and managing a successful private practice including marketing, billing, and practice operations.',
    price: 79.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_practice_management',
      product_type: 'course',
      ce_hours: '8',
      course_category: 'practice_development',
    },
    category: 'CE Course',
  },
  {
    name: 'Group Therapy Facilitation and Development',
    description: '6 CE Hours - Group therapy skills including group dynamics, screening, facilitation techniques, and therapeutic factors.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_group_therapy',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'practice_development',
    },
    category: 'CE Course',
  },
  {
    name: 'Integrative and Holistic Treatment Approaches',
    description: '6 CE Hours - Integrating complementary approaches including mindfulness, nutrition, movement, and alternative therapies into clinical practice.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_integrative_holistic',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'practice_development',
    },
    category: 'CE Course',
  },

  // Electives
  {
    name: 'Mindfulness-Based Interventions in Therapy',
    description: '6 CE Hours - Evidence-based mindfulness techniques for clinical practice including MBSR, MBCT, and practical applications.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_mindfulness',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'electives',
    },
    category: 'CE Course',
  },
  {
    name: 'Neurofeedback and Brain-Based Therapies',
    description: '6 CE Hours - Introduction to neurofeedback, biofeedback, and neuroscience-informed treatment approaches.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_neurofeedback',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'electives',
    },
    category: 'CE Course',
  },
  {
    name: 'Art and Expressive Therapies Techniques',
    description: '4 CE Hours - Creative therapeutic interventions using art, music, movement, and drama therapy techniques.',
    price: 39.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_expressive_therapies',
      product_type: 'course',
      ce_hours: '4',
      course_category: 'electives',
    },
    category: 'CE Course',
  },
  {
    name: 'Working with LGBTQ+ Clients',
    description: '4 CE Hours - Culturally competent care for LGBTQ+ populations including identity development, minority stress, and affirmative therapy.',
    price: 39.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_lgbtq',
      product_type: 'course',
      ce_hours: '4',
      course_category: 'electives',
    },
    category: 'CE Course',
  },
  {
    name: 'Eating Disorders Assessment and Treatment',
    description: '6 CE Hours - Comprehensive training on eating disorder types, assessment tools, and evidence-based treatment approaches.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_eating_disorders',
      product_type: 'course',
      ce_hours: '6',
      course_category: 'electives',
    },
    category: 'CE Course',
  },
  {
    name: 'Chronic Pain and Medical Psychology',
    description: '4 CE Hours - Psychological interventions for chronic pain management, health psychology, and mind-body connection.',
    price: 39.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_chronic_pain',
      product_type: 'course',
      ce_hours: '4',
      course_category: 'electives',
    },
    category: 'CE Course',
  },
  {
    name: 'Digital Mental Health Tools and Apps',
    description: '3 CE Hours - Overview of digital mental health tools, therapeutic apps, and technology integration in clinical practice.',
    price: 29.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_digital_tools',
      product_type: 'course',
      ce_hours: '3',
      course_category: 'electives',
    },
    category: 'CE Course',
  },
  {
    name: 'Cultural Competency: Specific Populations',
    description: '3 CE Hours - Cultural considerations for working with diverse populations including racial, ethnic, and religious minorities.',
    price: 29.99,
    billingPeriod: null,
    metadata: {
      product_id: 'ce_cultural_populations',
      product_type: 'course',
      ce_hours: '3',
      course_category: 'electives',
    },
    category: 'CE Course',
  },

  // ==========================================
  // PERSONAL DEVELOPMENT COURSES (6 products)
  // ==========================================
  {
    name: 'Healing Forward - Relationship Recovery and Personal Reclamation',
    description: 'Relationship Recovery and Personal Reclamation. A comprehensive self-guided program for healing after relationship trauma. 6-month access with downloadable resources. Repurchase available at 50% discount.',
    price: 199.00,
    billingPeriod: null,
    metadata: {
      product_id: 'pd_healing_forward',
      product_type: 'personal_development',
      access_duration_months: '6',
      repurchase_discount_percent: '50',
      course_category: 'personal_development',
    },
    category: 'Personal Development',
  },
  {
    name: 'Rebuilding After Betrayal',
    description: 'Structured 4-Phase Recovery Framework for healing after infidelity and betrayal. Comprehensive program with expert guidance and practical exercises. 6-month access. Repurchase available at 50% discount.',
    price: 249.00,
    billingPeriod: null,
    metadata: {
      product_id: 'pd_rebuilding_betrayal',
      product_type: 'personal_development',
      access_duration_months: '6',
      repurchase_discount_percent: '50',
      course_category: 'personal_development',
    },
    category: 'Personal Development',
  },
  {
    name: 'Finding the Perfect Match - A Self-Guided Journey to Authentic Love',
    description: 'A Self-Guided Journey to Authentic Love. Learn to identify compatible partners, understand relationship patterns, and build healthy relationships. 6-month access. Repurchase available at 50% discount.',
    price: 179.00,
    billingPeriod: null,
    metadata: {
      product_id: 'pd_perfect_match',
      product_type: 'personal_development',
      access_duration_months: '6',
      repurchase_discount_percent: '50',
      course_category: 'personal_development',
    },
    category: 'Personal Development',
  },
  {
    name: "Cancer Diagnosis: It's Not the End... It's Just the Beginning!",
    description: 'Emotional and practical guidance for navigating a cancer diagnosis with resilience and hope. Support for patients and families. 6-month access. Repurchase available at 50% discount.',
    price: 149.00,
    billingPeriod: null,
    metadata: {
      product_id: 'pd_cancer_recovery',
      product_type: 'personal_development',
      access_duration_months: '6',
      repurchase_discount_percent: '50',
      course_category: 'personal_development',
    },
    category: 'Personal Development',
  },
  {
    name: 'Credit Building & Debt Management',
    description: 'Practical strategies for building credit, managing debt, and achieving financial stability. Step-by-step action plans and resources. 6-month access. Repurchase available at 50% discount.',
    price: 99.00,
    billingPeriod: null,
    metadata: {
      product_id: 'pd_credit_debt',
      product_type: 'personal_development',
      access_duration_months: '6',
      repurchase_discount_percent: '50',
      course_category: 'personal_development',
    },
    category: 'Personal Development',
  },
  {
    name: 'Financial Literacy & Independence',
    description: 'Comprehensive financial education covering budgeting, investing, and building long-term financial independence. Practical tools and templates included. 6-month access. Repurchase available at 50% discount.',
    price: 129.00,
    billingPeriod: null,
    metadata: {
      product_id: 'pd_financial_literacy',
      product_type: 'personal_development',
      access_duration_months: '6',
      repurchase_discount_percent: '50',
      course_category: 'personal_development',
    },
    category: 'Personal Development',
  },

  // ==========================================
  // PREMIUM STANDALONE PROGRAMS (2 products)
  // ==========================================
  {
    name: 'The So What Mindset',
    description: 'Transformational Thinking and Resilience Training. Premium flagship program teaching powerful mindset shifts for overcoming obstacles and achieving breakthrough results. 6-month access. Not included in memberships. Members save $100.',
    price: 499.00,
    billingPeriod: null,
    memberPrice: 399.00,
    metadata: {
      product_id: 'premium_sowhat_mindset',
      product_type: 'premium_program',
      access_duration_months: '6',
      member_discount_amount: '100',
      course_category: 'premium_standalone',
      member_price: '399',
    },
    category: 'Premium Program',
  },
  {
    name: 'Leap & Launch!',
    description: 'Flagship Business Development Program for mental health professionals launching or growing their private practice. Comprehensive business training covering marketing, operations, and growth strategies. 6-month access. Not included in memberships. Members save $100.',
    price: 299.00,
    billingPeriod: null,
    memberPrice: 199.00,
    metadata: {
      product_id: 'premium_leap_launch',
      product_type: 'premium_program',
      access_duration_months: '6',
      member_discount_amount: '100',
      course_category: 'premium_standalone',
      member_price: '199',
    },
    category: 'Premium Program',
  },
]

// ============================================
// UPLOAD FUNCTION
// ============================================

async function uploadAllProducts() {
  console.log('🧠 ==========================================')
  console.log('🧠 TheraBrake Academy - LIVE Stripe Upload')
  console.log('🧠 ALL 50 PRODUCTS')
  console.log('🧠 ==========================================\n')

  // Verify we're using LIVE key
  const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 8)
  if (!keyPrefix?.includes('live')) {
    console.error('⚠️  WARNING: Not using LIVE Stripe key!')
    console.error('   Current key starts with:', keyPrefix)
    console.error('   Please set STRIPE_SECRET_KEY to your LIVE key in .env.local')
    process.exit(1)
  }

  console.log('✅ Confirmed: Using LIVE Stripe key')
  console.log(`📊 Total products to create: ${COMPLETE_CATALOG.length}\n`)

  const results = {
    created: [] as string[],
    failed: [] as { name: string; error: string }[],
    priceIds: {} as Record<string, string>,
  }

  for (const [index, product] of COMPLETE_CATALOG.entries()) {
    try {
      console.log(`[${index + 1}/${COMPLETE_CATALOG.length}] Creating: ${product.name}...`)

      // Create product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: product.metadata,
      })

      console.log(`   ✅ Product: ${stripeProduct.id}`)

      // Create price
      const priceData: Stripe.PriceCreateParams = {
        product: stripeProduct.id,
        currency: 'usd',
        unit_amount: Math.round(product.price * 100),
      }

      if (product.billingPeriod) {
        priceData.recurring = {
          interval: product.billingPeriod,
          interval_count: 1,
        }
      }

      const price = await stripe.prices.create(priceData)
      console.log(`   ✅ Price: ${price.id}`)

      results.priceIds[product.metadata.product_id] = price.id

      // Create member discount price if applicable
      if (product.memberPrice) {
        const memberPrice = await stripe.prices.create({
          product: stripeProduct.id,
          currency: 'usd',
          unit_amount: Math.round(product.memberPrice * 100),
          metadata: {
            price_type: 'member_discount',
            requires_membership: 'true',
            original_price: product.price.toString(),
          },
        })
        console.log(`   ✅ Member Price: ${memberPrice.id}`)
        results.priceIds[`${product.metadata.product_id}_member`] = memberPrice.id
      }

      results.created.push(product.name)
      console.log(`   ✨ Complete!\n`)

      // Small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error: any) {
      console.log(`   ❌ Failed: ${error.message}\n`)
      results.failed.push({
        name: product.name,
        error: error.message,
      })
    }
  }

  // Print summary
  console.log('\n🎉 ==========================================')
  console.log('🎉 Upload Complete!')
  console.log('🎉 ==========================================\n')
  console.log(`✅ Successfully created: ${results.created.length}`)
  console.log(`❌ Failed: ${results.failed.length}\n`)

  if (results.failed.length > 0) {
    console.log('❌ Failed products:')
    results.failed.forEach((f) => {
      console.log(`  - ${f.name}: ${f.error}`)
    })
    console.log('')
  }

  // Export price IDs
  console.log('📋 Price IDs for .env.local:')
  console.log('==========================================\n')

  const fs = require('fs')
  const envContent = Object.entries(results.priceIds)
    .map(([key, value]) => {
      const envVar = `STRIPE_PRICE_${key.toUpperCase()}`
      console.log(`${envVar}=${value}`)
      return `${envVar}=${value}`
    })
    .join('\n')

  fs.writeFileSync('.env.stripe.live', envContent)
  console.log('\n✅ Price IDs saved to .env.stripe.live')
  console.log('   Copy these to your .env.local file\n')

  // Summary
  console.log('📊 Product Breakdown:')
  console.log('   - Memberships: 6')
  console.log('   - CE Courses: 42')
  console.log('   - Personal Development: 6')
  console.log('   - Premium Programs: 2')
  console.log(`   - Total: ${COMPLETE_CATALOG.length}\n`)
}

// Run
uploadAllProducts()
  .then(() => {
    console.log('🎊 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
