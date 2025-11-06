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
      <div className="container py-16 md:py-24 px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Choose the plan that works best for you. Pay with cryptocurrency or card.
          </p>
        </div>

        <PricingClientWrapper>
          {/* Pricing Cards */}
          <div className="grid gap-6 md:gap-8 lg:grid-cols-3 max-w-7xl mx-auto mb-16">
            {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = currentPlanId === plan.id

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative flex flex-col glass-card border-2 transition-all duration-300',
                  isCurrentPlan ? 'border-green-500 shadow-lg shadow-green-500/20' :
                  plan.popular ? 'border-primary shadow-lg shadow-primary/20 scale-105' : 'border-border',
                  !isCurrentPlan && 'hover:-translate-y-1 hover:shadow-xl'
                )}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-semibold shadow-md">
                      Current Plan
                    </Badge>
                  </div>
                )}
                {!isCurrentPlan && plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow-md">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-6 pt-8">
                  <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary w-fit">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 pb-6">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-4xl font-bold gradient-text">
                        ${plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground">/{plan.duration.split(' ')[1]}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{plan.limits}</p>
                  </div>

                  <ul className="space-y-2.5">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-0 pb-6">
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
        </PricingClientWrapper>

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
