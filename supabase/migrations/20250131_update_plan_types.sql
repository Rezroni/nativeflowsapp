-- Update plan_type constraint to include new pricing tiers
-- This migration updates the database schema to match the new pricing structure:
-- weekly, monthly, and annual plans

-- Step 1: Drop the old constraints first
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

-- Step 2: Update existing data BEFORE adding new constraints
-- Convert old 'free' and 'pro' to new pricing tiers in subscriptions table
-- 'pro' users will be converted to 'monthly' (most common plan)
UPDATE subscriptions
SET plan_type = 'monthly'
WHERE plan_type = 'pro';

-- Delete 'free' plan subscriptions (free users don't need subscription records)
-- They will be handled by the trial system
DELETE FROM subscriptions
WHERE plan_type = 'free';

-- Update existing profiles
-- Convert old 'pro' to 'monthly'
UPDATE profiles
SET subscription_tier = 'monthly'
WHERE subscription_tier = 'pro';

-- Set subscription_tier to NULL for free users (they don't have a paid plan)
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

-- Update comment
COMMENT ON COLUMN profiles.subscription_tier IS 'User subscription tier (weekly, monthly, or annual). NULL for free users.';
COMMENT ON COLUMN subscriptions.plan_type IS 'Subscription plan type (weekly, monthly, or annual)';
