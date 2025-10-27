-- Fix analyses table to match the application code
-- The app uses 'analysis_data' and 'image_url' but the table has 'ai_analysis' and 'chart_image_url'

-- Rename columns to match application code
ALTER TABLE public.analyses
  RENAME COLUMN chart_image_url TO image_url;

ALTER TABLE public.analyses
  RENAME COLUMN ai_analysis TO analysis_data;

-- Also update the check constraint name if needed
-- No constraint needs updating for these simple renames

-- Verify the structure
COMMENT ON COLUMN public.analyses.image_url IS 'URL to the uploaded chart image';
COMMENT ON COLUMN public.analyses.analysis_data IS 'Complete AI analysis result in JSON format';
