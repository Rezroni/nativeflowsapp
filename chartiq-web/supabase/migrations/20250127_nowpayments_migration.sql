-- Migration to support NOWPayments instead of Stripe
-- This updates the subscriptions table to work with NOWPayments

-- Add NOWPayments specific columns to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS order_id TEXT,
ADD COLUMN IF NOT EXISTS pay_currency TEXT,
ADD COLUMN IF NOT EXISTS pay_amount DECIMAL(20, 8),
ADD COLUMN IF NOT EXISTS cancel_at TIMESTAMP WITH TIME ZONE;

-- Add subscription_tier column to profiles table if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';

-- Create unique index on order_id (instead of constraint to avoid conflicts)
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_order_id_unique ON subscriptions(order_id) WHERE order_id IS NOT NULL;

-- Remove Stripe-specific columns (if they exist)
ALTER TABLE subscriptions
DROP COLUMN IF EXISTS stripe_customer_id,
DROP COLUMN IF EXISTS stripe_subscription_id,
DROP COLUMN IF EXISTS stripe_price_id;

-- Update plan_type constraint to only include 'free' and 'pro'
DO $$
BEGIN
  -- Drop the old constraint if it exists
  ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

  -- Add new constraint with updated plans
  ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_plan_type_check
  CHECK (plan_type IN ('free', 'pro'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Update subscription status constraint to include NOWPayments statuses
DO $$
BEGIN
  -- Drop the old constraint if it exists
  ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;

  -- Add new constraint with updated statuses
  ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_status_check
  CHECK (status IN ('trialing', 'active', 'canceled', 'past_due', 'pending', 'incomplete', 'unpaid'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Update profiles table subscription_tier constraint to reflect new tiers
DO $$
BEGIN
  -- Drop the old constraint if it exists
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

  -- Add new constraint with updated tiers
  ALTER TABLE profiles
  ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'pro'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_payment_id ON subscriptions(payment_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_order_id ON subscriptions(order_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);

-- Update existing subscriptions with plan_type that's not 'free' or 'pro'
-- Convert 'monthly' and 'annual' to 'pro'
UPDATE subscriptions
SET plan_type = 'pro'
WHERE plan_type NOT IN ('free', 'pro');

-- Update existing profiles with subscription_tier that's not 'free' or 'pro'
UPDATE profiles
SET subscription_tier = 'pro'
WHERE subscription_tier IS NOT NULL
  AND subscription_tier NOT IN ('free', 'pro');

-- Set subscription_tier to 'free' for profiles that don't have it set
UPDATE profiles
SET subscription_tier = 'free'
WHERE subscription_tier IS NULL;

-- Add comments to new columns
COMMENT ON COLUMN subscriptions.payment_id IS 'NOWPayments payment ID';
COMMENT ON COLUMN subscriptions.order_id IS 'Unique order identifier for NOWPayments';
COMMENT ON COLUMN subscriptions.pay_currency IS 'Cryptocurrency used for payment (e.g., btc, eth, usdt)';
COMMENT ON COLUMN subscriptions.pay_amount IS 'Amount paid in cryptocurrency';
COMMENT ON COLUMN subscriptions.cancel_at IS 'Timestamp when subscription should be canceled';
COMMENT ON COLUMN profiles.subscription_tier IS 'User subscription tier (free or pro)';

-- Update the handle_new_user function to use 'free' with 3-day trial
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  insert into public.profiles (id, email, full_name, avatar_url, subscription_tier)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'free'
  );

  -- Create initial free subscription with 3-day trial
  insert into public.subscriptions (
    user_id,
    status,
    plan_type,
    trial_start,
    trial_end,
    current_period_start,
    current_period_end
  )
  values (
    new.id,
    'trialing',
    'free',
    now(),
    now() + interval '3 days',  -- 3-day trial
    now(),
    now() + interval '3 days'
  );

  return new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
