'use server';

import { createClient } from '@/lib/supabase/server';
import { analyzeChartImage } from '@/lib/openai/analyze';
import { analyzeChartImageWithOpenRouter } from '@/lib/openrouter/analyze';
import { generateImageContentHash } from '@/lib/utils/image-hash';
import { cookies } from 'next/headers';
import { locales, defaultLocale } from '@/i18n/request';
import { updateCache, CacheTags } from '@/lib/cache/revalidate';

export async function analyzeChart(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const imageUrl = formData.get('imageUrl') as string;
  const additionalContext = formData.get('context') as string;

  if (!imageUrl) {
    console.error('[AnalyzeChart] Missing image URL');
    return { error: 'Image URL is required' };
  }

  try {
    console.log('[AnalyzeChart] Starting chart analysis for user:', user.id);
    console.log('[AnalyzeChart] Image URL:', imageUrl.substring(0, 100) + '...');
    console.log('[AnalyzeChart] Additional context provided:', !!additionalContext);

    // Validate that the image URL is accessible
    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
      console.error('[AnalyzeChart] Invalid image URL format (blob or data URL). Must be uploaded to storage first.');
      return { error: 'Image must be uploaded before analysis. Please try again.' };
    }

    // Get user's active subscription to determine plan type
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('plan_type, status, current_period_end')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subscriptionError) {
      console.error('[AnalyzeChart] Error fetching subscription:', subscriptionError);
    }

    // Check if user has an active subscription
    if (!subscription) {
      console.log('[AnalyzeChart] No active subscription found');
      return {
        error: 'No active subscription found. Please subscribe to a plan to start analyzing charts.',
      };
    }

    // Check if subscription is expired
    if (subscription.current_period_end && new Date(subscription.current_period_end) < new Date()) {
      console.log('[AnalyzeChart] Subscription expired:', subscription.current_period_end);
      return {
        error: 'Your subscription has expired. Please renew your subscription to continue.',
      };
    }

    const planType = subscription.plan_type as 'weekly' | 'monthly' | 'annual';
    console.log('[AnalyzeChart] User plan type:', planType);

    // Generate fast metadata-based hash for duplicate detection
    // This uses HEAD request (< 1 second) instead of downloading the entire image
    console.log('[AnalyzeChart] Generating image hash for duplicate detection...');
    const imageHash = await generateImageContentHash(imageUrl);
    console.log(`[AnalyzeChart] Image hash generated: ${imageHash.slice(0, 16)}...`);

    // Check if we have a cached analysis for this exact image
    const { data: cachedAnalyses } = await supabase
      .from('analyses')
      .select('*')
      .eq('chart_image_hash', imageHash)
      .order('created_at', { ascending: false })
      .limit(1);

    if (cachedAnalyses && cachedAnalyses.length > 0) {
      const cachedAnalysis = cachedAnalyses[0];
      console.log(`✓ Cache hit! Returning existing analysis from ${new Date(cachedAnalysis.created_at).toLocaleString()}`);

      // Return the cached analysis without counting against the limit
      // But still save a new record for this user to track their request
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('analyses')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          chart_image_hash: imageHash,
          analysis_data: cachedAnalysis.analysis_data,
          cache_hit: true,
          metadata: {
            ...cachedAnalysis.metadata,
            cacheHit: true,
            originalAnalysisId: cachedAnalysis.id,
            originalAnalysisDate: cachedAnalysis.created_at,
          },
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving cached analysis reference:', saveError);
      }

      return {
        success: true,
        analysisId: savedAnalysis?.id || cachedAnalysis.id,
        cached: true,
        message: 'This chart was analyzed before. Returning cached results for consistency.',
      };
    }

    console.log('[AnalyzeChart] ✗ Cache miss - performing new analysis');

    // Get user's locale from cookies
    const cookieStore = await cookies();
    const userLocale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;
    const locale = locales.includes(userLocale as any) ? userLocale : defaultLocale;
    console.log(`[AnalyzeChart] User locale: ${locale}`);

    // Route to appropriate AI provider based on plan type
    let analysisResult;
    try {
      if (planType === 'weekly') {
        // Weekly plan uses ONLY OpenRouter (efficient model)
        console.log(`[AnalyzeChart] Routing weekly plan user to OpenRouter (OPENROUTER_API_KEY)`);
        analysisResult = await analyzeChartImageWithOpenRouter(imageUrl, additionalContext, locale);
      } else {
        // Monthly and Annual plans use premium OpenAI/Claude
        console.log(`[AnalyzeChart] Routing ${planType} plan user to OpenAI/Claude (OPENAI_API_KEY/ANTHROPIC_API_KEY)`);
        analysisResult = await analyzeChartImage(imageUrl, additionalContext, locale);
      }
      console.log('[AnalyzeChart] AI analysis completed successfully');
    } catch (aiError) {
      console.error('[AnalyzeChart] AI analysis failed:', aiError);

      // Provide more specific error messages
      if (aiError instanceof Error) {
        if (aiError.message.includes('API key')) {
          return { error: 'AI service configuration error. Please contact support.' };
        } else if (aiError.message.includes('rate limit') || aiError.message.includes('quota')) {
          return { error: 'AI service is temporarily unavailable. Please try again in a few minutes.' };
        } else if (aiError.message.includes('timeout')) {
          return { error: 'Analysis timed out. Please try again with a clearer image.' };
        }
        return { error: `Analysis failed: ${aiError.message}` };
      }

      return { error: 'Failed to analyze chart. Please try again.' };
    }

    // Save to database with image hash
    console.log('[AnalyzeChart] Saving analysis to database...');
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        chart_image_hash: imageHash,
        analysis_data: analysisResult.analysisData,
        cache_hit: false,
      })
      .select()
      .single();

    if (saveError) {
      console.error('[AnalyzeChart] Error saving analysis:', saveError);
      return { error: 'Failed to save analysis. Please try again.' };
    }

    console.log('[AnalyzeChart] Analysis saved successfully with ID:', savedAnalysis.id);

    // Log usage
    await supabase.from('usage_logs').insert({
      user_id: user.id,
      action: 'analyze_chart',
      metadata: {
        analysis_id: savedAnalysis.id,
      },
    });

    // Revalidate cache tags for immediate updates (read-your-own-writes)
    await updateCache([
      CacheTags.USER_ANALYSES(user.id),
      CacheTags.ANALYSIS_LIST,
      CacheTags.RECENT_ANALYSES,
      CacheTags.USER_USAGE(user.id),
    ]);

    return {
      success: true,
      analysisId: savedAnalysis.id,
    };
  } catch (error) {
    console.error('[AnalyzeChart] ❌ Fatal error in analyzeChart:', error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error('[AnalyzeChart] Error name:', error.name);
      console.error('[AnalyzeChart] Error message:', error.message);
      console.error('[AnalyzeChart] Error stack:', error.stack);
    }

    // Provide user-friendly error messages
    if (error instanceof Error) {
      // Check for common error types
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return { error: 'Network error. Please check your internet connection and try again.' };
      } else if (error.message.includes('timeout')) {
        return { error: 'Request timed out. Please try again.' };
      } else if (error.message.includes('CORS')) {
        return { error: 'Image loading error. Please try uploading the image again.' };
      } else if (error.message.includes('unauthorized') || error.message.includes('Unauthorized')) {
        return { error: 'Session expired. Please refresh the page and try again.' };
      }

      // Return the actual error message for debugging (in production, you might want to hide this)
      return { error: `Analysis failed: ${error.message}` };
    }

    return { error: 'An unexpected error occurred. Please try again or contact support if the issue persists.' };
  }
}

/**
 * Upload chart image from base64 data URL
 * More reliable for camera captures on mobile devices
 *
 * IMPORTANT: This function handles large base64 data from camera photos.
 * The data URL is sent directly from the client and parsed server-side
 * to avoid FormData serialization issues on Android.
 */
export async function uploadChartImageFromDataUrl(dataUrl: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('[UploadDataUrl] Unauthorized upload attempt');
    return { error: 'Unauthorized - Please log in again' };
  }

  try {
    console.log('[UploadDataUrl] ========== Starting Data URL Upload ==========');
    console.log('[UploadDataUrl] User ID:', user.id);
    console.log('[UploadDataUrl] Data URL length:', dataUrl.length, 'characters');
    console.log('[UploadDataUrl] Estimated size:', Math.round(dataUrl.length / 1024), 'KB');

    // Validate data URL format
    if (!dataUrl || typeof dataUrl !== 'string') {
      console.error('[UploadDataUrl] Data URL is not a string:', typeof dataUrl);
      return { error: 'Invalid data format' };
    }

    if (!dataUrl.startsWith('data:image/')) {
      console.error('[UploadDataUrl] Invalid data URL format - does not start with data:image/');
      console.error('[UploadDataUrl] Actual prefix:', dataUrl.substring(0, 20));
      return { error: 'Invalid image format. Please try again.' };
    }

    // Check if data URL is suspiciously small (likely corrupted)
    if (dataUrl.length < 100) {
      console.error('[UploadDataUrl] Data URL too small - likely corrupted');
      return { error: 'Image data corrupted. Please take the photo again.' };
    }

    // Extract base64 data and mime type
    console.log('[UploadDataUrl] Parsing data URL...');
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      console.error('[UploadDataUrl] Failed to parse data URL');
      console.error('[UploadDataUrl] Data URL format:', dataUrl.substring(0, 50) + '...');
      return { error: 'Invalid image data format. Please try again.' };
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    console.log('[UploadDataUrl] ✓ Data URL parsed successfully');
    console.log('[UploadDataUrl] Mime type:', mimeType);
    console.log('[UploadDataUrl] Base64 data length:', base64Data.length, 'characters');

    // Validate mime type
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimeTypes.includes(mimeType.toLowerCase())) {
      console.error('[UploadDataUrl] Unsupported mime type:', mimeType);
      return { error: `Unsupported image format: ${mimeType}` };
    }

    // Convert base64 to buffer with error handling
    console.log('[UploadDataUrl] Converting base64 to buffer...');
    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64Data, 'base64');
      console.log('[UploadDataUrl] ✓ Buffer created successfully');
      console.log('[UploadDataUrl] Buffer size:', buffer.length, 'bytes (', Math.round(buffer.length / 1024), 'KB)');
    } catch (bufferError) {
      console.error('[UploadDataUrl] Failed to create buffer:', bufferError);
      return { error: 'Failed to process image data. Please try again.' };
    }

    // Validate buffer size
    if (buffer.length === 0) {
      console.error('[UploadDataUrl] Empty buffer - image has no data');
      return { error: 'Image data is empty. Please take the photo again.' };
    }

    // Check size limit (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (buffer.length > maxSize) {
      console.error('[UploadDataUrl] File too large:', buffer.length, 'bytes');
      console.error('[UploadDataUrl] Max allowed:', maxSize, 'bytes');
      return { error: 'Image size must be less than 10MB. Please reduce quality and try again.' };
    }

    // Warn if image is very large (might be slow)
    if (buffer.length > 5 * 1024 * 1024) {
      console.warn('[UploadDataUrl] ⚠ Large image detected:', Math.round(buffer.length / 1024 / 1024), 'MB');
      console.warn('[UploadDataUrl] Upload might take longer than usual');
    }

    // Determine file extension from mime type
    const extensionMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };

    const fileExt = extensionMap[mimeType.toLowerCase()] || 'jpg';
    const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    console.log('[UploadDataUrl] Target file:', fileName);
    console.log('[UploadDataUrl] Content type:', mimeType);

    // Upload to Supabase Storage with retry and better error handling
    let uploadError: any = null;
    let uploadAttempts = 0;
    const maxAttempts = 3; // Increased to 3 attempts for mobile reliability

    console.log('[UploadDataUrl] Starting upload to Supabase Storage...');

    while (uploadAttempts < maxAttempts) {
      uploadAttempts++;
      console.log(`[UploadDataUrl] ===== Attempt ${uploadAttempts}/${maxAttempts} =====`);

      try {
        const uploadStartTime = Date.now();

        const { error, data } = await supabase.storage
          .from('chart-images')
          .upload(fileName, buffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: mimeType,
          });

        const uploadDuration = Date.now() - uploadStartTime;
        console.log(`[UploadDataUrl] Upload attempt took ${uploadDuration}ms`);

        if (!error) {
          console.log('[UploadDataUrl] ✓ Upload successful!');
          console.log('[UploadDataUrl] Upload data:', JSON.stringify(data, null, 2));
          uploadError = null;
          break;
        }

        console.error(`[UploadDataUrl] ✗ Attempt ${uploadAttempts} failed`);
        console.error('[UploadDataUrl] Error message:', error.message);
        console.error('[UploadDataUrl] Error details:', JSON.stringify(error, null, 2));
        uploadError = error;

        // Check for specific error types that shouldn't be retried
        if (error.message?.includes('Bucket not found')) {
          console.error('[UploadDataUrl] CRITICAL: Storage bucket not configured');
          return { error: 'Storage not configured. Please contact support.' };
        }

        if (error.message?.includes('unauthorized') || error.message?.includes('Unauthorized')) {
          console.error('[UploadDataUrl] CRITICAL: Authentication failed');
          return { error: 'Session expired. Please refresh and try again.' };
        }

      } catch (exception) {
        console.error(`[UploadDataUrl] ✗ Exception during upload attempt ${uploadAttempts}:`, exception);
        uploadError = exception;
      }

      // Wait before retry with exponential backoff
      if (uploadAttempts < maxAttempts) {
        const waitTime = 1000 * uploadAttempts; // 1s, 2s, 3s
        console.log(`[UploadDataUrl] Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    if (uploadError) {
      console.error('[UploadDataUrl] ❌ All upload attempts failed!');
      console.error('[UploadDataUrl] Final error:', uploadError);

      // Provide specific error messages
      const errorMsg = uploadError.message || 'Unknown error';
      if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
        return { error: 'Network error. Please check your connection and try again.' };
      } else if (errorMsg.includes('timeout')) {
        return { error: 'Upload timed out. Please try with a smaller image.' };
      } else if (errorMsg.includes('size') || errorMsg.includes('large')) {
        return { error: 'Image too large. Please reduce quality and try again.' };
      }

      return { error: `Upload failed: ${errorMsg}` };
    }

    // Get public URL
    console.log('[UploadDataUrl] Getting public URL...');
    const {
      data: { publicUrl },
    } = supabase.storage.from('chart-images').getPublicUrl(fileName);

    console.log('[UploadDataUrl] ✓✓✓ Upload complete! ✓✓✓');
    console.log('[UploadDataUrl] Public URL:', publicUrl);
    console.log('[UploadDataUrl] File size:', Math.round(buffer.length / 1024), 'KB');

    return {
      url: publicUrl,
      fileName,
    };
  } catch (error) {
    console.error('[UploadDataUrl] ❌ Fatal unexpected error:', error);
    if (error instanceof Error) {
      console.error('[UploadDataUrl] Error name:', error.name);
      console.error('[UploadDataUrl] Error message:', error.message);
      console.error('[UploadDataUrl] Error stack:', error.stack);
      return { error: `Upload failed: ${error.message}` };
    }
    return { error: 'Failed to upload image. Please try again.' };
  }
}

export async function uploadChartImage(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('[UploadChart] Unauthorized upload attempt');
    return { error: 'Unauthorized' };
  }

  const file = formData.get('file');

  if (!file) {
    console.error('[UploadChart] No file provided in FormData');
    console.error('[UploadChart] FormData keys:', Array.from(formData.keys()));
    return { error: 'No file provided' };
  }

  // Log what we received
  console.log('[UploadChart] Received file type:', typeof file);
  console.log('[UploadChart] File constructor name:', file?.constructor?.name);

  // Validate it's actually a File or Blob object
  if (typeof file === 'string') {
    console.error('[UploadChart] File is a string, not a File object');
    return { error: 'Invalid file format. Please try again.' };
  }

  // Check if it's a valid Blob/File object
  if (!file || !(file instanceof Blob)) {
    console.error('[UploadChart] File is not a Blob or File object');
    return { error: 'Invalid file format. Please try again.' };
  }

  // Now we can safely cast to File
  const imageFile = file as File;

  try {
    console.log('[UploadChart] Starting upload for user:', user.id);
    console.log('[UploadChart] File name:', imageFile.name || 'unnamed');
    console.log('[UploadChart] File size:', imageFile.size, 'bytes');
    console.log('[UploadChart] File type:', imageFile.type || 'unknown');

    // Additional validation for empty files
    if (imageFile.size === 0) {
      console.error('[UploadChart] Empty file (0 bytes)');
      return { error: 'The file is empty. Please try taking the photo again.' };
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      console.error('[UploadChart] Invalid file type:', imageFile.type);
      return { error: 'File must be an image' };
    }

    // Validate file size (10MB limit)
    if (imageFile.size > 10 * 1024 * 1024) {
      console.error('[UploadChart] File too large:', imageFile.size);
      return { error: 'Image size must be less than 10MB' };
    }

    // Generate unique filename
    const fileExt = imageFile.name.split('.').pop() || 'jpg';
    const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    console.log('[UploadChart] Uploading to:', fileName);

    // Upload to Supabase Storage with retry logic
    let uploadError = null;
    let uploadAttempts = 0;
    const maxAttempts = 2;

    while (uploadAttempts < maxAttempts) {
      uploadAttempts++;
      console.log(`[UploadChart] Upload attempt ${uploadAttempts}/${maxAttempts}`);

      const { error } = await supabase.storage
        .from('chart-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: imageFile.type || 'image/jpeg',
        });

      if (!error) {
        console.log('[UploadChart] Upload successful');
        uploadError = null;
        break;
      }

      console.error(`[UploadChart] Upload attempt ${uploadAttempts} failed:`, error);
      uploadError = error;

      // If first attempt failed, wait a bit before retry
      if (uploadAttempts < maxAttempts) {
        console.log('[UploadChart] Waiting before retry...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (uploadError) {
      console.error('[UploadChart] All upload attempts failed:', uploadError);

      // Provide more specific error messages
      if (uploadError.message.includes('Bucket not found')) {
        return { error: 'Storage configuration error. Please contact support.' };
      } else if (uploadError.message.includes('Policy') || uploadError.message.includes('policy')) {
        return { error: 'Permission denied. Please try logging out and back in.' };
      } else if (uploadError.message.includes('size')) {
        return { error: 'File size exceeds the limit' };
      } else if (uploadError.message.includes('network') || uploadError.message.includes('fetch')) {
        return { error: 'Network error. Please check your connection and try again.' };
      }

      return { error: `Upload failed: ${uploadError.message || 'Unknown error'}. Please try again.` };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('chart-images').getPublicUrl(fileName);

    console.log('[UploadChart] Upload successful. Public URL:', publicUrl.substring(0, 100) + '...');

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('[UploadChart] ❌ Fatal error uploading chart image:', error);

    if (error instanceof Error) {
      console.error('[UploadChart] Error name:', error.name);
      console.error('[UploadChart] Error message:', error.message);
      console.error('[UploadChart] Error stack:', error.stack);

      // Provide user-friendly error messages
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return { error: 'Network error. Please check your connection and try again.' };
      } else if (error.message.includes('size') || error.message.includes('large')) {
        return { error: 'Image size must be less than 10MB' };
      } else if (error.message.includes('format') || error.message.includes('type')) {
        return { error: 'Invalid image format. Please use JPG, PNG, or similar formats.' };
      }

      return { error: `Upload failed: ${error.message}` };
    }

    return { error: 'Failed to upload chart image. Please try again.' };
  }
}

/**
 * Get user's current analysis usage and subscription info
 */
export async function getUserAnalysisUsage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  try {
    // Get user's active subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type, status, current_period_end')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const planType = subscription?.plan_type || null;
    const isActive = subscription?.status === 'active' &&
                     (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date());

    // Calculate current month's usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString());

    const monthlyCount = count || 0;

    return {
      success: true,
      tier: planType,
      monthlyCount,
      limit: -1, // All plans have unlimited analyses
      remaining: -1, // Unlimited
      hasReachedLimit: false,
      hasActiveSubscription: isActive,
    };
  } catch (error) {
    console.error('Error getting user analysis usage:', error);
    return {
      success: true,
      tier: null,
      monthlyCount: 0,
      limit: 0,
      remaining: 0,
      hasReachedLimit: true,
      hasActiveSubscription: false,
    };
  }
}
