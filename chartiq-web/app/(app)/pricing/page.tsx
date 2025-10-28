'use client'

import { useState } from 'react'
import { Check, Zap, TrendingUp, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const plans = [
  {
    id: 'free',
    name: 'Free Trial',
    description: 'Perfect for testing the waters',
    price: 0,
    features: [
      '5 chart analyses',
      'Basic Smart Money Concepts',
      'Email support',
      'Educational resources',
    ],
    limits: '5 analyses total',
    duration: '3-day trial',
    cta: 'Current Plan',
    popular: false,
    icon: Zap,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious traders',
    price: 59,
    features: [
      'Unlimited chart analyses',
      'Advanced Smart Money Concepts',
      'Priority support',
      'Advanced indicators',
      'Trade journal',
      'Market alerts',
      'API access',
      'Custom training',
    ],
    limits: 'Unlimited analyses',
    duration: 'per month',
    cta: 'Upgrade to Pro',
    popular: true,
    icon: TrendingUp,
  },
]

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [selectedCrypto, setSelectedCrypto] = useState<string>('usdttrc20')
  const router = useRouter()

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') {
      toast.info('You are currently on the free trial plan')
      return
    }

    setLoadingPlan(planId)

    try {
      // Create payment with NOWPayments
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          payCurrency: selectedCrypto,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment')
      }

      // Always redirect to our payment page which will show payment details
      toast.success('Payment created! Redirecting...')
      router.push(`/checkout/payment?id=${data.payment.payment_id}`)
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to start subscription')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container py-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works best for you. Pay with cryptocurrency.
          </p>
        </div>

        {/* Cryptocurrency Selector */}
        <div className="mx-auto max-w-2xl mb-12">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Pay with Cryptocurrency</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: 'btc', label: 'BTC' },
                { value: 'eth', label: 'ETH' },
                { value: 'usdttrc20', label: 'USDT (TRC20)' },
                { value: 'usdtbsc', label: 'USDT (BSC)' }
              ].map((crypto) => (
                <button
                  key={crypto.value}
                  onClick={() => setSelectedCrypto(crypto.value)}
                  className={cn(
                    'px-4 py-3 rounded-xl font-medium transition-all text-center',
                    selectedCrypto === crypto.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background/50 hover:bg-background/80'
                  )}
                >
                  {crypto.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              {selectedCrypto === 'usdttrc20' && 'USDT on Tron Network (TRC20)'}
              {selectedCrypto === 'usdtbsc' && 'USDT on Binance Smart Chain (BEP20)'}
              {selectedCrypto === 'btc' && 'Bitcoin'}
              {selectedCrypto === 'eth' && 'Ethereum'}
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isLoading = loadingPlan === plan.id

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative flex flex-col glass-card border-2 transition-all hover:-translate-y-2',
                  plan.popular ? 'border-primary hover-glow' : 'border-border'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-8">
                  <div className="mb-4 inline-flex rounded-xl bg-primary/20 p-3 text-primary w-fit">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-3xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 pb-8">
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-bold gradient-text">
                        {plan.price === 0 ? 'Free' : `${plan.price} USDT`}
                      </span>
                      <span className="text-muted-foreground">/{plan.duration}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.limits}</p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading || plan.id === 'free'}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mx-auto max-w-3xl mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="glass-card rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What cryptocurrencies do you accept?</h3>
              <p className="text-muted-foreground">
                We accept Bitcoin (BTC), Ethereum (ETH), USDT on Tron Network (TRC20), and USDT on Binance Smart Chain (BSC).
                All payments are processed securely through NOWPayments.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How long is the free trial?</h3>
              <p className="text-muted-foreground">
                The free trial lasts for 3 days and includes 5 chart analyses to help you get started
                with our platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes! Your Pro subscription is month-to-month. Simply cancel before your next billing
                cycle to avoid being charged.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What happens after payment?</h3>
              <p className="text-muted-foreground">
                After successful payment confirmation, your account will be upgraded to Pro immediately
                and you'll have unlimited access to all features.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto max-w-3xl mt-16 text-center glass-card rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Trade <span className="gradient-text">Smarter?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your journey with our Pro plan and unlock unlimited chart analyses
          </p>
          <Button size="lg" onClick={() => handleSubscribe('pro')} disabled={loadingPlan === 'pro'}>
            {loadingPlan === 'pro' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Get Started Now'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
