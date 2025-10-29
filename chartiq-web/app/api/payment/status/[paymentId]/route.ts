import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPaymentStatus } from '@/lib/nowpayments/client'
import { rateLimit, RateLimits, createRateLimitHeaders } from '@/lib/rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, RateLimits.api)
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

    const { paymentId } = await params

    // Verify the payment belongs to the user
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('payment_id', paymentId)
      .eq('user_id', user.id)
      .single()

    if (!subscription) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Get payment status from NOWPayments
    const paymentStatus = await getPaymentStatus(paymentId)

    return NextResponse.json({
      success: true,
      payment: paymentStatus,
    }, { headers })
  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check payment status' },
      { status: 500 }
    )
  }
}
