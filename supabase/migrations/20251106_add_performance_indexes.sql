-- Add performance indexes for faster query execution
-- These indexes significantly improve query performance on frequently accessed columns

-- Index for subscription lookups by user and status
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status
ON subscriptions(user_id, status)
WHERE status = 'active';

-- Index for analyses ordered by creation date per user
CREATE INDEX IF NOT EXISTS idx_analyses_user_created
ON analyses(user_id, created_at DESC);

-- Index for recent analyses globally
CREATE INDEX IF NOT EXISTS idx_analyses_created_at
ON analyses(created_at DESC);

-- Index for push subscriptions by user
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user
ON push_subscriptions(user_id)
WHERE endpoint IS NOT NULL;

-- Add comments for documentation
COMMENT ON INDEX idx_subscriptions_user_status IS 'Optimizes subscription lookups by user and active status';
COMMENT ON INDEX idx_analyses_user_created IS 'Optimizes user analysis history queries with ordering';
COMMENT ON INDEX idx_analyses_created_at IS 'Optimizes recent analyses queries across all users';
COMMENT ON INDEX idx_push_subscriptions_user IS 'Optimizes push subscription lookups by user';

-- Analyze tables to update statistics for query planner
ANALYZE subscriptions;
ANALYZE analyses;
ANALYZE push_subscriptions;
ANALYZE profiles;
