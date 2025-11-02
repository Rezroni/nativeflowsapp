-- Add username and subscription_tier columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS subscription_tier text CHECK (subscription_tier IN ('free', 'pro', 'premium')) DEFAULT 'free';

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Update existing users to have a default username based on their email
UPDATE public.profiles
SET username = SPLIT_PART(email, '@', 1)
WHERE username IS NULL AND email IS NOT NULL;
