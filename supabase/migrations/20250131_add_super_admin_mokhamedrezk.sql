-- Add super admin role to user Mokhamedrezk@gmail.com
-- This migration grants super admin access to Mokhamedrezk@gmail.com

-- Insert super admin role for Mokhamedrezk@gmail.com
-- Using INSERT ON CONFLICT to handle case where user might not exist yet
-- The admin_roles table references profiles(id), which in turn references auth.users(id)
INSERT INTO admin_roles (user_id, role, permissions)
SELECT
  p.id,
  'super_admin',
  '["read", "write", "delete", "manage_users", "manage_roles", "manage_subscriptions", "manage_analytics"]'::jsonb
FROM profiles p
WHERE p.email = 'Mokhamedrezk@gmail.com'
ON CONFLICT (user_id)
DO UPDATE SET
  role = 'super_admin',
  permissions = '["read", "write", "delete", "manage_users", "manage_roles", "manage_subscriptions", "manage_analytics"]'::jsonb,
  updated_at = now();

-- Verify the admin role was added (optional - for checking)
-- You can run this query separately to verify:
-- SELECT
--   ar.role,
--   ar.permissions,
--   p.email,
--   ar.created_at
-- FROM admin_roles ar
-- JOIN profiles p ON p.id = ar.user_id
-- WHERE p.email = 'Mokhamedrezk@gmail.com';
