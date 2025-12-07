-- Fix profile update RLS policy to ensure authenticated users can update their own profiles
-- This migration ensures the RLS policy allows profile updates without the private schema optimization

-- Drop the existing optimized policy that might be causing issues
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate with a simpler, more reliable policy that doesn't depend on private schema
-- This uses auth.uid() directly which is fully supported
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Ensure username column exists and has proper constraints
DO $$
BEGIN
  -- Check if username column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'username'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN username text;
  END IF;
END $$;

-- Ensure unique constraint exists (try to add, ignore if exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
    AND table_name = 'profiles'
    AND constraint_name = 'profiles_username_unique'
    AND constraint_type = 'UNIQUE'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Constraint already exists, ignore
END $$;

-- Create index for username lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username) WHERE username IS NOT NULL;

-- Ensure authenticated role has UPDATE permission
GRANT UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;

-- Re-analyze table for query planner
ANALYZE public.profiles;
