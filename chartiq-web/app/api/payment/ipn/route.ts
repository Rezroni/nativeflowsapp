import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyIPNSignature, type IPNCallbackData } from '@/lib/nowpayments/client'

// Use service role key for database operations from webhook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Get the signature from headers
    const signature = request.headers.get('x-nowpayments-sig')

    if (!signature) {
      console.error('Missing signature in IPN callback')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Get raw body for signature verification
    const rawBody = await request.text()

    // Verify signature
    const isValid = verifyIPNSignature(signature, rawBody)

    if (!isValid) {
      console.error('Invalid IPN signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Parse the callback data
    const callbackData: IPNCallbackData = JSON.parse(rawBody)

    console.log('IPN Callback received:', {
      payment_id: callbackData.payment_id,
      status: callbackData.payment_status,
      order_id: callbackData.order_id,
    })

    // Get subscription by order_id or payment_id
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .or(`order_id.eq.${callbackData.order_id},payment_id.eq.${callbackData.payment_id}`)
      .single()

    if (fetchError || !subscription) {
      console.error('Subscription not found:', callbackData.order_id)
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    // Handle different payment statuses
    switch (callbackData.payment_status) {
      case 'finished':
      case 'confirmed':
        // Payment successful - activate subscription
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            payment_id: callbackData.payment_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id)

        // Update user profile if needed
        await supabase
          .from('profiles')
          .update({
            subscription_tier: subscription.plan,
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.user_id)

        console.log('Subscription activated:', subscription.id)
        break

      case 'partially_paid':
        // Partially paid - update status but don't activate
        await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
            payment_id: callbackData.payment_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id)

        console.log('Subscription partially paid:', subscription.id)
        break

      case 'failed':
      case 'refunded':
      case 'expired':
        // Payment failed - cancel subscription
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            payment_id: callbackData.payment_id,
            cancel_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id)

        console.log('Subscription canceled:', subscription.id)
        break

      case 'waiting':
      case 'confirming':
      case 'sending':
        // Payment in progress - update status
        await supabase
          .from('subscriptions')
          .update({
            status: 'pending',
            payment_id: callbackData.payment_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id)

        console.log('Subscription pending:', subscription.id)
        break

      default:
        console.warn('Unknown payment status:', callbackData.payment_status)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('IPN callback error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'IPN processing failed' },
      { status: 500 }
    )
  }
}
