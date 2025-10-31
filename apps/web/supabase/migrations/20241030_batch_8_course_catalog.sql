-- =====================================================
-- BATCH 8: COURSE CATALOG & DISCOVERY SYSTEM
-- =====================================================
-- Adds course tags, ratings, reviews, featured status,
-- recommendations, and coming soon functionality

-- Add new columns to courses table
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_order INTEGER,
  ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS coming_soon BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS launch_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  ADD COLUMN IF NOT EXISTS prerequisites TEXT[],
  ADD COLUMN IF NOT EXISTS learning_objectives TEXT[],
  ADD COLUMN IF NOT EXISTS target_audience TEXT,
  ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_enrollments INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completion_rate DECIMAL(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS preview_video_url TEXT,
  ADD COLUMN IF NOT EXISTS preview_lesson_id UUID REFERENCES lessons(id);

-- Course tags table
CREATE TABLE IF NOT EXISTS course_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Course-tag relationship (many-to-many)
CREATE TABLE IF NOT EXISTS course_tag_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES course_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, tag_id)
);

-- Course reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT true,
  instructor_response TEXT,
  instructor_response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Review helpfulness tracking
CREATE TABLE IF NOT EXISTS review_helpfulness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES course_reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Course waitlist (for coming soon courses)
CREATE TABLE IF NOT EXISTS course_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Course comparison history
CREATE TABLE IF NOT EXISTS course_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User course interests (for recommendations)
CREATE TABLE IF NOT EXISTS user_course_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES course_tags(id) ON DELETE CASCADE,
  interest_score INTEGER DEFAULT 1,
  last_viewed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, tag_id)
);

-- Course view tracking
CREATE TABLE IF NOT EXISTS course_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_courses_featured ON courses(featured, featured_order) WHERE featured = true;
CREATE INDEX idx_courses_coming_soon ON courses(coming_soon) WHERE coming_soon = true;
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_rating ON courses(average_rating DESC);
CREATE INDEX idx_courses_enrollments ON courses(total_enrollments DESC);
CREATE INDEX idx_course_tags_slug ON course_tags(slug);
CREATE INDEX idx_course_tag_relations_course ON course_tag_relations(course_id);
CREATE INDEX idx_course_tag_relations_tag ON course_tag_relations(tag_id);
CREATE INDEX idx_course_reviews_course ON course_reviews(course_id);
CREATE INDEX idx_course_reviews_user ON course_reviews(user_id);
CREATE INDEX idx_course_reviews_rating ON course_reviews(rating);
CREATE INDEX idx_course_waitlist_course ON course_waitlist(course_id);
CREATE INDEX idx_course_views_course ON course_views(course_id);
CREATE INDEX idx_course_views_user ON course_views(user_id);

-- Function to update course rating statistics
CREATE OR REPLACE FUNCTION update_course_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update average rating and total reviews
  UPDATE courses
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM course_reviews
      WHERE course_id = NEW.course_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM course_reviews
      WHERE course_id = NEW.course_id
    )
  WHERE id = NEW.course_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for rating updates
DROP TRIGGER IF EXISTS trigger_update_course_rating ON course_reviews;
CREATE TRIGGER trigger_update_course_rating
AFTER INSERT OR UPDATE OR DELETE ON course_reviews
FOR EACH ROW
EXECUTE FUNCTION update_course_rating_stats();

-- Function to update enrollment count
CREATE OR REPLACE FUNCTION update_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total enrollments
  UPDATE courses
  SET total_enrollments = (
    SELECT COUNT(*)
    FROM enrollments
    WHERE course_id = NEW.course_id AND status = 'active'
  )
  WHERE id = NEW.course_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for enrollment count
DROP TRIGGER IF EXISTS trigger_update_enrollment_count ON enrollments;
CREATE TRIGGER trigger_update_enrollment_count
AFTER INSERT OR UPDATE ON enrollments
FOR EACH ROW
EXECUTE FUNCTION update_enrollment_count();

-- Function to update completion rate
CREATE OR REPLACE FUNCTION update_completion_rate()
RETURNS TRIGGER AS $$
BEGIN
  -- Update completion rate
  UPDATE courses
  SET completion_rate = (
    SELECT 
      CASE 
        WHEN COUNT(*) = 0 THEN 0
        ELSE (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100
      END
    FROM enrollments
    WHERE course_id = NEW.course_id
  )
  WHERE id = NEW.course_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for completion rate
DROP TRIGGER IF EXISTS trigger_update_completion_rate ON enrollments;
CREATE TRIGGER trigger_update_completion_rate
AFTER UPDATE ON enrollments
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_completion_rate();

-- Function to get featured courses
CREATE OR REPLACE FUNCTION get_featured_courses(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  slug TEXT,
  ce_hours DECIMAL,
  price DECIMAL,
  category TEXT,
  thumbnail_url TEXT,
  average_rating DECIMAL,
  total_reviews INTEGER,
  total_enrollments INTEGER,
  featured_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    c.slug,
    c.ce_hours,
    c.price,
    c.category,
    c.thumbnail_url,
    c.average_rating,
    c.total_reviews,
    c.total_enrollments,
    c.featured_order
  FROM courses c
  WHERE 
    c.featured = true
    AND c.status = 'published'
    AND (c.featured_until IS NULL OR c.featured_until > now())
  ORDER BY c.featured_order ASC NULLS LAST, c.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get popular courses
CREATE OR REPLACE FUNCTION get_popular_courses(
  limit_count INTEGER DEFAULT 10,
  time_period INTERVAL DEFAULT '30 days'
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  slug TEXT,
  ce_hours DECIMAL,
  price DECIMAL,
  category TEXT,
  thumbnail_url TEXT,
  average_rating DECIMAL,
  total_reviews INTEGER,
  total_enrollments INTEGER,
  popularity_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    c.slug,
    c.ce_hours,
    c.price,
    c.category,
    c.thumbnail_url,
    c.average_rating,
    c.total_reviews,
    c.total_enrollments,
    -- Popularity score calculation
    (
      (c.total_enrollments * 0.4) +
      (c.average_rating * 20 * 0.3) +
      (c.total_reviews * 0.2) +
      (c.completion_rate * 0.1)
    ) AS popularity_score
  FROM courses c
  WHERE 
    c.status = 'published'
    AND c.coming_soon = false
  ORDER BY popularity_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get recommended courses for a user
CREATE OR REPLACE FUNCTION get_recommended_courses(
  p_user_id UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  slug TEXT,
  ce_hours DECIMAL,
  price DECIMAL,
  category TEXT,
  thumbnail_url TEXT,
  average_rating DECIMAL,
  total_reviews INTEGER,
  recommendation_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH user_tags AS (
    -- Get user's interested tags based on enrollments and views
    SELECT DISTINCT ctr.tag_id
    FROM enrollments e
    JOIN course_tag_relations ctr ON ctr.course_id = e.course_id
    WHERE e.user_id = p_user_id
    UNION
    SELECT DISTINCT ctr.tag_id
    FROM course_views cv
    JOIN course_tag_relations ctr ON ctr.course_id = cv.course_id
    WHERE cv.user_id = p_user_id
  ),
  user_enrollments AS (
    SELECT course_id FROM enrollments WHERE user_id = p_user_id
  )
  SELECT 
    c.id,
    c.title,
    c.description,
    c.slug,
    c.ce_hours,
    c.price,
    c.category,
    c.thumbnail_url,
    c.average_rating,
    c.total_reviews,
    -- Recommendation score based on tag match, rating, and popularity
    (
      (COUNT(ctr.tag_id) * 30.0) + -- Tag match weight
      (c.average_rating * 15.0) +   -- Rating weight
      (c.total_enrollments * 0.1) + -- Popularity weight
      (c.completion_rate * 0.2)     -- Quality weight
    ) AS recommendation_score
  FROM courses c
  LEFT JOIN course_tag_relations ctr ON ctr.course_id = c.id
  LEFT JOIN user_tags ut ON ut.tag_id = ctr.tag_id
  WHERE 
    c.status = 'published'
    AND c.coming_soon = false
    AND c.id NOT IN (SELECT course_id FROM user_enrollments)
  GROUP BY c.id
  HAVING COUNT(ctr.tag_id) > 0 -- Only courses with matching tags
  ORDER BY recommendation_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get courses frequently bought together
CREATE OR REPLACE FUNCTION get_courses_also_bought(
  p_course_id UUID,
  limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  slug TEXT,
  ce_hours DECIMAL,
  price DECIMAL,
  category TEXT,
  thumbnail_url TEXT,
  average_rating DECIMAL,
  co_purchase_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    c.slug,
    c.ce_hours,
    c.price,
    c.category,
    c.thumbnail_url,
    c.average_rating,
    COUNT(*) AS co_purchase_count
  FROM enrollments e1
  JOIN enrollments e2 ON e1.user_id = e2.user_id
  JOIN courses c ON c.id = e2.course_id
  WHERE 
    e1.course_id = p_course_id
    AND e2.course_id != p_course_id
    AND c.status = 'published'
    AND c.coming_soon = false
  GROUP BY c.id
  ORDER BY co_purchase_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Insert default tags
INSERT INTO course_tags (name, slug, description, color, icon) VALUES
  ('Trauma-Informed', 'trauma-informed', 'Courses focusing on trauma-informed care and practices', '#EF4444', 'shield'),
  ('Ethics', 'ethics', 'Professional ethics and ethical decision making', '#8B5CF6', 'balance-scale'),
  ('CBT', 'cbt', 'Cognitive Behavioral Therapy techniques and approaches', '#3B82F6', 'brain'),
  ('EMDR', 'emdr', 'Eye Movement Desensitization and Reprocessing', '#10B981', 'eye'),
  ('Couples Therapy', 'couples-therapy', 'Relationships and couples counseling', '#EC4899', 'heart'),
  ('Addiction', 'addiction', 'Substance use and addiction counseling', '#F59E0B', 'pill'),
  ('Child & Adolescent', 'child-adolescent', 'Working with children and adolescents', '#14B8A6', 'child'),
  ('Group Therapy', 'group-therapy', 'Group therapy facilitation and techniques', '#6366F1', 'users'),
  ('Assessment', 'assessment', 'Clinical assessment and diagnostic skills', '#A855F7', 'clipboard'),
  ('Crisis Intervention', 'crisis-intervention', 'Crisis response and de-escalation', '#DC2626', 'alert'),
  ('Cultural Competency', 'cultural-competency', 'Diversity and cultural awareness', '#059669', 'globe'),
  ('Private Practice', 'private-practice', 'Building and managing a private practice', '#2563EB', 'briefcase'),
  ('Supervision', 'supervision', 'Clinical supervision skills', '#7C3AED', 'clipboard-check'),
  ('Telehealth', 'telehealth', 'Online therapy and digital mental health', '#0891B2', 'video'),
  ('Self-Care', 'self-care', 'Therapist wellness and burnout prevention', '#F97316', 'heart-pulse')
ON CONFLICT (slug) DO NOTHING;

-- Row Level Security Policies

-- Course tags are publicly readable
ALTER TABLE course_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course tags are publicly readable"
  ON course_tags FOR SELECT
  TO public
  USING (true);

-- Course tag relations are publicly readable
ALTER TABLE course_tag_relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course tag relations are publicly readable"
  ON course_tag_relations FOR SELECT
  TO public
  USING (true);

-- Reviews are publicly readable
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course reviews are publicly readable"
  ON course_reviews FOR SELECT
  TO public
  USING (true);

-- Users can create reviews for courses they're enrolled in
CREATE POLICY "Users can create reviews for enrolled courses"
  ON course_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE user_id = auth.uid()
      AND course_id = course_reviews.course_id
      AND status IN ('active', 'completed')
    )
  );

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON course_reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON course_reviews FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Review helpfulness is publicly readable
ALTER TABLE review_helpfulness ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Review helpfulness is publicly readable"
  ON review_helpfulness FOR SELECT
  TO public
  USING (true);

-- Authenticated users can mark reviews as helpful
CREATE POLICY "Users can mark reviews as helpful"
  ON review_helpfulness FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Course waitlist policies
ALTER TABLE course_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own waitlist entries"
  ON course_waitlist FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can join waitlists"
  ON course_waitlist FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Course views are insertable by anyone
ALTER TABLE course_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log course views"
  ON course_views FOR INSERT
  TO public
  WITH CHECK (true);

-- User interests policies
ALTER TABLE user_course_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own interests"
  ON user_course_interests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own interests"
  ON user_course_interests FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Comparison history policies
ALTER TABLE course_comparisons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own comparisons"
  ON course_comparisons FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create comparisons"
  ON course_comparisons FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_featured_courses TO public;
GRANT EXECUTE ON FUNCTION get_popular_courses TO public;
GRANT EXECUTE ON FUNCTION get_recommended_courses TO authenticated;
GRANT EXECUTE ON FUNCTION get_courses_also_bought TO public;
