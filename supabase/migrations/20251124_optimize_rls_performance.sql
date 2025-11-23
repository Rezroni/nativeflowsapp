-- Optimize RLS Performance with Security Definer Functions
-- This migration dramatically improves RLS query performance by:
-- 1. Creating cached helper functions that run with creator privileges
-- 2. Wrapping auth.uid() calls in SELECT to enable query plan caching
-- 3. Eliminating redundant function calls per row

-- =====================================================
-- PART 1: Create Security Definer Helper Functions
-- =====================================================

-- Create a private schema for security definer functions
CREATE SCHEMA IF NOT EXISTS private;

-- Function to get current authenticated user ID (cached)
-- SECURITY DEFINER means it runs with the privileges of the function creator
-- This bypasses RLS and can be cached by the query planner
CREATE OR REPLACE FUNCTION private.current_user_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
STABLE -- Marks function as stable (result doesn't change within a statement)
AS $$
BEGIN
  RETURN auth.uid();
END;
$$;

COMMENT ON FUNCTION private.current_user_id() IS 'Returns the current authenticated user ID. Used in RLS policies for performance.';

-- Function to check if current user is an admin
CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'admin', 'editor')
  );
END;
$$;

COMMENT ON FUNCTION private.is_admin() IS 'Checks if current user has admin privileges. Bypasses RLS on admin_roles table.';

-- Function to check if current user is super admin
CREATE OR REPLACE FUNCTION private.is_super_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  );
END;
$$;

COMMENT ON FUNCTION private.is_super_admin() IS 'Checks if current user is a super admin. Bypasses RLS on admin_roles table.';

-- =====================================================
-- PART 2: Optimize Existing RLS Policies
-- =====================================================

-- PROFILES TABLE
-- Drop old policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate with optimized functions
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
  id = (SELECT private.current_user_id())
);

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
  id = (SELECT private.current_user_id())
);

-- SUBSCRIPTIONS TABLE
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON subscriptions;

CREATE POLICY "Users can view own subscription"
ON subscriptions
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT private.current_user_id())
  OR (SELECT private.is_admin())
);

CREATE POLICY "Users can insert own subscription"
ON subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = (SELECT private.current_user_id())
);

-- ANALYSES TABLE
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can insert own analysis" ON analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;

CREATE POLICY "Users can view own analyses"
ON analyses
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT private.current_user_id())
  OR (SELECT private.is_admin())
);

CREATE POLICY "Users can insert own analysis"
ON analyses
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = (SELECT private.current_user_id())
);

CREATE POLICY "Users can update own analyses"
ON analyses
FOR UPDATE
TO authenticated
USING (
  user_id = (SELECT private.current_user_id())
);

-- USAGE_LOGS TABLE
DROP POLICY IF EXISTS "Users can view own usage logs" ON usage_logs;
DROP POLICY IF EXISTS "Users can insert own usage logs" ON usage_logs;

CREATE POLICY "Users can view own usage logs"
ON usage_logs
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT private.current_user_id())
  OR (SELECT private.is_admin())
);

CREATE POLICY "Users can insert own usage logs"
ON usage_logs
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = (SELECT private.current_user_id())
);

-- SAVED_SETUPS TABLE
DROP POLICY IF EXISTS "Users can manage own setups" ON saved_setups;
DROP POLICY IF EXISTS "Users can view own saved setups" ON saved_setups;
DROP POLICY IF EXISTS "Users can insert own saved setups" ON saved_setups;
DROP POLICY IF EXISTS "Users can update own saved setups" ON saved_setups;
DROP POLICY IF EXISTS "Users can delete own saved setups" ON saved_setups;

CREATE POLICY "Users can view own saved setups"
ON saved_setups
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT private.current_user_id())
);

CREATE POLICY "Users can insert own saved setups"
ON saved_setups
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = (SELECT private.current_user_id())
);

CREATE POLICY "Users can update own saved setups"
ON saved_setups
FOR UPDATE
TO authenticated
USING (
  user_id = (SELECT private.current_user_id())
);

CREATE POLICY "Users can delete own saved setups"
ON saved_setups
FOR DELETE
TO authenticated
USING (
  user_id = (SELECT private.current_user_id())
);

-- PUSH_SUBSCRIPTIONS TABLE
DROP POLICY IF EXISTS "Users can manage own push subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Users can view own push subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Users can insert own push subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Users can update own push subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Users can delete own push subscriptions" ON push_subscriptions;

CREATE POLICY "Users can view own push subscriptions"
ON push_subscriptions
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT private.current_user_id())
);

CREATE POLICY "Users can insert own push subscriptions"
ON push_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = (SELECT private.current_user_id())
);

CREATE POLICY "Users can update own push subscriptions"
ON push_subscriptions
FOR UPDATE
TO authenticated
USING (
  user_id = (SELECT private.current_user_id())
);

CREATE POLICY "Users can delete own push subscriptions"
ON push_subscriptions
FOR DELETE
TO authenticated
USING (
  user_id = (SELECT private.current_user_id())
);

-- BLOG_POSTS TABLE
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Editors can manage own blog posts" ON blog_posts;

CREATE POLICY "Published blog posts are viewable by everyone"
ON blog_posts
FOR SELECT
TO authenticated
USING (
  status = 'published'
  OR author_id = (SELECT private.current_user_id())
  OR (SELECT private.is_admin())
);

CREATE POLICY "Admins can manage all blog posts"
ON blog_posts
FOR ALL
TO authenticated
USING (
  (SELECT private.is_admin())
)
WITH CHECK (
  (SELECT private.is_admin())
);

-- NOTIFICATION_PREFERENCES TABLE
DROP POLICY IF EXISTS "Users can manage own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can view own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can insert own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON notification_preferences;

CREATE POLICY "Users can view own notification preferences"
ON notification_preferences
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT private.current_user_id())
);

CREATE POLICY "Users can insert own notification preferences"
ON notification_preferences
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = (SELECT private.current_user_id())
);

CREATE POLICY "Users can update own notification preferences"
ON notification_preferences
FOR UPDATE
TO authenticated
USING (
  user_id = (SELECT private.current_user_id())
);

-- =====================================================
-- PART 3: Grant Necessary Permissions
-- =====================================================

-- Grant execute permission on helper functions to authenticated users
GRANT EXECUTE ON FUNCTION private.current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_super_admin() TO authenticated;

-- =====================================================
-- PART 4: Analyze Tables for Query Planner
-- =====================================================

ANALYZE profiles;
ANALYZE subscriptions;
ANALYZE analyses;
ANALYZE usage_logs;
ANALYZE saved_setups;
ANALYZE push_subscriptions;
ANALYZE blog_posts;
ANALYZE notification_preferences;
ANALYZE admin_roles;
