export const middlewareConfig = {
  // Routes that don't require authentication
  publicRoutes: [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/reset-password',
    '/api/auth/**',
  ],
  
  // Development-only test routes (remove in production)
  testRoutes: process.env.NODE_ENV === 'development' ? [
    '/test-course-builder',
    '/test-quiz-builder',
    '/api/test/**'
  ] : [],
  
  // Routes requiring specific roles
  roleBasedRoutes: {
    instructor: [
      '/instructor/**',
      '/courses/create',
      '/analytics/**'
    ],
    admin: [
      '/admin/**',
      '/users/**',
      '/system/**'
    ],
    student: [
      '/dashboard',
      '/courses/enrolled',
      '/profile',
      '/certificates'
    ]
  }
}