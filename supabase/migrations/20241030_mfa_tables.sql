-- MFA Tables Migration
-- Creates tables for MFA enrollment, challenges, trusted devices, and recovery

-- MFA Enrollments Table
-- Stores MFA configuration for users
CREATE TABLE IF NOT EXISTS mfa_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  secret_encrypted TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'disabled')),
  method TEXT NOT NULL CHECK (method IN ('totp', 'sms', 'email')),
  backup_codes TEXT[],
  enrolled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_mfa_enrollments_user_id ON mfa_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_enrollments_status ON mfa_enrollments(status);

-- MFA Attempts Table
-- Tracks MFA verification attempts
CREATE TABLE IF NOT EXISTS mfa_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  success BOOLEAN NOT NULL DEFAULT false,
  device_info TEXT,
  ip_address TEXT,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_mfa_attempts_user_id ON mfa_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_attempts_attempted_at ON mfa_attempts(attempted_at);

-- Trusted Devices Table
-- Stores devices that are trusted for MFA bypass
CREATE TABLE IF NOT EXISTS trusted_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL UNIQUE,
  device_info TEXT,
  ip_address TEXT,
  trusted BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_trusted_devices_user_id ON trusted_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_device_id ON trusted_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_expires_at ON trusted_devices(expires_at);

-- MFA Recovery Tokens Table
-- Stores recovery tokens for MFA reset
CREATE TABLE IF NOT EXISTS mfa_recovery_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_mfa_recovery_tokens_user_id ON mfa_recovery_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_recovery_tokens_token_hash ON mfa_recovery_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_mfa_recovery_tokens_expires_at ON mfa_recovery_tokens(expires_at);

-- MFA Email Codes Table
-- Stores temporary email verification codes for MFA fallback
CREATE TABLE IF NOT EXISTS mfa_email_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_mfa_email_codes_user_id ON mfa_email_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_email_codes_expires_at ON mfa_email_codes(expires_at);

-- Add MFA enabled flag to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN NOT NULL DEFAULT false;

-- Add index for MFA enabled users
CREATE INDEX IF NOT EXISTS idx_profiles_mfa_enabled ON profiles(mfa_enabled) WHERE mfa_enabled = true;

-- Function to clean up expired MFA data
CREATE OR REPLACE FUNCTION cleanup_expired_mfa_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete expired trusted devices
  DELETE FROM trusted_devices
  WHERE expires_at < NOW();

  -- Delete expired recovery tokens
  DELETE FROM mfa_recovery_tokens
  WHERE expires_at < NOW();

  -- Delete expired email codes
  DELETE FROM mfa_email_codes
  WHERE expires_at < NOW();

  -- Delete old MFA attempts (older than 90 days)
  DELETE FROM mfa_attempts
  WHERE attempted_at < NOW() - INTERVAL '90 days';
END;
$$;

-- Function to check if user has low backup codes
CREATE OR REPLACE FUNCTION check_low_backup_codes()
RETURNS TABLE (user_id UUID, remaining_codes INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.user_id,
    COALESCE(array_length(m.backup_codes, 1), 0) as remaining_codes
  FROM mfa_enrollments m
  WHERE m.status = 'active'
    AND COALESCE(array_length(m.backup_codes, 1), 0) <= 3
    AND COALESCE(array_length(m.backup_codes, 1), 0) > 0;
END;
$$;

-- Enable Row Level Security
ALTER TABLE mfa_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_recovery_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_email_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mfa_enrollments
CREATE POLICY "Users can view their own MFA enrollment"
  ON mfa_enrollments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own MFA enrollment"
  ON mfa_enrollments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage MFA enrollments"
  ON mfa_enrollments
  FOR ALL
  USING (true);

-- RLS Policies for mfa_attempts
CREATE POLICY "Users can view their own MFA attempts"
  ON mfa_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert MFA attempts"
  ON mfa_attempts
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for trusted_devices
CREATE POLICY "Users can view their own trusted devices"
  ON trusted_devices
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trusted devices"
  ON trusted_devices
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage trusted devices"
  ON trusted_devices
  FOR ALL
  USING (true);

-- RLS Policies for mfa_recovery_tokens
CREATE POLICY "System can manage MFA recovery tokens"
  ON mfa_recovery_tokens
  FOR ALL
  USING (true);

-- RLS Policies for mfa_email_codes
CREATE POLICY "System can manage MFA email codes"
  ON mfa_email_codes
  FOR ALL
  USING (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mfa_enrollments_updated_at
  BEFORE UPDATE ON mfa_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a scheduled job to cleanup expired data (requires pg_cron extension)
-- This is optional and requires pg_cron to be enabled
-- SELECT cron.schedule(
--   'cleanup-expired-mfa-data',
--   '0 3 * * *', -- Run at 3 AM every day
--   'SELECT cleanup_expired_mfa_data();'
-- );

COMMENT ON TABLE mfa_enrollments IS 'Stores MFA configuration and secrets for users';
COMMENT ON TABLE mfa_attempts IS 'Tracks MFA verification attempts for security monitoring';
COMMENT ON TABLE trusted_devices IS 'Stores devices trusted for MFA bypass';
COMMENT ON TABLE mfa_recovery_tokens IS 'Temporary tokens for MFA recovery process';
COMMENT ON TABLE mfa_email_codes IS 'Temporary email verification codes for MFA fallback';
COMMENT ON FUNCTION cleanup_expired_mfa_data() IS 'Cleans up expired MFA-related data';
COMMENT ON FUNCTION check_low_backup_codes() IS 'Returns users with 3 or fewer backup codes remaining';
