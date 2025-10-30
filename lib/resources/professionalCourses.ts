export type ProfessionalCourse = {
  id: string
  title: string
  hours: number
  price: number
  shortDescription: string
  fullDescription: string
  category?: string
}

export const currentCECourses: ProfessionalCourse[] = [
  {
    id: 'trauma-informed-telehealth',
    title: 'Building a Trauma-Informed Practice & Telehealth in Counseling',
    hours: 6,
    price: 59.99,
    shortDescription: 'Transform Your Practice for the Modern Era',
    fullDescription:
      `In today's rapidly evolving mental health landscape, understanding trauma's pervasive impact while mastering digital delivery methods isn't optional—it's essential. This comprehensive course equips you with the dual expertise needed to serve clients effectively in both traditional and virtual settings. You'll learn evidence-based trauma-informed approaches that recognize how trauma affects the brain, behavior, and healing process, while simultaneously mastering the technical and ethical considerations of telehealth delivery. Perfect for counselors who want to expand their reach, improve client outcomes, and build a practice that meets clients where they are—physically and emotionally. Leave with practical frameworks, assessment tools, and the confidence to serve trauma survivors through any modality.`,
  },
  {
    id: 'cultural-diversity',
    title: 'Cultural Diversity in Texas Counseling Practice',
    hours: 3,
    price: 29.99,
    shortDescription: 'Serve Every Texan with Cultural Competence and Confidence',
    fullDescription:
      `Texas's rich cultural tapestry demands counselors who can bridge differences with skill and sensitivity. This course goes beyond surface-level diversity training to explore the unique cultural dynamics of Texas communities—from border towns to urban centers, rural communities to suburban sprawl. You'll examine how culture shapes mental health perspectives, help-seeking behaviors, and therapeutic relationships. Through case studies specific to Texas populations, you'll develop practical strategies for working with Hispanic/Latino families, recent immigrants, military communities, and other diverse groups. Essential for any counselor serious about reducing disparities and providing culturally responsive care in the Lone Star State.`,
  },
  {
    id: 'ethics-counselors',
    title: 'Ethics for Professional Counselors',
    hours: 6,
    price: 59.99,
    shortDescription: 'Navigate Complex Ethical Challenges with Clarity and Confidence',
    fullDescription:
      `Ethical dilemmas don't announce themselves—they emerge in the gray areas of practice where textbook answers fall short. This comprehensive course prepares you for the real-world ethical challenges you'll face, from boundary issues in small communities to social media complications in the digital age. Using Texas-specific case law and LPC board decisions, you'll develop a robust ethical decision-making framework that protects both you and your clients. We'll tackle the tough topics: dual relationships, mandatory reporting complexities, confidentiality in the age of electronic records, and ethical considerations in integrated care settings. More than just meeting continuing education requirements, this course strengthens your professional foundation and helps you sleep better at night.`,
  },
  {
    id: 'regulating-storm',
    title: 'Regulating the Storm: Trauma, Anger, and the Brain',
    hours: 6,
    price: 59.99,
    shortDescription: 'Master the Neuroscience of Emotional Dysregulation',
    fullDescription:
      `When trauma hijacks the brain's alarm system, anger becomes a survival response stuck on repeat. This cutting-edge course reveals the neurobiological connections between trauma and anger, transforming how you understand and treat emotional dysregulation. You'll explore how adverse experiences reshape neural pathways, why traditional anger management often fails trauma survivors, and how to implement brain-based interventions that actually work. Through interactive learning and case applications, you'll gain practical tools for helping clients move from reactive rage to responsive regulation. Ideal for counselors working with veterans, abuse survivors, or anyone struggling with the anger-trauma connection.`,
  },
  {
    id: 'risk-management',
    title: 'Risk Management in Counseling',
    hours: 2,
    price: 19.99,
    shortDescription: 'Protect Your Practice, Serve with Peace of Mind',
    fullDescription:
      `One lawsuit can end a career. This essential course teaches you how to identify and mitigate the hidden risks in counseling practice before they become crises. Learn from real Texas malpractice cases, board complaints, and near-misses as we explore documentation best practices, informed consent updates, and crisis intervention protocols. You'll develop systems for managing high-risk situations including suicidal ideation, duty to warn scenarios, and custody disputes. Compact yet comprehensive, this course provides the risk management strategies every counselor needs but hopes never to use.`,
  },
  {
    id: 'telehealth',
    title: 'Telehealth in Counseling',
    hours: 3,
    price: 29.99,
    shortDescription: 'Build a Thriving Virtual Practice That Connects and Heals',
    fullDescription:
      `Telehealth isn't just video calls—it's a fundamental shift in how mental health care is delivered. This practical course prepares you to excel in virtual counseling, covering everything from HIPAA-compliant platform selection to creating therapeutic presence through a screen. Learn how to conduct assessments remotely, manage technical disruptions therapeutically, and maintain boundaries in the digital space. We'll address Texas-specific licensing requirements, interstate practice considerations, and ethical guidelines for online therapy. Whether you're telehealth-curious or looking to optimize your existing virtual practice, gain the skills to serve clients effectively across any distance.`,
  },
  {
    id: 'business-ethics',
    title: 'Business Ethics for Mental Health Professionals',
    hours: 2,
    price: 19.99,
    shortDescription: 'Where Clinical Ethics Meets Business Reality',
    fullDescription:
      `Running an ethical practice requires more than clinical integrity—it demands business ethics that align with your therapeutic values. This focused course addresses the unique ethical challenges of practice management: fee structures that promote access, ethical marketing that maintains professional dignity, and insurance practices that serve client needs. Learn to navigate the tension between financial sustainability and clinical ethics, manage multiple relationships in small communities, and create policies that reflect your professional values. Essential for private practitioners and anyone involved in the business side of mental health services.`,
  },
  {
    id: 'suicide-prevention',
    title: 'Suicide Risk Assessment and Prevention',
    hours: 3,
    price: 29.99,
    shortDescription: 'Recognize, Assess, and Respond to Suicidal Ideation',
    fullDescription:
      `Master the critical skills of suicide risk assessment using evidence-based tools and protocols. Learn to identify warning signs, conduct thorough risk assessments, and develop safety plans that save lives. This course covers Texas legal requirements, documentation standards, and post-intervention follow-up strategies. You'll practice using validated assessment instruments, explore the difference between chronic and acute risk factors, and develop confidence in managing suicidal ideation across diverse populations. Essential training for every mental health professional who wants to be prepared for life-or-death moments in practice.`,
  },
]

export const expandedCECourses: ProfessionalCourse[] = [
  // Foundation Courses
  {
    id: 'advanced-ethics-digital',
    title: 'Advanced Ethics in Digital Age Counseling',
    hours: 4,
    price: 39.99,
    category: 'Foundation Courses',
    shortDescription: 'Navigate the Uncharted Territory of Digital Mental Health',
    fullDescription:
      `Technology is reshaping therapy faster than ethics boards can write guidelines. This advanced course tackles the emerging ethical challenges of digital mental health: AI-assisted therapy tools, social media boundary complexities, cybersecurity in private practice, and the ethics of mental health apps. You'll examine case studies involving online therapy platforms, digital record keeping, and virtual reality interventions while developing frameworks for ethical decision-making in rapidly evolving technological landscapes. Perfect for forward-thinking counselors who want to embrace innovation while maintaining the highest ethical standards.`,
  },
  {
    id: 'legal-issues',
    title: 'Legal Issues and Documentation for Counselors',
    hours: 4,
    price: 39.99,
    category: 'Foundation Courses',
    shortDescription: 'Master the Law to Protect Your Practice and Your Clients',
    fullDescription:
      `Ignorance of legal requirements isn't just risky—it's potentially career-ending. This comprehensive course demystifies the complex legal landscape surrounding counseling practice, from Texas state regulations to federal privacy laws. Learn the documentation standards that protect you in court, understand your rights and obligations in subpoena situations, and master the legal nuances of working with minors, couples, and families. We'll cover recent legal developments affecting mental health practice, including changes to HIPAA, mandatory reporting requirements, and duty to warn obligations. Essential knowledge for confident, legally compliant practice.`,
  },

  // Trauma Specialization Track
  {
    id: 'complex-ptsd',
    title: 'Complex PTSD and Developmental Trauma',
    hours: 8,
    price: 79.99,
    category: 'Trauma Specialization Track',
    shortDescription: 'Beyond Traditional PTSD: Treating the Wounds That Shape Us',
    fullDescription:
      `When trauma occurs early, repeatedly, or in relationships, it creates complex wounds that traditional PTSD treatments can't fully address. This specialized course explores Complex PTSD and developmental trauma, teaching you to recognize the unique presentations of relational trauma and early childhood adversity. You'll learn phase-oriented treatment approaches, understand how attachment disruption affects brain development, and master interventions for emotional dysregulation, identity disturbance, and interpersonal difficulties. Through case studies and practical applications, gain the skills to help clients heal from the deepest wounds while avoiding re-traumatization in treatment.`,
  },
  {
    id: 'emdr-level1',
    title: 'EMDR Level 1 Training',
    hours: 15,
    price: 149.99,
    category: 'Trauma Specialization Track',
    shortDescription: 'Evidence-Based Trauma Treatment That Transforms Lives',
    fullDescription:
      `Eye Movement Desensitization and Reprocessing (EMDR) is one of the most researched and effective trauma treatments available. This comprehensive Level 1 training provides the foundation for EMDR practice, covering the eight-phase protocol, bilateral stimulation techniques, and the Adaptive Information Processing model. You'll learn to conduct EMDR safely and effectively with single-incident trauma, understand contraindications and precautions, and develop skills in resource installation and stabilization. With supervised practice opportunities and detailed protocols, this course prepares you to integrate EMDR into your trauma treatment toolkit while maintaining the highest standards of client safety.`,
  },
  {
    id: 'somatic-approaches',
    title: "Somatic Approaches to Trauma Recovery",
    hours: 6,
    price: 59.99,
    category: 'Trauma Specialization Track',
    shortDescription: "Healing Trauma Through the Body's Wisdom",
    fullDescription:
      `Trauma lives in the body, and lasting healing requires addressing its somatic impact. This innovative course introduces you to body-based trauma interventions that help clients regulate their nervous systems and reclaim their physical sense of safety. Learn the fundamentals of polyvagal theory, practice grounding and resourcing techniques, and understand how to integrate somatic awareness into traditional talk therapy. You'll explore breathwork, movement, and mindfulness techniques specifically designed for trauma survivors, while learning to recognize and respond to trauma activation in session. Perfect for counselors who want to expand beyond cognitive approaches to include the body's innate healing wisdom.`,
  },

  // Substance Abuse and Addiction Track
  {
    id: 'addiction-fundamentals',
    title: 'Addiction Counseling Fundamentals',
    hours: 8,
    price: 79.99,
    category: 'Substance Abuse and Addiction Track',
    shortDescription: 'Build Expertise in the Disease That Touches Every Practice',
    fullDescription:
      `Addiction doesn't discriminate, and every mental health professional will encounter clients struggling with substance use. This comprehensive course provides the foundation for understanding and treating addiction across all substances and behaviors. Learn the neurobiology of addiction, master motivational interviewing techniques, and understand the stages of change model. You'll explore evidence-based treatment approaches, family involvement strategies, and the integration of addiction treatment with mental health care. With practical tools for assessment, intervention, and relapse prevention, gain the confidence to address addiction effectively in any practice setting.`,
  },
  {
    id: 'co-occurring',
    title: 'Co-Occurring Disorders: Mental Health and Substance Use',
    hours: 6,
    price: 59.99,
    category: 'Substance Abuse and Addiction Track',
    shortDescription: 'Treat the Whole Person, Not Just the Symptoms',
    fullDescription:
      `When mental illness and addiction collide, traditional treatment approaches often fall short. This specialized course teaches integrated treatment approaches for co-occurring disorders, helping you understand the complex interplay between substance use and mental health conditions. Learn to assess which came first, develop treatment plans that address both conditions simultaneously, and navigate the challenges of medication management in active addiction. You'll explore specific protocols for common combinations like depression and alcoholism, anxiety and prescription drug abuse, and PTSD and substance use, gaining the skills to provide comprehensive, effective care.`,
  },
  {
    id: 'motivational-interviewing',
    title: 'Motivational Interviewing for Addiction Recovery',
    hours: 6,
    price: 59.99,
    category: 'Substance Abuse and Addiction Track',
    shortDescription: 'Master the Art of Change Conversation',
    fullDescription:
      `Change is hard, and confrontation rarely works. Motivational Interviewing (MI) offers a collaborative, client-centered approach that helps people find their own motivation for change. This practical course teaches the core MI skills: reflective listening, rolling with resistance, and enhancing motivation for change. You'll learn to identify and respond to change talk, manage ambivalence effectively, and guide clients toward their own decisions about recovery. Through role-play exercises and real-world applications, develop the MI skills that make the difference between clients who engage in treatment and those who walk away.`,
  },

  // Family and Couples Therapy Track
  {
    id: 'gottman-method',
    title: 'Gottman Method Couples Therapy Level 1',
    hours: 12,
    price: 119.99,
    category: 'Family and Couples Therapy Track',
    shortDescription: 'Transform Relationships with Science-Based Interventions',
    fullDescription:
      `The Gottman Method is the most researched approach to couples therapy, with over 40 years of data on what makes relationships succeed or fail. This comprehensive Level 1 training teaches the foundational concepts of Gottman Method therapy, including the Four Horsemen, the Sound Relationship House, and evidence-based assessment tools. Learn to conduct comprehensive relationship assessments, identify patterns that predict divorce, and implement interventions that build connection and intimacy. You'll master techniques for managing conflict, enhancing friendship, and creating shared meaning in relationships. Essential training for any counselor working with couples who wants to use proven methods that actually work.`,
  },
  {
    id: 'family-systems',
    title: 'Family Systems and Structural Family Therapy',
    hours: 8,
    price: 79.99,
    category: 'Family and Couples Therapy Track',
    shortDescription: 'Understand and Transform Family Dynamics',
    fullDescription:
      `Families are complex systems where individual symptoms often reflect larger relational patterns. This course introduces you to family systems theory and structural family therapy techniques that help you see beyond the identified patient to understand family dynamics. Learn to map family structures, identify boundaries and hierarchies, and implement interventions that create lasting systemic change. You'll practice joining techniques, explore the role of family life cycle stages, and understand how cultural factors influence family functioning. Perfect for counselors who want to expand beyond individual therapy to work with families as whole systems.`,
  },

  // Child and Adolescent Specialization Track
  {
    id: 'play-therapy',
    title: 'Play Therapy Fundamentals',
    hours: 12,
    price: 119.99,
    category: 'Child and Adolescent Specialization Track',
    shortDescription: 'Speak the Language Children Understand',
    fullDescription:
      `Children process the world through play, making traditional talk therapy ineffective for most young clients. This comprehensive course introduces the fundamentals of play therapy, teaching you to use play as both assessment and intervention tool. Learn the theoretical foundations of child-centered play therapy, master basic play therapy skills, and understand how to create therapeutic environments that facilitate healing. You'll explore toys and materials selection, limit-setting in the playroom, and techniques for involving parents in the therapeutic process. With hands-on practice and case studies, gain the skills to help children work through trauma, anxiety, and behavioral issues through their natural language of play.`,
  },
  {
    id: 'adolescent-treatment',
    title: 'Adolescent Depression and Anxiety Treatment',
    hours: 8,
    price: 79.99,
    category: 'Child and Adolescent Specialization Track',
    shortDescription: 'Navigate the Unique Challenges of Teenage Mental Health',
    fullDescription:
      `Adolescence is a time of tremendous physical, emotional, and social change, making teens particularly vulnerable to depression and anxiety. This specialized course teaches evidence-based approaches specifically designed for adolescent clients, including Cognitive Behavioral Therapy for teens, family involvement strategies, and crisis intervention techniques. Learn to assess suicide risk in adolescents, understand the role of social media and peer pressure, and navigate confidentiality issues with minor clients. You'll explore how brain development affects teenage decision-making and emotional regulation, gaining the tools to connect with adolescent clients and help them develop healthy coping strategies.`,
  },

  // Crisis Intervention and Specialty Populations Track
  {
    id: 'crisis-intervention',
    title: 'Crisis Intervention and De-escalation Techniques',
    hours: 6,
    price: 59.99,
    category: 'Crisis Intervention and Specialty Populations Track',
    shortDescription: 'Stay Calm and Effective When Stakes Are Highest',
    fullDescription:
      `Crisis situations test every counselor's skills and composure. This intensive course teaches you to assess, intervene, and de-escalate crisis situations safely and effectively. Learn to quickly assess lethality, implement safety planning, and use verbal de-escalation techniques that reduce agitation and promote cooperation. You'll practice crisis intervention protocols for suicide, homicide, and psychotic episodes while understanding legal and ethical obligations during crisis situations. With role-play scenarios and case studies, develop the confidence and skills to handle the unexpected moments that define your effectiveness as a counselor.`,
  },
  {
    id: 'military-veterans',
    title: 'Working with Military Veterans and PTSD',
    hours: 6,
    price: 59.99,
    category: 'Crisis Intervention and Specialty Populations Track',
    shortDescription: 'Honor Their Service Through Expert Care',
    fullDescription:
      `Military veterans face unique mental health challenges that require specialized understanding and culturally competent care. This course teaches you to work effectively with veterans struggling with PTSD, moral injury, and transition challenges. Learn about military culture, understand the impact of deployment on families, and master evidence-based treatments specifically validated for veteran populations. You'll explore the complex relationship between trauma and identity in military service members, understand VA benefits and resources, and develop skills for addressing the stigma that often prevents veterans from seeking help.`,
  },
  {
    id: 'grief-bereavement',
    title: 'Grief and Bereavement Counseling',
    hours: 8,
    price: 79.99,
    category: 'Crisis Intervention and Specialty Populations Track',
    shortDescription: "Guide Others Through Life's Most Difficult Journey",
    fullDescription:
      `Grief is love with nowhere to go. This compassionate course teaches you to support clients through the devastating experience of loss, whether from death, divorce, job loss, or other major life transitions. Learn contemporary grief theories that move beyond outdated stage models, understand complicated grief and when additional intervention is needed, and master techniques for helping clients maintain continuing bonds with what they've lost. You'll explore cultural differences in grief expression, work with anticipatory grief, and develop skills for supporting both individual grievers and grieving families. Essential training for counselors who want to provide skilled, compassionate care during life's most difficult moments.`,
  },

  // Clinical Supervision and Leadership Track
  {
    id: 'clinical-supervision',
    title: 'Clinical Supervision Skills for New Supervisors',
    hours: 12,
    price: 119.99,
    category: 'Clinical Supervision and Leadership Track',
    shortDescription: 'Lead the Next Generation of Mental Health Professionals',
    fullDescription:
      `Becoming a clinical supervisor requires a different skill set than being a great therapist. This comprehensive course teaches the art and science of clinical supervision, from legal and ethical responsibilities to developmental supervision models. Learn to provide effective feedback, manage the dual relationship of supervisor and evaluator, and create learning environments that promote supervisee growth. You'll explore different supervision styles, practice difficult supervision conversations, and understand documentation requirements for supervision. With tools for assessing supervisee development and managing supervision challenges, gain the confidence to shape the next generation of mental health professionals.`,
  },
  {
    id: 'leadership-mental-health',
    title: 'Leadership in Mental Health Organizations',
    hours: 8,
    price: 79.99,
    category: 'Clinical Supervision and Leadership Track',
    shortDescription: 'Transform Mental Health Care Through Effective Leadership',
    fullDescription:
      `Mental health organizations face unique challenges that require leaders who understand both clinical excellence and organizational dynamics. This course develops leadership skills specifically for mental health settings, covering team building, change management, and creating cultures of psychological safety. Learn to lead clinical teams, manage competing priorities, and implement evidence-based practices in resistant environments. You'll explore ethical leadership principles, understand the business of mental health care, and develop skills for advocating for clients and staff at organizational and policy levels. Perfect for counselors aspiring to leadership roles or current leaders wanting to enhance their effectiveness.`,
  },

  // Practice Development and Innovation Track
  {
    id: 'private-practice',
    title: 'Advanced Private Practice Management',
    hours: 8,
    price: 79.99,
    category: 'Practice Development and Innovation Track',
    shortDescription: 'Build a Practice That Serves You While You Serve Others',
    fullDescription:
      `Running a successful private practice requires business skills they don't teach in graduate school. This advanced course covers the sophisticated aspects of practice management: scaling your practice, hiring and supervising staff, implementing group therapy programs, and developing multiple revenue streams. Learn advanced marketing strategies, understand the business implications of insurance contracts, and explore innovative service delivery models. You'll develop systems for managing practice growth, create policies that support work-life balance, and understand the financial metrics that determine practice sustainability. Essential for established practitioners ready to take their practice to the next level.`,
  },
  {
    id: 'group-therapy',
    title: 'Group Therapy Facilitation and Development',
    hours: 6,
    price: 59.99,
    category: 'Practice Development and Innovation Track',
    shortDescription: 'Harness the Healing Power of Community',
    fullDescription:
      `Group therapy offers unique therapeutic benefits that individual therapy cannot provide, but facilating effective groups requires specialized skills. This practical course teaches group leadership techniques, member selection criteria, and stage-based group development models. Learn to manage group dynamics, handle difficult group members, and create safety in group settings. You'll explore different group therapy modalities, understand legal and ethical considerations specific to group work, and develop skills for marketing and launching successful therapy groups. Perfect for counselors who want to expand their practice while offering clients the powerful healing that happens in community.`,
  },
  {
    id: 'integrative-holistic',
    title: 'Integrative and Holistic Treatment Approaches',
    hours: 6,
    price: 59.99,
    category: 'Practice Development and Innovation Track',
    shortDescription: 'Expand Your Therapeutic Toolkit with Mind-Body Approaches',
    fullDescription:
      `Modern therapy is moving beyond traditional talk therapy to incorporate holistic approaches that address the whole person. This innovative course introduces integrative treatment modalities including mindfulness-based interventions, yoga therapy, nutritional counseling, and energy psychology. Learn to assess which clients benefit from holistic approaches, understand the research supporting integrative treatments, and develop skills for incorporating body-based interventions into traditional therapy settings. You'll explore the ethics of scope of practice expansion and gain practical tools for collaborating with complementary health professionals to provide comprehensive care.`,
  },

  // Continuing Education Electives
  {
    id: 'mindfulness-interventions',
    title: 'Mindfulness-Based Interventions in Therapy',
    hours: 6,
    price: 59.99,
    category: 'Continuing Education Electives',
    shortDescription: 'Bring Ancient Wisdom to Modern Therapy',
    fullDescription:
      `Mindfulness has moved from Buddhist monasteries to mainstream therapy with impressive research support. This course teaches practical mindfulness techniques specifically adapted for therapeutic settings, including Mindfulness-Based Stress Reduction (MBSR) and Mindfulness-Based Cognitive Therapy (MBCT). Learn to teach clients meditation techniques, understand the neuroscience of mindfulness, and integrate present-moment awareness into traditional therapy approaches. You'll practice leading mindfulness exercises, explore contraindications and precautions, and develop skills for helping clients cultivate lasting mindfulness practices that support mental health and wellbeing.`,
  },
  {
    id: 'neurofeedback',
    title: 'Neurofeedback and Brain-Based Therapies',
    hours: 6,
    price: 59.99,
    category: 'Continuing Education Electives',
    shortDescription: 'Train the Brain for Optimal Mental Health',
    fullDescription:
      `Neurofeedback and other brain-based therapies represent the cutting edge of mental health treatment, offering hope for conditions that don't respond well to traditional approaches. This course introduces neurofeedback principles, explores different protocols for various conditions, and teaches you to understand brain mapping and QEEG interpretation. Learn which clients benefit most from neurofeedback, understand the research supporting brain-based interventions, and explore how to integrate these approaches with traditional therapy. You'll gain practical knowledge about equipment, training requirements, and the business considerations of adding neurofeedback to your practice.`,
  },
  {
    id: 'art-expressive',
    title: 'Art and Expressive Therapies Techniques',
    hours: 4,
    price: 39.99,
    category: 'Continuing Education Electives',
    shortDescription: "Unlock Healing Through Creative Expression",
    fullDescription:
      `Sometimes words aren't enough. Art and expressive therapies offer powerful alternatives for clients who struggle with verbal processing or need additional pathways to healing. This practical course teaches basic art therapy techniques, including drawing, painting, collage, and sculpture activities specifically designed for therapeutic purposes. Learn to facilitate creative expression safely, interpret artistic productions therapeutically, and integrate expressive techniques into traditional talk therapy. You'll explore how creative activities can help with trauma processing, emotional regulation, and identity exploration while understanding when to refer to specialized expressive therapists.`,
  },
  {
    id: 'lgbtq-clients',
    title: 'Working with LGBTQ+ Clients',
    hours: 4,
    price: 39.99,
    category: 'Continuing Education Electives',
    shortDescription: 'Provide Affirming, Competent Care for Sexual and Gender Minorities',
    fullDescription:
      `LGBTQ+ clients face unique mental health challenges including minority stress, discrimination, and identity development issues that require specialized knowledge and affirming approaches. This course teaches culturally competent therapy techniques for sexual and gender minority clients, covering identity development models, coming out processes, and the impact of societal discrimination on mental health. Learn affirming language and assessment approaches, understand the specific needs of transgender clients, and explore evidence-based interventions for LGBTQ+ populations. You'll gain practical tools for creating inclusive practice environments and supporting clients through identity exploration and affirmation processes.`,
  },
  {
    id: 'eating-disorders',
    title: 'Eating Disorders Assessment and Treatment',
    hours: 6,
    price: 59.99,
    category: 'Continuing Education Electives',
    shortDescription: 'Understand and Treat the Intersection of Food, Body, and Mind',
    fullDescription:
      `Eating disorders have the highest mortality rate of any mental health condition, making early detection and skilled treatment critical. This comprehensive course teaches recognition and assessment of eating disorders across the spectrum, from anorexia and bulimia to binge eating disorder and ARFID. Learn evidence-based treatment approaches including Family-Based Treatment (FBT) and Enhanced Cognitive Behavioral Therapy (CBT-E), understand the role of medical monitoring, and develop skills for addressing body image disturbance. You'll explore the complex relationship between trauma and eating disorders, understand the impact of diet culture, and gain tools for helping clients develop healthy relationships with food and their bodies.`,
  },
  {
    id: 'chronic-pain',
    title: 'Chronic Pain and Medical Psychology',
    hours: 4,
    price: 39.99,
    category: 'Continuing Education Electives',
    shortDescription: 'Address the Psychological Impact of Physical Suffering',
    fullDescription:
      `Chronic pain affects every aspect of a person's life, creating complex interactions between physical symptoms and mental health. This specialized course teaches psychological approaches to pain management, including cognitive-behavioral techniques for pain coping, mindfulness-based pain reduction, and acceptance-based interventions. Learn to assess the psychological factors that influence pain perception, understand the biopsychosocial model of chronic pain, and develop skills for helping clients manage the emotional impact of living with persistent pain. You'll explore collaboration with medical providers and gain tools for addressing pain-related depression, anxiety, and relationship challenges.`,
  },
  {
    id: 'digital-mental-health',
    title: 'Digital Mental Health Tools and Apps',
    hours: 3,
    price: 29.99,
    category: 'Continuing Education Electives',
    shortDescription: 'Navigate the Digital Revolution in Mental Health Care',
    fullDescription:
      `Mental health apps and digital tools are proliferating rapidly, but how do you evaluate their effectiveness and integrate them ethically into practice? This cutting-edge course teaches you to assess mental health technology, understand the research supporting various digital interventions, and guide clients in selecting appropriate apps and online resources. Learn about chatbots, virtual reality therapy, and AI-assisted treatment while understanding the ethical considerations of recommending digital tools. You'll explore how to maintain therapeutic relationships in increasingly digital environments and develop frameworks for staying current with rapidly evolving technology.`,
  },
  {
    id: 'cultural-competency-populations',
    title: 'Cultural Competency: Specific Populations',
    hours: 3,
    price: 29.99,
    category: 'Continuing Education Electives',
    shortDescription: 'Deepen Your Understanding of Diverse Communities',
    fullDescription:
      `Cultural competence requires more than good intentions—it demands specific knowledge about the communities you serve. This focused course provides in-depth exploration of specific cultural populations, rotating focus to include detailed examinations of various ethnic, religious, and cultural communities. Learn about cultural values, family structures, help-seeking behaviors, and mental health stigma within specific populations. You'll explore culturally adapted interventions, understand the impact of historical trauma and discrimination, and develop skills for working with interpreters and cultural brokers. Essential for counselors who want to move beyond general cultural competence to develop specific expertise with the communities they serve.`,
  },
]

export function getAllProfessionalCourses(): ProfessionalCourse[] {
  return [...currentCECourses, ...expandedCECourses]
}

export function getCourseById(id: string): ProfessionalCourse | undefined {
  return getAllProfessionalCourses().find(c => c.id === id)
}
