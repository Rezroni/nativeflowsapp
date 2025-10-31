-- Fix admin_roles RLS policy to allow users to view their own admin role
-- This fixes the chicken-and-egg problem where users couldn't check if they're admins

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admin roles viewable by admins only" ON public.admin_roles;

-- Create a new policy that allows users to view their own admin role
-- This allows the isAdmin() check to work properly
CREATE POLICY "Users can view their own admin role"
  ON public.admin_roles FOR SELECT
  USING (user_id = auth.uid());

-- Verification query (optional - run separately to test):
-- SELECT * FROM admin_roles WHERE user_id = auth.uid();
