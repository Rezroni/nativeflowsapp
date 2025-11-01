-- Add notification_preferences column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "push_enabled": true,
  "email_enabled": true,
  "analysis_complete": true,
  "subscription_expiring": true,
  "new_feature": true,
  "usage_warning": true,
  "daily_tip": false
}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.notification_preferences IS 'User notification preferences stored as JSON';
