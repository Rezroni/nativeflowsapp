import { Check, Zap, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PricingClientWrapper, PricingButton } from '@/components/pricing/pricing-client-wrapper'
import { getSubscriptionStatus } from '@/actions/subscription'

const plans = [
  {
    id: 'weekly',
    name: 'Weekly',
    description: 'Perfect for short-term needs',
    price: 10,
    features: [
      'Unlimited chart analyses',
      'Smart Money Concepts',
      'Email support',
      'Educational resources',
      'Valid for 7 days',
    ],
    limits: 'Unlimited analyses',
    duration: 'per week',
    cta: 'Get Weekly Plan',
    popular: false,
    icon: Zap,
  },
  {
    id: 'monthly',
    name: 'Monthly',
    description: 'Best value for active traders',
    price: 25,
    features: [
      'Unlimited chart analyses',
      'Advanced Smart Money Concepts',
      'Priority support',
      'Advanced indicators',
      'Trade journal',
      'Market alerts',
      'Premium AI models',
    ],
    limits: 'Unlimited analyses',
    duration: 'per month',
    cta: 'Get Monthly Plan',
    popular: true,
    icon: TrendingUp,
  },
  {
    id: 'annual',
    name: 'Annual',
    description: 'Maximum savings for professionals',
    price: 250,
    features: [
      'Unlimited chart analyses',
      'Advanced Smart Money Concepts',
      'Priority support',
      'Advanced indicators',
      'Trade journal',
      'Market alerts',
      'Premium AI models',
      'Save $50 per year',
    ],
    limits: 'Unlimited analyses',
    duration: 'per year',
    cta: 'Get Annual Plan',
    popular: false,
    icon: TrendingUp,
  },
]

export default async function PricingPage() {
  const { subscription } = await getSubscriptionStatus()
  const currentPlanId = subscription?.plan_id || null

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

        <PricingClientWrapper
          planId="monthly"
          planName="Monthly"
          cta="Get Monthly Plan"
          popular={true}
          currentPlanId={currentPlanId}
        />

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = currentPlanId === plan.id

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative flex flex-col glass-card border-2 transition-all hover:-translate-y-2',
                  isCurrentPlan ? 'border-green-500 hover-glow' :
                  plan.popular ? 'border-primary hover-glow' : 'border-border'
                )}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-1">
                      Current Plan
                    </Badge>
                  </div>
                )}
                {!isCurrentPlan && plan.popular && (
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
                  <PricingButton
                    planId={plan.id}
                    cta={plan.cta}
                    popular={plan.popular}
                    currentPlanId={currentPlanId}
                  />
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
              <h3 className="text-lg font-semibold mb-2">Which plan should I choose?</h3>
              <p className="text-muted-foreground">
                Choose Weekly ($10) for short-term analysis, Monthly ($25) for regular trading, or Annual ($250) to save $50 per year.
                All plans include unlimited chart analyses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What's the difference between plans?</h3>
              <p className="text-muted-foreground">
                Weekly plan uses efficient AI models, while Monthly and Annual plans include premium AI models,
                advanced features, and priority support. Annual plan offers the best value with significant savings.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What happens after payment?</h3>
              <p className="text-muted-foreground">
                After successful payment confirmation, your account is activated immediately with unlimited access to all plan features.
                Your subscription will be valid for the duration you selected (7 days, 1 month, or 1 year).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
