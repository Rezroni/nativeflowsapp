import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { constructWebhookEvent } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = await constructWebhookEvent(body, signature)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any

      if (session.mode === 'subscription') {
        const userId = session.metadata?.userId
        const planType = session.metadata?.planType
        const subscriptionId = session.subscription as string
        const customerId = session.customer as string

        if (!userId || !planType) {
          console.error('Missing metadata in checkout session')
          return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
        }

        // Update subscription record
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(
              Date.now() + getPeriodDuration(planType as any)
            ).toISOString(),
          })
          .eq('stripe_session_id', session.id)

        if (error) {
          console.error('Error updating subscription:', error)
        }

        // Update user profile
        await supabase
          .from('profiles')
          .update({ subscription_tier: 'pro' })
          .eq('id', userId)
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as any // Use any for webhook data

      const status = mapStripeStatus(subscription.status)
      const userId = subscription.metadata?.userId

      if (!userId) {
        console.error('Missing userId in subscription metadata')
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      const { error } = await supabase
        .from('subscriptions')
        .update({
          status,
          current_period_start: new Date(
            subscription.current_period_start * 1000
          ).toISOString(),
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          cancel_at: subscription.cancel_at
            ? new Date(subscription.cancel_at * 1000).toISOString()
            : null,
        })
        .eq('stripe_subscription_id', subscription.id)

      if (error) {
        console.error('Error updating subscription:', error)
      }

      // Update profile tier if subscription is no longer active
      if (['canceled', 'incomplete_expired', 'unpaid'].includes(status)) {
        await supabase
          .from('profiles')
          .update({ subscription_tier: 'free' })
          .eq('id', userId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any
      const userId = subscription.metadata?.userId

      if (!userId) {
        console.error('Missing userId in subscription metadata')
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          cancel_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)

      if (error) {
        console.error('Error updating subscription:', error)
      }

      // Update profile tier
      await supabase
        .from('profiles')
        .update({ subscription_tier: 'free' })
        .eq('id', userId)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as any
      const subscriptionId = invoice.subscription as string

      if (subscriptionId) {
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', subscriptionId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

/**
 * Map Stripe subscription status to our status
 */
function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status
): string {
  const statusMap: Record<Stripe.Subscription.Status, string> = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'canceled',
    incomplete: 'incomplete',
    incomplete_expired: 'incomplete',
    unpaid: 'unpaid',
    paused: 'canceled',
  }

  return statusMap[stripeStatus] || 'incomplete'
}

/**
 * Get period duration in milliseconds
 */
function getPeriodDuration(planType: 'weekly' | 'monthly' | 'annual'): number {
  const durations = {
    weekly: 7 * 24 * 60 * 60 * 1000, // 7 days
    monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
    annual: 365 * 24 * 60 * 60 * 1000, // 365 days
  }

  return durations[planType]
}
