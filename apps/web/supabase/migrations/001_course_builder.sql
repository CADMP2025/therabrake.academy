-- =====================================================
-- THERABRAKE ACADEMY DATABASE SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Courses table with CE compliance
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  ce_hours DECIMAL(3,1) CHECK (ce_hours >= 0.5),
  provider_number TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  requires_quiz BOOLEAN DEFAULT true,
  passing_score INTEGER DEFAULT 70,
  price DECIMAL(10,2) DEFAULT 0,
  category TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT DEFAULT 'text',
  content JSONB,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  time_limit INTEGER, -- in minutes
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice',
  answers TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User profiles extension
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  license_number TEXT,
  license_state TEXT DEFAULT 'TX',
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  progress DECIMAL(5,2) DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  ce_hours DECIMAL(3,1) NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  pdf_url TEXT,
  verification_code TEXT UNIQUE
);

-- Progress tracking
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- Quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  score DECIMAL(5,2),
  passed BOOLEAN DEFAULT false,
  answers JSONB,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Courses: Public can view published, instructors manage own
CREATE POLICY "Public can view published courses" ON courses
  FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can manage own courses" ON courses
  FOR ALL USING (auth.uid() = instructor_id);

-- Modules: Follow course visibility
CREATE POLICY "View modules of accessible courses" ON modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = modules.course_id 
      AND (courses.status = 'published' OR courses.instructor_id = auth.uid())
    )
  );

-- Profiles: Users can view all, update own
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Enrollments: Users see own enrollments
CREATE POLICY "Users can view own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
