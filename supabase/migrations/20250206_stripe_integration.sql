-- Add Stripe integration fields to subscriptions table
-- This migration adds support for dual payment providers (crypto + Stripe)

-- Add payment provider column
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'nowpayments' CHECK (payment_provider IN ('nowpayments', 'stripe'));

-- Add Stripe-specific columns
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Create indexes for Stripe columns
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer
ON subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription
ON subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_payment_provider
ON subscriptions(payment_provider);

-- Add unique constraint for Stripe subscription ID
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_unique
ON subscriptions(stripe_subscription_id)
WHERE stripe_subscription_id IS NOT NULL;

-- Comment the new columns
COMMENT ON COLUMN subscriptions.payment_provider IS 'Payment provider used: nowpayments (crypto) or stripe (card)';
COMMENT ON COLUMN subscriptions.stripe_customer_id IS 'Stripe customer ID';
COMMENT ON COLUMN subscriptions.stripe_subscription_id IS 'Stripe subscription ID';
COMMENT ON COLUMN subscriptions.stripe_session_id IS 'Stripe checkout session ID';
