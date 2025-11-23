-- Additional performance indexes for optimal query execution
-- These complement existing indexes and target frequently queried patterns

-- Index for usage logs by user and date (for analytics queries)
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_created
ON usage_logs(user_id, created_at DESC);

-- Index for saved setups by user and status (for active setups queries)
CREATE INDEX IF NOT EXISTS idx_saved_setups_user_status
ON saved_setups(user_id, status)
WHERE status IN ('active', 'triggered');

-- Index for saved setups by user with creation date (for recent setups)
CREATE INDEX IF NOT EXISTS idx_saved_setups_user_created
ON saved_setups(user_id, created_at DESC);

-- Index for saved setups by analysis_id (for setup lookups by analysis)
CREATE INDEX IF NOT EXISTS idx_saved_setups_analysis
ON saved_setups(analysis_id)
WHERE analysis_id IS NOT NULL;

-- Index for analyses by symbol and timeframe (for market analysis queries)
CREATE INDEX IF NOT EXISTS idx_analyses_symbol_timeframe
ON analyses(symbol, timeframe, created_at DESC)
WHERE symbol IS NOT NULL AND timeframe IS NOT NULL;

-- Index for analyses with feedback (for quality analytics)
CREATE INDEX IF NOT EXISTS idx_analyses_feedback
ON analyses(feedback_rating, created_at DESC)
WHERE feedback_rating IS NOT NULL;

-- Index for blog posts by published status and date
CREATE INDEX IF NOT EXISTS idx_blog_posts_published
ON blog_posts(status, published_at DESC)
WHERE status = 'published';

-- Index for admin roles lookup
CREATE INDEX IF NOT EXISTS idx_admin_roles_user
ON admin_roles(user_id, role);

-- Index for notification preferences by user
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user
ON notification_preferences(user_id);

-- Composite index for subscription with period end (for expiration checks)
CREATE INDEX IF NOT EXISTS idx_subscriptions_status_period_end
ON subscriptions(status, current_period_end)
WHERE status = 'active' AND current_period_end IS NOT NULL;

-- Add helpful comments
COMMENT ON INDEX idx_usage_logs_user_created IS 'Optimizes usage analytics queries per user';
COMMENT ON INDEX idx_saved_setups_user_status IS 'Optimizes active/triggered setup lookups';
COMMENT ON INDEX idx_saved_setups_user_created IS 'Optimizes recent setups queries';
COMMENT ON INDEX idx_saved_setups_analysis IS 'Optimizes setup lookups by analysis';
COMMENT ON INDEX idx_analyses_symbol_timeframe IS 'Optimizes market analysis queries by symbol and timeframe';
COMMENT ON INDEX idx_analyses_feedback IS 'Optimizes feedback analytics queries';
COMMENT ON INDEX idx_blog_posts_published IS 'Optimizes published blog posts queries';
COMMENT ON INDEX idx_admin_roles_user IS 'Optimizes admin role checks';
COMMENT ON INDEX idx_notification_preferences_user IS 'Optimizes notification preferences lookups';
COMMENT ON INDEX idx_subscriptions_status_period_end IS 'Optimizes subscription expiration checks';

-- Update table statistics for query planner
ANALYZE usage_logs;
ANALYZE saved_setups;
ANALYZE analyses;
ANALYZE blog_posts;
ANALYZE admin_roles;
ANALYZE notification_preferences;
ANALYZE subscriptions;
