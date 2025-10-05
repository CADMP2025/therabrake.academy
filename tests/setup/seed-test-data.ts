import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface TestUser {
  email: string;
  password: string;
  full_name: string;
  role: 'student' | 'instructor' | 'admin';
  license_number?: string;
  license_state?: string;
}

export const TEST_USERS: TestUser[] = [
  {
    email: 'admin@test.therabrake.academy',
    password: 'AdminTest123!',
    full_name: 'Test Admin',
    role: 'admin'
  },
  {
    email: 'instructor@test.therabrake.academy',
    password: 'InstructorTest123!',
    full_name: 'Test Instructor',
    role: 'instructor',
    license_number: '12345',
    license_state: 'TX'
  },
  {
    email: 'student@test.therabrake.academy',
    password: 'StudentTest123!',
    full_name: 'Test Student',
    role: 'student'
  }
];

async function seedTestUsers() {
  console.log('🌱 Seeding test users...');
  
  for (const user of TEST_USERS) {
    try {
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const userExists = existingUser?.users.find(u => u.email === user.email);
      
      if (userExists) {
        console.log(`   ⏭️  User ${user.email} already exists`);
        continue;
      }

      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role
        }
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          license_number: user.license_number,
          license_state: user.license_state
        });

      if (profileError) throw profileError;

      console.log(`   ✅ Created user: ${user.email} (${user.role})`);
    } catch (error: any) {
      console.error(`   ❌ Failed to create ${user.email}:`, error.message);
    }
  }
}

async function seedAll() {
  console.log('🚀 Starting test data seeding...\n');
  
  await seedTestUsers();
  
  console.log('\n✅ Test data seeding complete!');
  console.log('\n📝 Test Credentials:');
  TEST_USERS.forEach(user => {
    console.log(`   ${user.role.padEnd(10)} - ${user.email.padEnd(40)} / ${user.password}`);
  });
}

if (require.main === module) {
  seedAll()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedAll };
