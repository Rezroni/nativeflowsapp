'use server';

import { createClient } from '@/lib/supabase/server';
import { analyzeChartImage } from '@/lib/openai/analyze';
import { redirect } from 'next/navigation';

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
    // Check subscription and usage limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Calculate current month's usage
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString());

    const planLimits = {
      free: 5,
      pro_monthly: 100,
      pro_annual: 100,
      enterprise: 999999,
    };

    const currentPlan = subscription?.plan_id || 'free';
    const limit = planLimits[currentPlan as keyof typeof planLimits] || 5;

    if (count && count >= limit) {
      return {
        error: `You've reached your monthly limit of ${limit} analyses. Please upgrade your plan.`,
      };
    }

    // Perform analysis
    const analysisResult = await analyzeChartImage(imageUrl, additionalContext);

    // Save to database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        analysis_data: analysisResult.analysisData,
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
