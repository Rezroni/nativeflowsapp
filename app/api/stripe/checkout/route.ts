import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe/client'
import { getStripePriceId } from '@/lib/stripe/pricing'
import { z } from 'zod'

const checkoutSchema = z.object({
  planType: z.enum(['weekly', 'monthly', 'annual']),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    const body = await request.json()
    const { planType } = checkoutSchema.parse(body)

    // Get Stripe price ID for the plan
    const priceId = getStripePriceId(planType)

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      priceId,
      userId: user.id,
      planType,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      customerEmail: profile?.email || user.email,
    })

    // Store pending subscription in database
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_type: planType,
        status: 'incomplete',
        payment_provider: 'stripe',
        stripe_session_id: session.id,
      })

    if (subscriptionError) {
      console.error('Error creating subscription record:', subscriptionError)
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
