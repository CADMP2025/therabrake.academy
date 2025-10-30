-- Batch 5.2: Progress Tracking System - Database Migration
-- Tables for learning streaks, notifications, and weekly summaries

-- Learning streaks tracking
CREATE TABLE IF NOT EXISTS learning_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Progress notifications tracking
CREATE TABLE IF NOT EXISTS progress_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'milestone',
    'weekly_summary',
    're_engagement',
    'completion'
  )),
  milestone_percentage INTEGER CHECK (milestone_percentage IN (25, 50, 75, 100)),
  days_inactive INTEGER,
  sent_at TIMESTAMPTZ DEFAULT now(),
  email_opened BOOLEAN DEFAULT false,
  email_opened_at TIMESTAMPTZ
);

-- Weekly activity summary (for faster queries)
CREATE TABLE IF NOT EXISTS weekly_activity_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  lessons_completed INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0, -- seconds
  ce_hours_earned DECIMAL(5,2) DEFAULT 0,
  courses_active INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, week_start_date)
);

-- Daily activity log (for streak calculation)
CREATE TABLE IF NOT EXISTS daily_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_date DATE DEFAULT CURRENT_DATE NOT NULL,
  lessons_accessed INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- seconds
  videos_watched INTEGER DEFAULT 0,
  notes_created INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_learning_streaks_user ON learning_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_notifications_user ON progress_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_notifications_type ON progress_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_progress_notifications_sent ON progress_notifications(sent_at);
CREATE INDEX IF NOT EXISTS idx_weekly_activity_user ON weekly_activity_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_activity_dates ON weekly_activity_summary(week_start_date, week_end_date);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user ON daily_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activity_date ON daily_activity_log(activity_date);

-- Enable Row Level Security
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_activity_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_streaks
CREATE POLICY "Users can view their own streaks"
  ON learning_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON learning_streaks FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for progress_notifications
CREATE POLICY "Users can view their own notifications"
  ON progress_notifications FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for weekly_activity_summary
CREATE POLICY "Users can view their own weekly summaries"
  ON weekly_activity_summary FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for daily_activity_log
CREATE POLICY "Users can view their own daily activity"
  ON daily_activity_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activity"
  ON daily_activity_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activity"
  ON daily_activity_log FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update or create daily activity
CREATE OR REPLACE FUNCTION log_daily_activity(
  p_user_id UUID,
  p_activity_date DATE DEFAULT CURRENT_DATE,
  p_lessons_accessed INTEGER DEFAULT 0,
  p_time_spent INTEGER DEFAULT 0,
  p_videos_watched INTEGER DEFAULT 0,
  p_notes_created INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO daily_activity_log (
    user_id,
    activity_date,
    lessons_accessed,
    time_spent,
    videos_watched,
    notes_created
  ) VALUES (
    p_user_id,
    p_activity_date,
    p_lessons_accessed,
    p_time_spent,
    p_videos_watched,
    p_notes_created
  )
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    lessons_accessed = daily_activity_log.lessons_accessed + EXCLUDED.lessons_accessed,
    time_spent = daily_activity_log.time_spent + EXCLUDED.time_spent,
    videos_watched = daily_activity_log.videos_watched + EXCLUDED.videos_watched,
    notes_created = daily_activity_log.notes_created + EXCLUDED.notes_created;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update learning streak
CREATE OR REPLACE FUNCTION update_learning_streak(p_user_id UUID)
RETURNS TABLE (
  current_streak INTEGER,
  longest_streak INTEGER,
  streak_broken BOOLEAN
) AS $$
DECLARE
  v_last_activity_date DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_today DATE := CURRENT_DATE;
  v_days_diff INTEGER;
  v_streak_broken BOOLEAN := false;
BEGIN
  -- Get existing streak data
  SELECT last_activity_date, learning_streaks.current_streak, learning_streaks.longest_streak
  INTO v_last_activity_date, v_current_streak, v_longest_streak
  FROM learning_streaks
  WHERE user_id = p_user_id;

  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO learning_streaks (user_id, current_streak, longest_streak, last_activity_date)
    VALUES (p_user_id, 1, 1, v_today);
    
    RETURN QUERY SELECT 1, 1, false;
    RETURN;
  END IF;

  -- Calculate days difference
  v_days_diff := v_today - v_last_activity_date;

  -- Same day - no change
  IF v_days_diff = 0 THEN
    RETURN QUERY SELECT v_current_streak, v_longest_streak, false;
    RETURN;
  END IF;

  -- Consecutive day - increment streak
  IF v_days_diff = 1 THEN
    v_current_streak := v_current_streak + 1;
    v_longest_streak := GREATEST(v_current_streak, v_longest_streak);
  -- Streak broken - reset to 1
  ELSE
    v_current_streak := 1;
    v_streak_broken := true;
  END IF;

  -- Update record
  UPDATE learning_streaks
  SET
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    last_activity_date = v_today,
    updated_at = now()
  WHERE user_id = p_user_id;

  RETURN QUERY SELECT v_current_streak, v_longest_streak, v_streak_broken;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get users who need re-engagement emails
CREATE OR REPLACE FUNCTION get_inactive_users(days_threshold INTEGER DEFAULT 7)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  days_inactive INTEGER,
  last_activity_date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ls.user_id,
    u.email,
    (CURRENT_DATE - ls.last_activity_date)::INTEGER as days_inactive,
    ls.last_activity_date
  FROM learning_streaks ls
  JOIN auth.users u ON ls.user_id = u.id
  WHERE (CURRENT_DATE - ls.last_activity_date) >= days_threshold
    AND NOT EXISTS (
      SELECT 1 FROM progress_notifications pn
      WHERE pn.user_id = ls.user_id
        AND pn.notification_type = 're_engagement'
        AND pn.sent_at >= (now() - interval '7 days')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate weekly summary
CREATE OR REPLACE FUNCTION calculate_weekly_summary(
  p_user_id UUID,
  p_week_start DATE,
  p_week_end DATE
)
RETURNS TABLE (
  lessons_completed INTEGER,
  total_time_spent INTEGER,
  ce_hours_earned DECIMAL,
  courses_active INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT CASE WHEN lp.status = 'completed' THEN lp.lesson_id END)::INTEGER as lessons_completed,
    COALESCE(SUM(vp.time_spent), 0)::INTEGER as total_time_spent,
    ROUND((COALESCE(SUM(vp.time_spent), 0) / 3600.0)::NUMERIC, 2) as ce_hours_earned,
    COUNT(DISTINCT lp.course_id)::INTEGER as courses_active
  FROM lesson_progress lp
  LEFT JOIN video_progress vp ON lp.lesson_id = vp.lesson_id AND vp.user_id = p_user_id
  WHERE lp.user_id = p_user_id
    AND lp.updated_at >= p_week_start::TIMESTAMPTZ
    AND lp.updated_at < (p_week_end + INTERVAL '1 day')::TIMESTAMPTZ;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and record milestone notifications
CREATE OR REPLACE FUNCTION check_course_milestone(
  p_user_id UUID,
  p_course_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_total_lessons INTEGER;
  v_completed_lessons INTEGER;
  v_completion_percentage INTEGER;
  v_milestone INTEGER;
BEGIN
  -- Get course progress
  SELECT
    COUNT(DISTINCT l.id),
    COUNT(DISTINCT CASE WHEN lp.status = 'completed' THEN l.id END)
  INTO v_total_lessons, v_completed_lessons
  FROM lessons l
  JOIN modules m ON l.module_id = m.id
  LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = p_user_id
  WHERE m.course_id = p_course_id;

  -- Calculate completion percentage
  IF v_total_lessons > 0 THEN
    v_completion_percentage := ROUND((v_completed_lessons::DECIMAL / v_total_lessons) * 100);
  ELSE
    RETURN 0;
  END IF;

  -- Determine milestone
  IF v_completion_percentage >= 100 THEN
    v_milestone := 100;
  ELSIF v_completion_percentage >= 75 THEN
    v_milestone := 75;
  ELSIF v_completion_percentage >= 50 THEN
    v_milestone := 50;
  ELSIF v_completion_percentage >= 25 THEN
    v_milestone := 25;
  ELSE
    RETURN 0;
  END IF;

  -- Check if notification already sent
  IF EXISTS (
    SELECT 1 FROM progress_notifications
    WHERE user_id = p_user_id
      AND course_id = p_course_id
      AND notification_type = 'milestone'
      AND milestone_percentage = v_milestone
  ) THEN
    RETURN 0;
  END IF;

  -- Record notification (email sending happens in application layer)
  INSERT INTO progress_notifications (
    user_id,
    course_id,
    notification_type,
    milestone_percentage,
    sent_at
  ) VALUES (
    p_user_id,
    p_course_id,
    'milestone',
    v_milestone,
    now()
  );

  RETURN v_milestone;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment documentation
COMMENT ON TABLE learning_streaks IS 'Tracks consecutive days of learning activity for each user';
COMMENT ON TABLE progress_notifications IS 'Records all progress-related notifications sent to users';
COMMENT ON TABLE weekly_activity_summary IS 'Pre-calculated weekly activity summaries for faster dashboard loading';
COMMENT ON TABLE daily_activity_log IS 'Daily activity log for streak calculation and analytics';

COMMENT ON FUNCTION update_learning_streak IS 'Updates user learning streak based on activity date';
COMMENT ON FUNCTION get_inactive_users IS 'Returns users who have been inactive for specified days and need re-engagement';
COMMENT ON FUNCTION calculate_weekly_summary IS 'Calculates weekly learning statistics for a user';
COMMENT ON FUNCTION check_course_milestone IS 'Checks if user reached a milestone and records notification';
