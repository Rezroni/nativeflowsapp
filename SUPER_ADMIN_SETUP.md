# Super Admin Setup Instructions

This guide explains how to grant super admin access to Mokhamedrezk@gmail.com.

## Prerequisites

1. The user with email `Mokhamedrezk@gmail.com` must have signed up for an account first
2. Access to your Supabase project dashboard

## Method 1: Using Supabase Dashboard (Recommended)

1. **Login to Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration SQL**
   - Copy the contents of `supabase/migrations/20250131_add_super_admin_mokhamedrezk.sql`
   - Paste it into the SQL editor
   - Click "Run" or press Ctrl+Enter

4. **Verify the Admin Role**
   - Run this verification query in the SQL editor:
   ```sql
   SELECT
     ar.role,
     ar.permissions,
     p.email,
     ar.created_at
   FROM admin_roles ar
   JOIN profiles p ON p.id = ar.user_id
   WHERE p.email = 'Mokhamedrezk@gmail.com';
   ```
   - You should see one row with role = 'super_admin'

## Method 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
supabase db push
```

## Method 3: Manual Insert (if user already exists)

If the above method doesn't work, you can manually insert the admin role:

1. First, get the user's ID from the profiles table:
   ```sql
   SELECT id, email FROM profiles WHERE email = 'Mokhamedrezk@gmail.com';
   ```

2. Copy the user's ID and insert into admin_roles:
   ```sql
   INSERT INTO admin_roles (user_id, role, permissions)
   VALUES (
     'PASTE_USER_ID_HERE',
     'super_admin',
     '["read", "write", "delete", "manage_users", "manage_roles", "manage_subscriptions", "manage_analytics"]'::jsonb
   );
   ```

## What the Super Admin Can Do

The super admin role has the following permissions:
- **read**: View all data and analytics
- **write**: Create and update blog posts, users, subscriptions
- **delete**: Delete blog posts, comments, and other content
- **manage_users**: Manage user accounts and profiles
- **manage_roles**: Grant admin roles to other users
- **manage_subscriptions**: Manage user subscriptions and plans
- **manage_analytics**: Access analytics dashboard and reports

## Accessing the Admin Dashboard

Once the super admin role is granted, the user can access the admin dashboard at:
```
https://your-domain.com/admin
```

## Troubleshooting

### User Not Found Error
If you get an error that the user doesn't exist:
1. Make sure `Mokhamedrezk@gmail.com` has signed up for an account
2. Check the exact spelling of the email (it's case-sensitive in some databases)
3. Verify the user exists in the `profiles` table

### Permission Denied Error
If you get a permission denied error:
1. Make sure you're logged in as a database admin in Supabase
2. Try running the query in the Supabase SQL Editor with admin privileges

### Migration Already Applied
If the migration file has already been applied:
- The SQL uses `ON CONFLICT DO UPDATE`, so it's safe to run multiple times
- It will simply update the existing role to super_admin

## Security Notes

⚠️ **Important Security Considerations:**
- Super admins have full access to all data and functionality
- Only grant super admin access to trusted individuals
- Consider enabling 2FA for super admin accounts
- Regularly audit admin access logs
- Keep the list of super admins minimal

## Next Steps

After creating the super admin:
1. Have the user sign in with `Mokhamedrezk@gmail.com`
2. Navigate to `/admin` to access the admin dashboard
3. Verify all admin features are accessible
4. Review and update admin permissions as needed
