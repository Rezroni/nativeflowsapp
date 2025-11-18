# PWA Chart Analysis Error Fix

## Problem
Users were encountering "An unexpected error occurred" (or "Произошла непредвиденная ошибка" in Russian) when trying to analyze charts using the PWA version on iPhone.

## Root Cause Analysis
The error was caused by insufficient error handling and logging throughout the chart analysis flow. The generic error message didn't provide enough information to diagnose the specific issue. Potential causes included:

1. **Image Hash Generation Failure**: The `generateImageContentHash` function was fetching the uploaded image to create a content-based hash for duplicate detection, but network issues or timeout could cause this to fail silently.

2. **AI Provider Errors**: OpenAI/Claude/OpenRouter API calls could fail due to rate limits, network issues, or configuration problems, but weren't providing user-friendly error messages.

3. **Upload Failures**: File upload to Supabase Storage could fail due to permissions, bucket configuration, or network issues without clear feedback.

4. **Lack of Detailed Logging**: Server-side errors weren't being logged with enough detail to debug PWA-specific issues.

## Changes Made

### 1. Enhanced Image Hash Generation ([lib/utils/image-hash.ts](lib/utils/image-hash.ts))

**Improvements:**
- Added 15-second timeout for image fetching to prevent hanging
- Added detailed logging with `[ImageHash]` prefix for easy filtering
- Added proper error handling with specific error type detection (AbortError, TypeError)
- Added User-Agent header to avoid potential blocking
- Graceful fallback to URL-based hash if content fetch fails

**Key Features:**
```typescript
// Timeout protection
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 15000);

// Detailed error logging
console.log('[ImageHash] Attempting to fetch image from:', imageUrl);
console.error('[ImageHash] Error name:', error.name);
console.error('[ImageHash] Fetch timed out after 15 seconds');

// Graceful fallback
return generateImageHash(imageUrl); // URL-based hash as fallback
```

### 2. Improved Analysis Action Error Handling ([actions/analysis.ts](actions/analysis.ts))

**Improvements:**
- Added comprehensive logging with `[AnalyzeChart]` prefix
- Added try-catch block around AI provider calls
- Provided specific error messages based on error types:
  - API key configuration errors
  - Rate limit/quota errors
  - Timeout errors
  - Generic analysis failures
- Log subscription status and user information
- Enhanced database error handling

**Key Features:**
```typescript
try {
  analysisResult = await analyzeChartImage(imageUrl, additionalContext, locale);
  console.log('[AnalyzeChart] AI analysis completed successfully');
} catch (aiError) {
  // Specific error handling
  if (aiError.message.includes('API key')) {
    return { error: 'AI service configuration error. Please contact support.' };
  } else if (aiError.message.includes('rate limit')) {
    return { error: 'AI service is temporarily unavailable. Please try again in a few minutes.' };
  }
  // ... more error cases
}
```

### 3. Enhanced Upload Function ([actions/analysis.ts](actions/analysis.ts))

**Improvements:**
- Added detailed logging with `[UploadChart]` prefix
- Server-side file type validation
- Server-side file size validation
- Specific error messages for:
  - Bucket not found (configuration issue)
  - Policy errors (permission issues)
  - Size limit exceeded
- Log file metadata (name, size, type)

**Key Features:**
```typescript
console.log('[UploadChart] File name:', file.name);
console.log('[UploadChart] File size:', file.size, 'bytes');
console.log('[UploadChart] File type:', file.type);

// Specific error handling
if (error.message.includes('Bucket not found')) {
  return { error: 'Storage configuration error. Please contact support.' };
}
```

### 4. Enhanced OpenAI Provider Logging ([lib/openai/analyze.ts](lib/openai/analyze.ts))

**Improvements:**
- Added detailed logging with `[OpenAI]` prefix for each step
- Log image URL being analyzed
- Log API request/response status
- Enhanced error logging with error name and message
- Better JSON parsing error handling

## How to Debug Future Issues

### 1. Check Server Logs

When a user reports an error, check the server logs for these tagged messages:

```bash
# Filter by component
grep "\[ImageHash\]" logs
grep "\[AnalyzeChart\]" logs
grep "\[UploadChart\]" logs
grep "\[OpenAI\]" logs
```

### 2. Common Error Patterns

**Image Hash Timeout:**
```
[ImageHash] Fetch timed out after 15 seconds
[ImageHash] Falling back to URL-based hash
```
→ Network connectivity issue or very slow image server response

**Upload Failure:**
```
[UploadChart] Error uploading file: Bucket not found
```
→ Supabase Storage bucket 'chart-images' not configured

**AI Provider Error:**
```
[OpenAI] Analysis failed: Error: rate limit exceeded
[AnalyzeChart] AI analysis failed: rate limit
```
→ OpenAI rate limit reached, need to wait or upgrade plan

**Subscription Issue:**
```
[AnalyzeChart] No active subscription found
```
→ User doesn't have an active subscription

### 3. Testing Checklist

To verify the fix works:

1. ✅ **Test on iPhone PWA:**
   - Open the PWA on iPhone
   - Take a photo using camera
   - Upload and analyze
   - Check for successful analysis

2. ✅ **Test Error Cases:**
   - Try with very large image (>10MB) → Should show size error
   - Try with invalid file type → Should show type error
   - Try without subscription → Should show subscription error

3. ✅ **Check Server Logs:**
   - Verify all log messages appear with proper tags
   - Verify error messages are user-friendly
   - Verify fallback mechanisms work

### 4. User-Friendly Error Messages

Users will now see specific error messages instead of generic ones:

| Error Type | User Message |
|------------|-------------|
| API Configuration | "AI service configuration error. Please contact support." |
| Rate Limit | "AI service is temporarily unavailable. Please try again in a few minutes." |
| Timeout | "Analysis timed out. Please try again with a clearer image." |
| Upload - Invalid Type | "File must be an image" |
| Upload - Too Large | "Image size must be less than 10MB" |
| Upload - Storage Config | "Storage configuration error. Please contact support." |
| Upload - Permission | "Permission denied. Please check your account." |
| No Subscription | "No active subscription found. Please subscribe to a plan to start analyzing charts." |
| Expired Subscription | "Your subscription has expired. Please renew your subscription to continue." |

## Monitoring

### Key Metrics to Monitor

1. **Success Rate**: Track how many analyses complete successfully vs fail
2. **Error Types**: Count occurrences of each error type
3. **Performance**: Monitor image hash generation time
4. **Fallback Usage**: Track how often URL-based hash is used instead of content hash

### Analytics Events

The app already tracks these events via Mixpanel:
- `chartUploaded` - When user selects an image
- `analysisStarted` - When analysis begins
- `analysisCompleted` - When analysis succeeds (with duration)
- `analysisFailed` - When analysis fails (with error message)

## Next Steps

1. **Deploy the changes** to production
2. **Monitor server logs** for the new tagged messages
3. **Test on iPhone PWA** to verify the fix works
4. **Collect user feedback** to ensure error messages are helpful
5. **Consider adding**:
   - Retry mechanism for failed image fetches
   - Progress indicator showing which step failed
   - Automatic error reporting to admin dashboard

## Files Changed

- [lib/utils/image-hash.ts](lib/utils/image-hash.ts) - Enhanced image hash generation with timeout and logging
- [actions/analysis.ts](actions/analysis.ts) - Improved error handling for upload and analysis
- [lib/openai/analyze.ts](lib/openai/analyze.ts) - Enhanced OpenAI provider logging

## Additional Notes

- The image hash generation now has a 15-second timeout, so worst-case scenario is a 15-second delay before fallback
- All server-side validations are duplicated from client-side for security
- Error messages are intentionally vague for security-related issues (e.g., "Please contact support" instead of exposing internal details)
- Logging includes truncated URLs/content to avoid excessive log size
