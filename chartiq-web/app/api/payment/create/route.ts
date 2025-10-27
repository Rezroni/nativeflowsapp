import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPayment } from '@/lib/nowpayments/client'
import { getPlanById } from '@/lib/nowpayments/pricing'

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

    // Parse request body
    const body = await request.json()
    const { planId, payCurrency } = body

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    // Get plan details
    const plan = getPlanById(planId)
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    if (plan.price === 0) {
      return NextResponse.json({ error: 'Cannot create payment for free plan' }, { status: 400 })
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

    // Build payment params - only include pay_currency if it's a valid crypto (not usdt when price is USD)
    const paymentParams: any = {
      price_amount: plan.price,
      price_currency: 'usd',
      order_id: orderId,
      order_description: `${plan.name} - Monthly Subscription`,
      ipn_callback_url: `${baseUrl}/api/payment/ipn`,
      success_url: `${baseUrl}/checkout/success?order_id=${orderId}`,
      cancel_url: `${baseUrl}/pricing`,
      customer_email: profile?.email || user.email,
    }

    // Only add pay_currency if it's different from price_currency
    if (payCurrency && payCurrency.toLowerCase() !== 'usd' && payCurrency.toLowerCase() !== 'usdt') {
      paymentParams.pay_currency = payCurrency.toLowerCase()
    }

    const payment = await createPayment(paymentParams)

    // Store payment info in database
    await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan_type: planId,
      status: 'pending',
      payment_id: payment.payment_id,
      order_id: orderId,
      pay_currency: payment.pay_currency,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
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
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment' },
      { status: 500 }
    )
  }
}
