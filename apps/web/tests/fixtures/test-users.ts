export interface TestUser {
  email: string;
  password: string;
  role: 'student' | 'instructor' | 'admin';
}

export const TEST_USERS = {
  admin: {
    email: 'admin@test.therabrake.academy',
    password: 'AdminTest123!',
    role: 'admin' as const
  },
  instructor: {
    email: 'instructor@test.therabrake.academy',
    password: 'InstructorTest123!',
    role: 'instructor' as const
  },
  student: {
    email: 'student@test.therabrake.academy',
    password: 'StudentTest123!',
    role: 'student' as const
  }
};
