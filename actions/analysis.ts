'use server';

import { createClient } from '@/lib/supabase/server';
import { analyzeChartImage } from '@/lib/openai/analyze';
import { analyzeChartImageWithOpenRouter } from '@/lib/openrouter/analyze';
import { generateImageContentHash, generateImageHash } from '@/lib/utils/image-hash';
import { cookies } from 'next/headers';
import { locales, defaultLocale } from '@/i18n/request';

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

    // Generate image hash for duplicate detection with timeout protection
    console.log('[AnalyzeChart] Generating image hash for duplicate detection...');
    let imageHash: string;
    try {
      imageHash = await Promise.race([
        generateImageContentHash(imageUrl),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('Hash generation timeout')), 20000)
        )
      ]);
      console.log(`[AnalyzeChart] Image hash generated: ${imageHash.slice(0, 16)}...`);
    } catch (hashError) {
      console.error('[AnalyzeChart] Hash generation failed, using fallback:', hashError);
      // Use URL-based hash as fallback
      imageHash = generateImageHash(imageUrl);
      console.log(`[AnalyzeChart] Using fallback hash: ${imageHash.slice(0, 16)}...`);
    }

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
