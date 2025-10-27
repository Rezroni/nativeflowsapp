# Storage Bucket Setup Guide

## Fix: "Bucket not found" Error

If you're getting a "Bucket not found" error when uploading chart images, follow these steps:

## Quick Fix (Dashboard Method - Recommended)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Click on "Storage"** in the left sidebar
4. **Click "Create a new bucket"** button
5. **Enter bucket details**:
   - **Name**: `chart-images`
   - **Public bucket**: ✅ **CHECKED** (important!)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: Leave empty or set to `image/*`
6. **Click "Create bucket"**
7. **Test by uploading an image** in your app

## Alternative: SQL Method

If you prefer SQL, run the migration file:

1. **Open Supabase SQL Editor**: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
2. **Copy and paste** the contents of `supabase/migrations/002_storage_bucket.sql`
3. **Run the SQL**
4. **Verify** the bucket was created in Storage tab

## Storage Policies Explained

The migration sets up these policies:

- ✅ **Authenticated users can upload** images to the bucket
- ✅ **Users can read their own** images
- ✅ **Public can read** all images (for sharing analyses)
- ✅ **Users can update/delete** their own images

## Verify Setup

After creating the bucket, verify it works:

1. **Check bucket exists**: Go to Storage > You should see `chart-images` bucket
2. **Check it's public**: The bucket should have a "Public" badge
3. **Test upload**: Try uploading a chart image in your app
4. **Check image URL**: The uploaded image should have a public URL

## Troubleshooting

### Issue: Still getting "Bucket not found"
- Make sure the bucket name is exactly `chart-images` (no spaces, lowercase)
- Verify you're connected to the correct Supabase project
- Check your environment variables in `.env.local`

### Issue: Upload works but images don't display
- Make sure the bucket is marked as **Public**
- Check if RLS policies are correctly applied
- Verify the image URL is accessible in a browser

### Issue: Permission denied
- Run the storage policies from the migration file
- Make sure you're logged in (authenticated)
- Check that your user ID matches the folder structure

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## File Structure

Uploaded images follow this pattern:
```
chart-images/
  └── {user_id}/
      └── {random-uuid}.{extension}
```

Example: `chart-images/123e4567-e89b-12d3-a456-426614174000/a1b2c3d4-5678-90ef-ghij-klmnopqrstuv.png`

This ensures:
- Users can only access their own images
- No file name conflicts
- Easy user-based cleanup

## Next Steps

After fixing the storage bucket:

1. ✅ Test image upload in the Analyze page
2. ✅ Verify the image displays in the analysis results
3. ✅ Check that images appear in History page
4. ✅ Try uploading different image formats (PNG, JPG, WebP)

## Need Help?

If you're still having issues:
1. Check Supabase logs: Dashboard > Logs
2. Check browser console for errors
3. Verify network requests in DevTools
4. Check storage bucket permissions in Dashboard
