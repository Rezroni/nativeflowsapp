'use client';

import { useState } from 'react';
import { Check, Zap, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getStripe } from '@/lib/stripe/client';
import { toast } from 'sonner';

const plans = [
  {
    id: 'free',
    name: 'Free Trial',
    description: 'Perfect for testing the waters',
    price: { monthly: 0, annual: 0 },
    priceIds: { monthly: null, annual: null },
    features: [
      '5 chart analyses per month',
      'Basic SMC analysis',
      'Order blocks & FVGs',
      'Market structure insights',
      'Email support',
      'Analysis history',
    ],
    limits: '5 analyses/month',
    cta: 'Current Plan',
    popular: false,
    icon: Zap,
  },
  {
    id: 'pro_monthly',
    name: 'Pro',
    description: 'For serious traders',
    price: { monthly: 29, annual: 290 },
    priceIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
      annual: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID,
    },
    features: [
      '100 chart analyses per month',
      'Advanced SMC analysis',
      'All technical indicators',
      'Trade setup recommendations',
      'Premium & discount zones',
      'Liquidity analysis',
      'Priority support',
      'Export analysis as PDF',
      'Compare with AI feature',
    ],
    limits: '100 analyses/month',
    cta: 'Upgrade to Pro',
    popular: true,
    icon: TrendingUp,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For professional teams',
    price: { monthly: 999, annual: 9990 },
    priceIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
      annual: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    },
    features: [
      'Unlimited chart analyses',
      'Everything in Pro',
      'API access',
      'White-label options',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Team collaboration tools',
      'Advanced analytics',
      'Custom training sessions',
    ],
    limits: 'Unlimited',
    cta: 'Contact Sales',
    popular: false,
    icon: Sparkles,
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, priceId: string | null | undefined) => {
    if (!priceId) {
      toast.error('This plan is not available for purchase yet');
      return;
    }

    if (planId === 'enterprise') {
      toast.info('Please contact sales for Enterprise pricing');
      return;
    }

    setLoadingPlan(planId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Start analyzing charts with AI-powered Smart Money Concepts
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              'px-6 py-2 rounded-md font-medium transition-all',
              billingCycle === 'monthly'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={cn(
              'px-6 py-2 rounded-md font-medium transition-all',
              billingCycle === 'annual'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Annual
            <Badge variant="secondary" className="ml-2">
              Save 17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = billingCycle === 'annual' ? plan.price.annual : plan.price.monthly;
          const priceId = billingCycle === 'annual' ? plan.priceIds.annual : plan.priceIds.monthly;
          const isLoading = loadingPlan === plan.id;

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative transition-all hover:shadow-lg',
                plan.popular && 'border-primary border-2 shadow-md'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="px-4 py-1">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold">${price}</span>
                    {plan.id !== 'free' && (
                      <span className="text-muted-foreground">
                        /{billingCycle === 'annual' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'annual' && plan.id !== 'free' && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ${(price / 12).toFixed(2)}/month billed annually
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(plan.id, priceId)}
                  disabled={plan.id === 'free' || isLoading}
                  className="w-full"
                  size="lg"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Can I cancel anytime?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What happens when I reach my limit?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Once you reach your monthly analysis limit, you'll need to upgrade your plan or wait until the next billing cycle. Your limit resets on your renewal date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Do you offer refunds?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We offer a 14-day money-back guarantee. If you're not satisfied with ChartIQ AI, contact us within 14 days of purchase for a full refund.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Can I upgrade or downgrade my plan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade at any time. When upgrading, you'll be charged the prorated amount immediately. When downgrading, the change takes effect at your next billing cycle.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
          <CardContent className="pt-8 pb-8">
            <h3 className="text-2xl font-bold mb-4">
              Still have questions?
            </h3>
            <p className="mb-6 opacity-90">
              Our team is here to help you choose the right plan for your trading needs.
            </p>
            <Button variant="secondary" size="lg">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
