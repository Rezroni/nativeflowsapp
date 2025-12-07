# Profile Update Error Fix

## Problem
Users are getting "Failed to update profile" error when trying to update their username or full name in the settings page.

## Root Cause
The RLS (Row Level Security) policy on the `profiles` table may not be properly configured, or the optimized version using `private.current_user_id()` might not be working correctly.

## Solution Applied

### 1. Enhanced Error Logging
Added detailed error logging to [app/api/profile/update/route.ts](app/api/profile/update/route.ts) to help debug the issue:
- Logs error code, message, and details
- Returns more specific error messages in development mode

### 2. Improved Client-Side Validation
Enhanced [components/settings/profile-form.tsx](components/settings/profile-form.tsx) with:
- Client-side validation for full name (required)
- Username format validation (alphanumeric, dashes, underscores only)
- Better error messages
- Additional error logging

### 3. Database Migration
Created migration [supabase/migrations/20251207_fix_profile_update_rls.sql](supabase/migrations/20251207_fix_profile_update_rls.sql) to:
- Replace the optimized RLS policy with a simpler, more reliable version
- Ensure the `username` column exists and has proper constraints
- Grant necessary permissions to authenticated users
- Ensure the unique constraint on username is in place

## How to Apply the Fix

### Option 1: Using Supabase CLI (Recommended)
If you have Docker installed and running:
```bash
npx supabase db push
```
Then select 'Y' to push the migrations.

### Option 2: Manual SQL Execution (If Docker is not available)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20251207_fix_profile_update_rls.sql`
4. Click "Run" to execute the migration

### Option 3: Using Supabase CLI with Remote Database
```bash
npx supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

## Testing the Fix

After applying the migration:
1. Clear your browser cache or use incognito mode
2. Log in to your account
3. Navigate to Settings
4. Try updating your username or full name
5. Check the browser console for any error messages
6. Verify the update was successful

## What to Check if Issue Persists

1. **Check Browser Console**: Look for detailed error messages
2. **Check Server Logs**: If running locally, check the terminal for server-side error logs
3. **Verify Database Connection**: Ensure your `.env.local` has correct Supabase credentials
4. **Check RLS Policies**: In Supabase dashboard, go to Database → Tables → profiles → Policies
5. **Verify Profile Exists**: Check if your profile record exists in the `profiles` table

## Additional Notes

- The error logging will now show more specific error messages in development mode
- If the username is already taken, you'll get a specific error message
- Client-side validation prevents invalid characters in usernames
- The RLS policy now uses `auth.uid()` directly instead of the optimized `private.current_user_id()` function for better compatibility
