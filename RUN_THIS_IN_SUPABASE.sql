-- =====================================================
-- CRITICAL FIX: Run this SQL in your Supabase SQL Editor
-- This fixes the "Database error saving new user" issue
-- =====================================================

-- Step 1: Drop the old constraints first
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

-- Step 2: Update existing data BEFORE adding new constraints
-- Convert old 'pro' to 'monthly' in subscriptions table
UPDATE subscriptions
SET plan_type = 'monthly'
WHERE plan_type = 'pro';

-- Delete 'free' plan subscriptions (free users don't need subscription records)
DELETE FROM subscriptions
WHERE plan_type = 'free';

-- Update existing profiles
-- Convert old 'pro' to 'monthly'
UPDATE profiles
SET subscription_tier = 'monthly'
WHERE subscription_tier = 'pro';

-- Set subscription_tier to NULL for free users
UPDATE profiles
SET subscription_tier = NULL
WHERE subscription_tier = 'free';

-- Step 3: Now add the new constraints after data is updated
ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_plan_type_check
CHECK (plan_type IN ('weekly', 'monthly', 'annual'));

-- For profiles, allow NULL for free users
ALTER TABLE profiles
ADD CONSTRAINT profiles_subscription_tier_check
CHECK (subscription_tier IS NULL OR subscription_tier IN ('weekly', 'monthly', 'annual'));

-- Step 4: Update the handle_new_user function to NOT create a free subscription
-- Free users won't have any subscription record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (id, email, full_name, avatar_url, subscription_tier)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    NULL  -- Free users have NULL subscription_tier
  );

  -- Don't create a subscription record for free users
  -- They will only get a subscription when they pay for a plan

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update comments
COMMENT ON COLUMN profiles.subscription_tier IS 'User subscription tier (weekly, monthly, or annual). NULL for free users.';
COMMENT ON COLUMN subscriptions.plan_type IS 'Subscription plan type (weekly, monthly, or annual)';

-- =====================================================
-- DONE! You can now sign up new users without errors
-- =====================================================
