'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const paymentId = searchParams.get('id')

  const [loading, setLoading] = useState(true)
  const [payment, setPayment] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchPaymentStatus = async () => {
    if (!paymentId) return

    try {
      const response = await fetch(`/api/payment/status/${paymentId}`)
      const data = await response.json()

      if (response.ok && data.payment) {
        setPayment(data.payment)
        setLoading(false)

        // Redirect to success if payment is confirmed
        if (data.payment.payment_status === 'finished' || data.payment.payment_status === 'confirmed') {
          router.push(`/checkout/success?order_id=${data.payment.order_id}`)
        }
      } else {
        setError(data.error || 'Failed to load payment')
        setLoading(false)
      }
    } catch (err) {
      console.error('Error fetching payment:', err)
      setError('Failed to load payment details')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!paymentId) {
      setError('No payment ID provided')
      setLoading(false)
      return
    }

    fetchPaymentStatus()
    const interval = setInterval(fetchPaymentStatus, 10000) // Poll every 10 seconds

    return () => clearInterval(interval)
    // fetchPaymentStatus is called in the effect and interval
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card rounded-2xl p-8 text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => router.push('/pricing')}>Back to Pricing</Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finished':
      case 'confirmed':
        return 'text-green-500'
      case 'waiting':
      case 'confirming':
        return 'text-yellow-500'
      case 'failed':
      case 'expired':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Waiting for Payment'
      case 'confirming':
        return 'Confirming Payment'
      case 'confirmed':
        return 'Payment Confirmed'
      case 'finished':
        return 'Payment Complete'
      case 'failed':
        return 'Payment Failed'
      case 'expired':
        return 'Payment Expired'
      case 'partially_paid':
        return 'Partially Paid'
      default:
        return status
    }
  }

  const getNetworkName = (payCurrency: string) => {
    const currency = payCurrency.toLowerCase()
    if (currency.includes('bsc') || currency.includes('bep20')) {
      return 'Binance Smart Chain (BEP20)'
    } else if (currency.includes('trc20') || currency === 'usdttrc20') {
      return 'Tron Network (TRC20)'
    } else if (currency === 'btc') {
      return 'Bitcoin Network'
    } else if (currency === 'eth') {
      return 'Ethereum Network'
    }
    return payCurrency.toUpperCase()
  }

  const getCurrencyDisplay = (payCurrency: string) => {
    const currency = payCurrency.toLowerCase()
    if (currency.includes('usdt') || currency.includes('trc20') || currency.includes('bep20') || currency.includes('bsc')) {
      return 'USDT'
    } else if (currency === 'btc') {
      return 'BTC'
    } else if (currency === 'eth') {
      return 'ETH'
    }
    return payCurrency.toUpperCase()
  }

  return (
    <div className="min-h-screen gradient-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 mb-4 ${getStatusColor(payment.payment_status)}`}>
              {(payment.payment_status === 'finished' || payment.payment_status === 'confirmed') ? (
                <CheckCircle2 className="h-12 w-12" />
              ) : payment.payment_status === 'failed' || payment.payment_status === 'expired' ? (
                <XCircle className="h-12 w-12" />
              ) : (
                <Loader2 className="h-12 w-12 animate-spin" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {getStatusText(payment.payment_status)}
            </h1>
            <p className="text-muted-foreground">
              Payment ID: {payment.payment_id}
            </p>
          </div>

          {/* Payment Details */}
          {(payment.payment_status === 'waiting' || payment.payment_status === 'confirming') && (
            <>
              <div className="mb-8 p-6 bg-primary/10 rounded-xl border border-primary/20">
                <h2 className="text-lg font-semibold mb-4">Send Payment To:</h2>

                <div className="mb-4">
                  <label className="text-sm text-muted-foreground mb-2 block">Address</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background/50 px-4 py-3 rounded-lg text-sm break-all">
                      {payment.pay_address}
                    </code>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(payment.pay_address)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-muted-foreground mb-2 block">Amount</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background/50 px-4 py-3 rounded-lg text-lg font-bold">
                      {payment.pay_amount}
                    </code>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(payment.pay_amount.toString())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mt-4">
                  <p>• Send <strong>exactly</strong> {payment.pay_amount}</p>
                  <p>• To the address above</p>
                  <p>• Network: {getNetworkName(payment.pay_currency)}</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-200">
                  ⚠️ Please send the exact amount to avoid delays. Partial payments may take longer to process.
                </p>
              </div>
            </>
          )}

          {/* Order Details */}
          <div className="border-t border-border pt-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono text-sm">{payment.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount (USDT)</span>
                <span className="font-semibold">{payment.price_amount} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pay Currency</span>
                <span className="font-semibold">{getCurrencyDisplay(payment.pay_currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-semibold ${getStatusColor(payment.payment_status)}`}>
                  {getStatusText(payment.payment_status)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {(payment.payment_status === 'waiting' || payment.payment_status === 'confirming') && (
              <Button
                onClick={fetchPaymentStatus}
                variant="outline"
                className="w-full"
              >
                <Loader2 className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
            )}

            {(payment.payment_status === 'failed' || payment.payment_status === 'expired') && (
              <Button
                onClick={() => router.push('/pricing')}
                className="w-full"
              >
                Try Again
              </Button>
            )}

            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        {(payment.payment_status === 'waiting' || payment.payment_status === 'confirming') && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Status updates automatically every 10 seconds
          </p>
        )}
      </div>
    </div>
  )
}
