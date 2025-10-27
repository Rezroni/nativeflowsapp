-- Add admin role to user mido304@mail.ru
-- First, you need to run the main admin and blog migration (20250127_admin_and_blog.sql)
-- Then run this script to grant admin access to your user

-- Find the user ID for mido304@mail.ru and insert admin role
INSERT INTO admin_roles (user_id, role, permissions)
SELECT
  id,
  'super_admin',
  '["read", "write", "delete", "manage_users", "manage_roles"]'::jsonb
FROM auth.users
WHERE email = 'mido304@mail.ru'
ON CONFLICT (user_id)
DO UPDATE SET
  role = 'super_admin',
  permissions = '["read", "write", "delete", "manage_users", "manage_roles"]'::jsonb,
  updated_at = now();

-- Verify the admin role was added
SELECT
  ar.role,
  ar.permissions,
  u.email,
  ar.created_at
FROM admin_roles ar
JOIN auth.users u ON u.id = ar.user_id
WHERE u.email = 'mido304@mail.ru';
