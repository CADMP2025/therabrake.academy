-- Enrollment System Tables
-- Scheduled notifications and enrollment tracking enhancements

-- Scheduled Notifications Table
CREATE TABLE IF NOT EXISTS scheduled_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('7_day_warning', '3_day_warning', '1_day_warning', 'access_expired')),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  error_message TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scheduled_notifications_enrollment ON scheduled_notifications(enrollment_id);
CREATE INDEX idx_scheduled_notifications_status ON scheduled_notifications(status);
CREATE INDEX idx_scheduled_notifications_scheduled_for ON scheduled_notifications(scheduled_for);
CREATE INDEX idx_scheduled_notifications_type ON scheduled_notifications(notification_type);

COMMENT ON TABLE scheduled_notifications IS 'Scheduled expiration warning notifications';
COMMENT ON COLUMN scheduled_notifications.notification_type IS 'Type of warning: 7_day, 3_day, 1_day, or expired';

-- Add enrollment tracking columns if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='enrollments' AND column_name='grace_period_ends_at') THEN
    ALTER TABLE enrollments ADD COLUMN grace_period_ends_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='enrollments' AND column_name='revoked_at') THEN
    ALTER TABLE enrollments ADD COLUMN revoked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='enrollments' AND column_name='program_type') THEN
    ALTER TABLE enrollments ADD COLUMN program_type VARCHAR(50) DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='enrollments' AND column_name='membership_tier') THEN
    ALTER TABLE enrollments ADD COLUMN membership_tier VARCHAR(50) DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='enrollments' AND column_name='payment_intent_id') THEN
    ALTER TABLE enrollments ADD COLUMN payment_intent_id VARCHAR(255) DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='enrollments' AND column_name='subscription_id') THEN
    ALTER TABLE enrollments ADD COLUMN subscription_id VARCHAR(255) DEFAULT NULL;
  END IF;
END $$;

-- Create indexes on new columns
CREATE INDEX IF NOT EXISTS idx_enrollments_grace_period ON enrollments(grace_period_ends_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_program_type ON enrollments(program_type);
CREATE INDEX IF NOT EXISTS idx_enrollments_membership_tier ON enrollments(membership_tier);
CREATE INDEX IF NOT EXISTS idx_enrollments_payment_intent ON enrollments(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_subscription ON enrollments(subscription_id);

-- Row Level Security for scheduled_notifications
ALTER TABLE scheduled_notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own scheduled notifications
CREATE POLICY scheduled_notifications_user_policy ON scheduled_notifications
  FOR SELECT TO authenticated
  USING (
    enrollment_id IN (
      SELECT id FROM enrollments WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_scheduled_notifications_updated_at
  BEFORE UPDATE ON scheduled_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Helper Functions

-- Get user's enrollments with expiration status
CREATE OR REPLACE FUNCTION get_user_enrollments_with_status(user_id_param UUID)
RETURNS TABLE (
  enrollment_id UUID,
  course_id UUID,
  program_type VARCHAR,
  membership_tier VARCHAR,
  status VARCHAR,
  enrolled_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  grace_period_ends_at TIMESTAMP WITH TIME ZONE,
  days_remaining INTEGER,
  is_expired BOOLEAN,
  is_in_grace_period BOOLEAN,
  can_extend BOOLEAN,
  course_title VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.course_id,
    e.program_type,
    e.membership_tier,
    e.status,
    e.enrolled_at,
    e.expires_at,
    e.grace_period_ends_at,
    CASE 
      WHEN e.expires_at IS NOT NULL THEN 
        CEIL(EXTRACT(EPOCH FROM (e.expires_at - NOW())) / 86400)::INTEGER
      ELSE NULL
    END as days_remaining,
    CASE 
      WHEN e.expires_at IS NOT NULL AND NOW() > e.expires_at THEN TRUE
      ELSE FALSE
    END as is_expired,
    CASE 
      WHEN e.expires_at IS NOT NULL 
           AND NOW() > e.expires_at 
           AND e.grace_period_ends_at IS NOT NULL 
           AND NOW() <= e.grace_period_ends_at THEN TRUE
      ELSE FALSE
    END as is_in_grace_period,
    CASE 
      WHEN e.expires_at IS NOT NULL 
           AND (NOW() > e.expires_at 
                OR CEIL(EXTRACT(EPOCH FROM (e.expires_at - NOW())) / 86400) < 30) THEN TRUE
      ELSE FALSE
    END as can_extend,
    c.title as course_title
  FROM enrollments e
  LEFT JOIN courses c ON e.course_id = c.id
  WHERE e.user_id = user_id_param
  ORDER BY e.enrolled_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Check if user has active access to a course
CREATE OR REPLACE FUNCTION has_active_course_access(
  user_id_param UUID,
  course_id_param UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  enrollment RECORD;
BEGIN
  SELECT * INTO enrollment
  FROM enrollments
  WHERE user_id = user_id_param
    AND course_id = course_id_param
    AND status = 'active'
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check expiration with grace period
  IF enrollment.expires_at IS NOT NULL THEN
    IF enrollment.grace_period_ends_at IS NOT NULL THEN
      RETURN NOW() <= enrollment.grace_period_ends_at;
    ELSE
      RETURN NOW() <= enrollment.expires_at;
    END IF;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Get expiring enrollments for notification processing
CREATE OR REPLACE FUNCTION get_expiring_enrollments(days_threshold INTEGER)
RETURNS TABLE (
  enrollment_id UUID,
  user_id UUID,
  user_email VARCHAR,
  course_id UUID,
  course_title VARCHAR,
  program_type VARCHAR,
  expires_at TIMESTAMP WITH TIME ZONE,
  days_remaining INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.user_id,
    u.email,
    e.course_id,
    c.title,
    e.program_type,
    e.expires_at,
    CEIL(EXTRACT(EPOCH FROM (e.expires_at - NOW())) / 86400)::INTEGER as days_remaining
  FROM enrollments e
  INNER JOIN auth.users u ON e.user_id = u.id
  LEFT JOIN courses c ON e.course_id = c.id
  WHERE e.status = 'active'
    AND e.expires_at IS NOT NULL
    AND e.expires_at >= NOW()
    AND e.expires_at <= (NOW() + (days_threshold || ' days')::INTERVAL)
  ORDER BY e.expires_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Process expired enrollments (to be called by cron)
CREATE OR REPLACE FUNCTION process_expired_enrollments()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Update enrollments that have passed their grace period
  UPDATE enrollments
  SET status = 'expired'
  WHERE status = 'active'
    AND grace_period_ends_at IS NOT NULL
    AND grace_period_ends_at < NOW();
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Extend enrollment (add days to expiration)
CREATE OR REPLACE FUNCTION extend_enrollment_expiry(
  enrollment_id_param UUID,
  extension_days INTEGER,
  payment_intent_id_param VARCHAR DEFAULT NULL
)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
DECLARE
  current_enrollment RECORD;
  new_expiry TIMESTAMP WITH TIME ZONE;
  new_grace_period TIMESTAMP WITH TIME ZONE;
  grace_days INTEGER;
BEGIN
  -- Get current enrollment
  SELECT * INTO current_enrollment
  FROM enrollments
  WHERE id = enrollment_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enrollment not found';
  END IF;
  
  -- Calculate new expiration date
  IF current_enrollment.expires_at IS NOT NULL THEN
    new_expiry := current_enrollment.expires_at + (extension_days || ' days')::INTERVAL;
  ELSE
    new_expiry := NOW() + (extension_days || ' days')::INTERVAL;
  END IF;
  
  -- Calculate new grace period if one exists
  IF current_enrollment.grace_period_ends_at IS NOT NULL THEN
    grace_days := CEIL(EXTRACT(EPOCH FROM (current_enrollment.grace_period_ends_at - current_enrollment.expires_at)) / 86400);
    new_grace_period := new_expiry + (grace_days || ' days')::INTERVAL;
  ELSE
    new_grace_period := NULL;
  END IF;
  
  -- Update enrollment
  UPDATE enrollments
  SET 
    expires_at = new_expiry,
    grace_period_ends_at = new_grace_period,
    status = 'active', -- Reactivate if expired
    metadata = COALESCE(metadata, '{}'::jsonb) || 
               jsonb_build_object(
                 'extension_days', extension_days::TEXT,
                 'extension_payment_id', COALESCE(payment_intent_id_param, ''),
                 'extended_at', NOW()::TEXT
               )
  WHERE id = enrollment_id_param;
  
  RETURN new_expiry;
END;
$$ LANGUAGE plpgsql;

-- Grant access helper function
CREATE OR REPLACE FUNCTION grant_course_access(
  user_id_param UUID,
  course_id_param UUID,
  duration_days INTEGER DEFAULT NULL,
  grace_period_days INTEGER DEFAULT 7,
  payment_intent_id_param VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  enrollment_id UUID;
  expires_at_date TIMESTAMP WITH TIME ZONE;
  grace_period_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate expiration dates
  IF duration_days IS NOT NULL THEN
    expires_at_date := NOW() + (duration_days || ' days')::INTERVAL;
    grace_period_date := expires_at_date + (grace_period_days || ' days')::INTERVAL;
  ELSE
    expires_at_date := NULL;
    grace_period_date := NULL;
  END IF;
  
  -- Check for existing active enrollment
  SELECT id INTO enrollment_id
  FROM enrollments
  WHERE user_id = user_id_param
    AND course_id = course_id_param
    AND status = 'active';
  
  IF FOUND THEN
    RETURN enrollment_id;
  END IF;
  
  -- Create new enrollment
  INSERT INTO enrollments (
    user_id,
    course_id,
    status,
    enrolled_at,
    expires_at,
    grace_period_ends_at,
    payment_intent_id
  ) VALUES (
    user_id_param,
    course_id_param,
    'active',
    NOW(),
    expires_at_date,
    grace_period_date,
    payment_intent_id_param
  )
  RETURNING id INTO enrollment_id;
  
  RETURN enrollment_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_user_enrollments_with_status IS 'Get all enrollments for a user with expiration status calculated';
COMMENT ON FUNCTION has_active_course_access IS 'Check if user has active access to a specific course including grace period';
COMMENT ON FUNCTION get_expiring_enrollments IS 'Get enrollments expiring within the specified number of days';
COMMENT ON FUNCTION process_expired_enrollments IS 'Update expired enrollments to expired status (for cron jobs)';
COMMENT ON FUNCTION extend_enrollment_expiry IS 'Extend an enrollment by specified number of days';
COMMENT ON FUNCTION grant_course_access IS 'Grant course access to a user with optional expiration';
