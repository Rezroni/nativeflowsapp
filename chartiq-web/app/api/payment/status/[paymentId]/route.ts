import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPaymentStatus } from '@/lib/nowpayments/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
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

    const { paymentId } = params

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
    })
  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check payment status' },
      { status: 500 }
    )
  }
}
