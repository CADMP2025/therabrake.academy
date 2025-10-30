-- Batch 5.1: Course Player Complete - Database Migration
-- Create tables for video progress, lesson notes, and resources

-- Video progress tracking (separate from lesson progress for granular video tracking)
CREATE TABLE IF NOT EXISTS video_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  last_position INTEGER DEFAULT 0, -- seconds
  time_spent INTEGER DEFAULT 0, -- total seconds watched
  progress_percentage INTEGER DEFAULT 0, -- 0-100
  playback_speed DECIMAL(3,2) DEFAULT 1.00,
  quality_setting TEXT DEFAULT 'auto',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Lesson notes with timestamps
CREATE TABLE IF NOT EXISTS lesson_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  timestamp INTEGER DEFAULT 0, -- video timestamp in seconds
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lesson resources (PDFs, downloads, etc.)
CREATE TABLE IF NOT EXISTS lesson_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- pdf, doc, image, etc.
  file_size BIGINT, -- bytes
  downloadable BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Track resource downloads (for analytics)
CREATE TABLE IF NOT EXISTS resource_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resource_id UUID REFERENCES lesson_resources(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ DEFAULT now()
);

-- Video subtitles/captions
CREATE TABLE IF NOT EXISTS video_subtitles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  language_code TEXT NOT NULL, -- en, es, fr, etc.
  language_name TEXT NOT NULL, -- English, Spanish, French
  subtitle_url TEXT NOT NULL, -- VTT file URL
  is_default BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Video transcripts (for download)
CREATE TABLE IF NOT EXISTS video_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  language_code TEXT NOT NULL,
  language_name TEXT NOT NULL,
  transcript_text TEXT NOT NULL,
  transcript_url TEXT, -- Optional PDF/TXT file
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bookmarks for quick video navigation
CREATE TABLE IF NOT EXISTS video_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  timestamp INTEGER NOT NULL, -- seconds
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_progress_user ON video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_lesson ON video_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_notes_user ON lesson_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_notes_lesson ON lesson_notes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_notes_timestamp ON lesson_notes(lesson_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_lesson ON lesson_resources(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_resources_course ON lesson_resources(course_id);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_user ON resource_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource ON resource_downloads(resource_id);
CREATE INDEX IF NOT EXISTS idx_video_subtitles_lesson ON video_subtitles(lesson_id);
CREATE INDEX IF NOT EXISTS idx_video_transcripts_lesson ON video_transcripts(lesson_id);
CREATE INDEX IF NOT EXISTS idx_video_bookmarks_user ON video_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_video_bookmarks_lesson ON video_bookmarks(lesson_id);

-- Enable Row Level Security
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_subtitles ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_progress
CREATE POLICY "Users can view their own video progress"
  ON video_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video progress"
  ON video_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video progress"
  ON video_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for lesson_notes
CREATE POLICY "Users can view their own notes"
  ON lesson_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
  ON lesson_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON lesson_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON lesson_notes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for lesson_resources
CREATE POLICY "Users can view active lesson resources"
  ON lesson_resources FOR SELECT
  USING (active = true);

CREATE POLICY "Instructors can manage their course resources"
  ON lesson_resources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lesson_resources.course_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- RLS Policies for resource_downloads
CREATE POLICY "Users can view their own downloads"
  ON resource_downloads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can track their own downloads"
  ON resource_downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for video_subtitles
CREATE POLICY "Anyone can view active subtitles"
  ON video_subtitles FOR SELECT
  USING (active = true);

CREATE POLICY "Instructors can manage course subtitles"
  ON video_subtitles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON lessons.module_id = modules.id
      JOIN courses ON modules.course_id = courses.id
      WHERE lessons.id = video_subtitles.lesson_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- RLS Policies for video_transcripts
CREATE POLICY "Anyone can view transcripts"
  ON video_transcripts FOR SELECT
  USING (true);

CREATE POLICY "Instructors can manage course transcripts"
  ON video_transcripts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM lessons
      JOIN modules ON lessons.module_id = modules.id
      JOIN courses ON modules.course_id = courses.id
      WHERE lessons.id = video_transcripts.lesson_id
      AND courses.instructor_id = auth.uid()
    )
  );

-- RLS Policies for video_bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON video_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON video_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON video_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_video_progress_updated_at
  BEFORE UPDATE ON video_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_notes_updated_at
  BEFORE UPDATE ON lesson_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_resources_updated_at
  BEFORE UPDATE ON lesson_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get user's course progress summary
CREATE OR REPLACE FUNCTION get_course_progress_summary(p_user_id UUID, p_course_id UUID)
RETURNS TABLE (
  total_lessons INTEGER,
  completed_lessons INTEGER,
  in_progress_lessons INTEGER,
  total_time_spent INTEGER,
  avg_progress_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT l.id)::INTEGER as total_lessons,
    COUNT(DISTINCT CASE WHEN lp.status = 'completed' THEN l.id END)::INTEGER as completed_lessons,
    COUNT(DISTINCT CASE WHEN lp.status = 'in_progress' THEN l.id END)::INTEGER as in_progress_lessons,
    COALESCE(SUM(vp.time_spent), 0)::INTEGER as total_time_spent,
    COALESCE(AVG(vp.progress_percentage), 0)::DECIMAL as avg_progress_percentage
  FROM lessons l
  JOIN modules m ON l.module_id = m.id
  LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = p_user_id
  LEFT JOIN video_progress vp ON l.id = vp.lesson_id AND vp.user_id = p_user_id
  WHERE m.course_id = p_course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recommended resume point for a course
CREATE OR REPLACE FUNCTION get_course_resume_point(p_user_id UUID, p_course_id UUID)
RETURNS TABLE (
  lesson_id UUID,
  lesson_title TEXT,
  module_title TEXT,
  last_position INTEGER,
  progress_percentage INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id as lesson_id,
    l.title as lesson_title,
    m.title as module_title,
    vp.last_position,
    vp.progress_percentage
  FROM video_progress vp
  JOIN lessons l ON vp.lesson_id = l.id
  JOIN modules m ON l.module_id = m.id
  WHERE vp.user_id = p_user_id
    AND vp.course_id = p_course_id
    AND vp.progress_percentage < 98
  ORDER BY vp.updated_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment documentation
COMMENT ON TABLE video_progress IS 'Tracks granular video playback progress for each user and lesson';
COMMENT ON TABLE lesson_notes IS 'User-created notes with video timestamps for lessons';
COMMENT ON TABLE lesson_resources IS 'Downloadable course materials (PDFs, worksheets, etc.)';
COMMENT ON TABLE resource_downloads IS 'Analytics tracking for resource downloads';
COMMENT ON TABLE video_subtitles IS 'Closed caption/subtitle files for videos';
COMMENT ON TABLE video_transcripts IS 'Full text transcripts of video lessons';
COMMENT ON TABLE video_bookmarks IS 'User-created bookmarks for quick video navigation';
