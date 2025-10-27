'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Cancel user subscription
 */
export async function cancelSubscription() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  try {
    // Update subscription status to canceled
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        cancel_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (updateError) {
      throw updateError
    }

    // Update user profile
    await supabase
      .from('profiles')
      .update({
        subscription_tier: 'free',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    revalidatePath('/settings')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to cancel subscription',
    }
  }
}

/**
 * Get current subscription status
 */
export async function getSubscriptionStatus() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned"
      throw error
    }

    return { subscription: subscription || null }
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to get subscription status',
    }
  }
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  try {
    const { data: subscription} = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    return !!subscription
  } catch {
    return false
  }
}

/**
 * Get user's current plan limits
 */
export async function getUserPlanLimits() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    const tier = profile?.subscription_tier || 'free'

    // Define plan limits
    const limits = {
      free: {
        analysesPerMonth: 5,
        trialDays: 3,
      },
      pro: {
        analysesPerMonth: -1, // unlimited
        trialDays: 0,
      },
    }

    return { limits: limits[tier as keyof typeof limits] || limits.free }
  } catch (error) {
    console.error('Error getting plan limits:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to get plan limits',
    }
  }
}
