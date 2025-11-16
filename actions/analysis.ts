'use server';

import { createClient } from '@/lib/supabase/server';
import { analyzeChartImage } from '@/lib/openai/analyze';
import { analyzeChartImageWithOpenRouter } from '@/lib/openrouter/analyze';
import { generateImageContentHash } from '@/lib/utils/image-hash';
import { redirect } from 'next/navigation';
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
    return { error: 'Image URL is required' };
  }

  try {
    // Get user's active subscription to determine plan type
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type, status, current_period_end')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Check if user has an active subscription
    if (!subscription) {
      return {
        error: 'No active subscription found. Please subscribe to a plan to start analyzing charts.',
      };
    }

    // Check if subscription is expired
    if (subscription.current_period_end && new Date(subscription.current_period_end) < new Date()) {
      return {
        error: 'Your subscription has expired. Please renew your subscription to continue.',
      };
    }

    const planType = subscription.plan_type as 'weekly' | 'monthly' | 'annual';

    // Generate image hash for duplicate detection
    console.log('Generating image hash for duplicate detection...');
    const imageHash = await generateImageContentHash(imageUrl);
    console.log(`Image hash generated: ${imageHash.slice(0, 16)}...`);

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

    console.log('✗ Cache miss - performing new analysis');

    // Get user's locale from cookies
    const cookieStore = await cookies();
    const userLocale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;
    const locale = locales.includes(userLocale as any) ? userLocale : defaultLocale;
    console.log(`User locale: ${locale}`);

    // Route to appropriate AI provider based on plan type
    let analysisResult;
    if (planType === 'weekly') {
      // Weekly plan uses ONLY OpenRouter (efficient model)
      console.log(`Routing weekly plan user to OpenRouter (OPENROUTER_API_KEY)`);
      analysisResult = await analyzeChartImageWithOpenRouter(imageUrl, additionalContext, locale);
    } else {
      // Monthly and Annual plans use premium OpenAI/Claude
      console.log(`Routing ${planType} plan user to OpenAI/Claude (OPENAI_API_KEY/ANTHROPIC_API_KEY)`);
      analysisResult = await analyzeChartImage(imageUrl, additionalContext, locale);
    }

    // Save to database with image hash
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
      console.error('Error saving analysis:', saveError);
      return { error: 'Failed to save analysis' };
    }

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
    console.error('Error analyzing chart:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to analyze chart',
    };
  }
}

export async function uploadChartImage(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const file = formData.get('file') as File;

  if (!file) {
    return { error: 'No file provided' };
  }

  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('chart-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { error: 'Failed to upload file' };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('chart-images').getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('Error uploading chart image:', error);
    return {
      error:
        error instanceof Error ? error.message : 'Failed to upload chart image',
    };
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
