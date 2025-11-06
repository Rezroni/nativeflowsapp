-- Add unique constraint to username column to prevent race conditions
-- This ensures that usernames are unique at the database level

-- First, remove any duplicate usernames (keep the oldest one)
WITH ranked_profiles AS (
  SELECT id, username, created_at,
    ROW_NUMBER() OVER (PARTITION BY username ORDER BY created_at ASC) as rn
  FROM profiles
  WHERE username IS NOT NULL
)
UPDATE profiles
SET username = NULL
WHERE id IN (
  SELECT id FROM ranked_profiles WHERE rn > 1
);

-- Add unique constraint
ALTER TABLE profiles
ADD CONSTRAINT profiles_username_unique UNIQUE (username);

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username) WHERE username IS NOT NULL;

-- Add comment
COMMENT ON CONSTRAINT profiles_username_unique ON profiles IS 'Ensures usernames are unique across all users';
