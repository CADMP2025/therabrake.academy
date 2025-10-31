/**
 * Test Helpers and Utilities
 * Reusable functions for test setup, data generation, and assertions
 */

import { faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for tests
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Test Data Generators
 */
export const generateTestUser = () => ({
  email: faker.internet.email().toLowerCase(),
  password: 'Test123!@#',
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  role: 'student' as const,
})

export const generateTestCourse = () => ({
  title: `${faker.company.buzzVerb()} ${faker.company.buzzNoun()}`,
  description: faker.lorem.paragraph(),
  price: faker.number.int({ min: 49, max: 299 }),
  ce_hours: faker.number.int({ min: 1, max: 10 }),
  category: faker.helpers.arrayElement(['Trauma', 'CBT', 'EMDR', 'Ethics', 'General']),
  difficulty: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced']),
})

export const generateTestLesson = (courseId: string) => ({
  course_id: courseId,
  title: `Lesson: ${faker.lorem.sentence({ min: 3, max: 6 })}`,
  content: faker.lorem.paragraphs(3),
  video_url: 'https://example.com/video.mp4',
  duration_minutes: faker.number.int({ min: 5, max: 60 }),
  order_index: 1,
})

export const generateTestQuiz = (courseId: string) => ({
  course_id: courseId,
  title: `Quiz: ${faker.lorem.words(3)}`,
  description: faker.lorem.sentence(),
  passing_score: 70,
  time_limit_minutes: 30,
  max_attempts: 3,
})

export const generateTestQuestion = (quizId: string) => ({
  quiz_id: quizId,
  question_text: `${faker.lorem.sentence()}?`,
  question_type: 'multiple_choice' as const,
  correct_answer: 'A',
  points: 10,
  explanation: faker.lorem.sentence(),
  options: JSON.stringify({
    A: faker.lorem.sentence(),
    B: faker.lorem.sentence(),
    C: faker.lorem.sentence(),
    D: faker.lorem.sentence(),
  }),
})

/**
 * Database Helpers
 */
export const createTestUser = async (overrides = {}) => {
  const userData = { ...generateTestUser(), ...overrides }
  
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true,
    user_metadata: {
      first_name: userData.firstName,
      last_name: userData.lastName,
    },
  })

  if (authError) throw authError

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      role: userData.role,
    })
    .select()
    .single()

  if (profileError) throw profileError

  return { ...authData, profile, password: userData.password }
}

export const createTestCourse = async (instructorId: string, overrides = {}) => {
  const courseData = { ...generateTestCourse(), ...overrides }

  const { data, error } = await supabase
    .from('courses')
    .insert({
      ...courseData,
      instructor_id: instructorId,
      status: 'published',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const createTestLesson = async (courseId: string, overrides = {}) => {
  const lessonData = { ...generateTestLesson(courseId), ...overrides }

  const { data, error } = await supabase
    .from('lessons')
    .insert(lessonData)
    .select()
    .single()

  if (error) throw error
  return data
}

export const createTestQuiz = async (courseId: string, overrides = {}) => {
  const quizData = { ...generateTestQuiz(courseId), ...overrides }

  const { data, error } = await supabase
    .from('quizzes')
    .insert(quizData)
    .select()
    .single()

  if (error) throw error
  return data
}

export const createTestQuestion = async (quizId: string, overrides = {}) => {
  const questionData = { ...generateTestQuestion(quizId), ...overrides }

  const { data, error } = await supabase
    .from('quiz_questions')
    .insert(questionData)
    .select()
    .single()

  if (error) throw error
  return data
}

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      user_id: userId,
      course_id: courseId,
      status: 'active',
      enrolled_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Cleanup Helpers
 */
export const deleteTestUser = async (userId: string) => {
  // Delete user's data first (cascading delete handles most)
  await supabase.auth.admin.deleteUser(userId)
}

export const deleteTestCourse = async (courseId: string) => {
  await supabase.from('courses').delete().eq('id', courseId)
}

/**
 * Wait Helpers
 */
export const waitForEmail = async (email: string, timeout = 10000): Promise<any> => {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    const { data } = await supabase
      .from('email_logs')
      .select('*')
      .eq('recipient_email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (data) return data
    
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  throw new Error(`Email not found for ${email} within ${timeout}ms`)
}

export const waitForRecord = async <T>(
  table: string,
  condition: Record<string, any>,
  timeout = 10000
): Promise<T> => {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    const query = supabase.from(table).select('*')
    
    Object.entries(condition).forEach(([key, value]) => {
      query.eq(key, value)
    })
    
    const { data } = await query.single()
    
    if (data) return data as T
    
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  throw new Error(`Record not found in ${table} within ${timeout}ms`)
}

/**
 * Assertion Helpers
 */
export const assertEmailSent = async (
  email: string,
  expectedSubject?: string,
  timeout = 10000
) => {
  const emailLog = await waitForEmail(email, timeout)
  
  if (expectedSubject && !emailLog.subject.includes(expectedSubject)) {
    throw new Error(
      `Email subject "${emailLog.subject}" does not contain "${expectedSubject}"`
    )
  }
  
  return emailLog
}

export const assertUserHasRole = async (userId: string, expectedRole: string) => {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (data?.role !== expectedRole) {
    throw new Error(`User role is "${data?.role}" but expected "${expectedRole}"`)
  }
}

export const assertEnrollmentExists = async (userId: string, courseId: string) => {
  const { data } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  if (!data) {
    throw new Error(`No enrollment found for user ${userId} in course ${courseId}`)
  }
  
  return data
}

/**
 * API Helpers
 */
export const createAuthenticatedRequest = (accessToken: string) => ({
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
})

export const mockStripeWebhook = (event: any) => ({
  id: faker.string.uuid(),
  object: 'event',
  type: event.type,
  data: event.data,
  created: Math.floor(Date.now() / 1000),
})
