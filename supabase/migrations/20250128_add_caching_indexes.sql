-- Add metadata column to analyses table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'analyses'
        AND column_name = 'metadata'
    ) THEN
        ALTER TABLE public.analyses ADD COLUMN metadata jsonb;
        COMMENT ON COLUMN public.analyses.metadata IS 'Additional metadata like provider, model, tokens used, etc.';
    END IF;
END $$;

-- Create index on chart_image_hash for fast duplicate detection
CREATE INDEX IF NOT EXISTS idx_analyses_image_hash
ON public.analyses(chart_image_hash)
WHERE chart_image_hash IS NOT NULL;

-- Create index on cache_hit for analytics
CREATE INDEX IF NOT EXISTS idx_analyses_cache_hit
ON public.analyses(cache_hit);

-- Create composite index for efficient cache lookups
CREATE INDEX IF NOT EXISTS idx_analyses_hash_created
ON public.analyses(chart_image_hash, created_at DESC)
WHERE chart_image_hash IS NOT NULL;

-- Add comment for clarity
COMMENT ON INDEX idx_analyses_image_hash IS 'Fast lookup for duplicate image detection';
COMMENT ON INDEX idx_analyses_cache_hit IS 'For cache hit rate analytics';
COMMENT ON INDEX idx_analyses_hash_created IS 'Efficient cache lookup with most recent first';
