-- Authentication Tables Migration
-- Creates tables for login attempts, remember me tokens, and user sessions

-- Login Attempts Table
-- Tracks login attempts for security and lockout functionality
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_login_attempts_user_id ON login_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted_at ON login_attempts(attempted_at);

-- Remember Me Tokens Table
-- Stores secure tokens for "Remember Me" functionality
CREATE TABLE IF NOT EXISTS remember_me_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  device_info TEXT,
  ip_address TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  last_used_at TIMESTAMPTZ,
  revoked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_remember_me_user_id ON remember_me_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_remember_me_token_hash ON remember_me_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_remember_me_expires_at ON remember_me_tokens(expires_at);

-- User Sessions Table
-- Tracks active sessions across multiple devices
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_info TEXT,
  ip_address TEXT,
  last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity);

-- Add columns to profiles table for account lockout
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lock_reason TEXT;

-- Add index for locked accounts
CREATE INDEX IF NOT EXISTS idx_profiles_locked_until ON profiles(locked_until);

-- Function to clean up expired sessions and tokens
CREATE OR REPLACE FUNCTION cleanup_expired_auth_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete expired sessions
  DELETE FROM user_sessions
  WHERE expires_at < NOW();

  -- Delete expired remember me tokens
  DELETE FROM remember_me_tokens
  WHERE expires_at < NOW();

  -- Delete old login attempts (older than 30 days)
  DELETE FROM login_attempts
  WHERE attempted_at < NOW() - INTERVAL '30 days';

  -- Clear expired account locks
  UPDATE profiles
  SET locked_until = NULL, lock_reason = NULL
  WHERE locked_until IS NOT NULL AND locked_until < NOW();
END;
$$;

-- Enable Row Level Security
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE remember_me_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for login_attempts
CREATE POLICY "Users can view their own login attempts"
  ON login_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert login attempts"
  ON login_attempts
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for remember_me_tokens
CREATE POLICY "Users can view their own remember me tokens"
  ON remember_me_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own remember me tokens"
  ON remember_me_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage remember me tokens"
  ON remember_me_tokens
  FOR ALL
  USING (true);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions"
  ON user_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON user_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage sessions"
  ON user_sessions
  FOR ALL
  USING (true);

-- Create a scheduled job to cleanup expired data (requires pg_cron extension)
-- This is optional and requires pg_cron to be enabled
-- SELECT cron.schedule(
--   'cleanup-expired-auth-data',
--   '0 2 * * *', -- Run at 2 AM every day
--   'SELECT cleanup_expired_auth_data();'
-- );

COMMENT ON TABLE login_attempts IS 'Tracks login attempts for security monitoring and account lockout';
COMMENT ON TABLE remember_me_tokens IS 'Stores secure tokens for Remember Me functionality';
COMMENT ON TABLE user_sessions IS 'Tracks active user sessions across multiple devices';
COMMENT ON FUNCTION cleanup_expired_auth_data() IS 'Cleans up expired sessions, tokens, and old login attempts';
