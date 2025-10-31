import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPayment } from '@/lib/nowpayments/client'
import { getPlanById } from '@/lib/nowpayments/pricing'
import { rateLimit, RateLimits, createRateLimitHeaders } from '@/lib/rate-limit'
import { createPaymentSchema, validateRequest } from '@/lib/validation/payment'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, RateLimits.payment)
    const headers = createRateLimitHeaders(rateLimitResult)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers }
      )
    }

    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = await validateRequest(createPaymentSchema, body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers })
    }

    const { planId, payCurrency } = validation.data

    // Get plan details
    const plan = getPlanById(planId)
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    // Generate unique order ID
    const orderId = `sub_${user.id}_${Date.now()}`

    // Create payment with NOWPayments
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'

    // Determine the pay currency and network
    const payCurrencyLower = payCurrency?.toLowerCase() || 'usdttrc20'
    const isUSDT = payCurrencyLower.includes('usdt') || payCurrencyLower.includes('bsc')

    // Build payment params
    const paymentParams: any = {
      price_amount: plan.price,
      // For USDT payments, both price_currency and pay_currency should be the same to avoid conversion
      // For other coins, price_currency is usdttrc20 and pay_currency is the target coin
      price_currency: isUSDT ? payCurrencyLower : 'usdttrc20',
      pay_currency: payCurrencyLower, // Always specify pay_currency
      order_id: orderId,
      order_description: `${plan.name} Subscription - ${plan.interval === 'week' ? '7 days' : plan.interval === 'month' ? '30 days' : '365 days'}`,
      ipn_callback_url: `${baseUrl}/api/payment/ipn`,
      success_url: `${baseUrl}/checkout/success?order_id=${orderId}`,
      cancel_url: `${baseUrl}/pricing`,
      customer_email: profile?.email || user.email,
    }

    const payment = await createPayment(paymentParams)

    // Calculate subscription period end based on plan interval
    const periodDays = plan.interval === 'week' ? 7 : plan.interval === 'month' ? 30 : 365
    const currentPeriodEnd = new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000).toISOString()

    // Store payment info in database
    await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan_type: planId,
      status: 'pending',
      payment_id: payment.payment_id,
      order_id: orderId,
      pay_currency: payment.pay_currency,
      current_period_start: new Date().toISOString(),
      current_period_end: currentPeriodEnd,
    })

    return NextResponse.json({
      success: true,
      payment: {
        payment_id: payment.payment_id,
        pay_address: payment.pay_address,
        pay_amount: payment.pay_amount,
        pay_currency: payment.pay_currency,
        payment_url: payment.invoice_url,
        order_id: orderId,
      },
    }, { headers })
  } catch (error) {
    console.error('Payment creation error:', error)
    // Rate limit headers not available in catch, but that's OK for errors
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment' },
      { status: 500 }
    )
  }
}
