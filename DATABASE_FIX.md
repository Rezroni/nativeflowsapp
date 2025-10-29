# Database Column Fix

## Issue
Error: `Could not find the 'analysis_data' column of 'analyses' in the schema cache`

## Root Cause
The database table uses different column names than the application code:
- Database has: `chart_image_url`, `ai_analysis`
- App expects: `image_url`, `analysis_data`

## Quick Fix

Run this SQL in your **Supabase SQL Editor**:

```sql
-- Rename columns to match application code
ALTER TABLE public.analyses
  RENAME COLUMN chart_image_url TO image_url;

ALTER TABLE public.analyses
  RENAME COLUMN ai_analysis TO analysis_data;

-- Add comments for clarity
COMMENT ON COLUMN public.analyses.image_url IS 'URL to the uploaded chart image';
COMMENT ON COLUMN public.analyses.analysis_data IS 'Complete AI analysis result in JSON format';
```

## Steps

1. **Open Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to SQL Editor** (left sidebar)
4. **Paste the SQL above**
5. **Click "Run"**
6. **Verify**: Go to Table Editor → analyses → Check column names

## Alternative: Run Migration

The fix is also available as a migration file:

```bash
# Copy the migration file content and run it in Supabase SQL Editor
cat supabase/migrations/003_fix_analyses_columns.sql
```

## Verification

After running the SQL, check that the `analyses` table has these columns:
- ✅ `id` (uuid)
- ✅ `user_id` (uuid)
- ✅ `image_url` (text) ← **Was chart_image_url**
- ✅ `analysis_data` (jsonb) ← **Was ai_analysis**
- ✅ `created_at` (timestamp)
- And other columns...

## Test Again

1. Restart your dev server (if running)
2. Upload a chart at /analyze
3. Should now work!

## Console Logs to Expect

```
Using Claude AI for analysis...
Analysis complete!
```

## Still Having Issues?

### Error: "relation 'analyses' does not exist"
**Solution**: Run the main migration first: `001_initial_schema.sql`

### Error: Column already exists
**Solution**: The fix was already applied, try analyzing a chart

### Error: Permission denied
**Solution**: Make sure RLS policies are set up correctly (they should be from migration 001)

## Next Steps

After this fix:
1. ✅ Upload a chart
2. ✅ Wait for AI analysis
3. ✅ Check that analysis saves to database
4. ✅ Verify it appears in History page
