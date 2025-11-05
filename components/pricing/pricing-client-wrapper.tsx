'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Analytics } from '@/lib/analytics/mixpanel';

interface PricingClientWrapperProps {
  planId: string;
  planName: string;
  cta: string;
  popular: boolean;
  currentPlanId: string | null;
}

export function PricingClientWrapper({
  planId,
  planName,
  cta,
  popular,
  currentPlanId,
}: PricingClientWrapperProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('usdttrc20');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');
  const router = useRouter();
  const isCurrentPlan = currentPlanId === planId;

  // Track pricing page view
  useEffect(() => {
    Analytics.pricingPageViewed();
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (isCurrentPlan) return;

    setLoadingPlan(planId);

    // Track checkout started
    Analytics.checkoutStarted(planId, paymentMethod === 'crypto' ? selectedCrypto : 'card');

    try {
      if (paymentMethod === 'card') {
        // Create Stripe checkout session
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planType: planId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session');
        }

        // Redirect to Stripe checkout
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        // Create payment with NOWPayments (crypto)
        const response = await fetch('/api/payment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId,
            payCurrency: selectedCrypto,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment');
        }

        // Always redirect to our payment page which will show payment details
        toast.success('Payment created! Redirecting...');
        router.push(`/checkout/payment?id=${data.payment.payment_id}`);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start subscription');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      {/* Payment Method Selector */}
      <div className="mx-auto max-w-2xl mb-8">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Choose Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod('crypto')}
              className={cn(
                'px-6 py-4 rounded-xl font-medium transition-all text-center',
                paymentMethod === 'crypto'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background/50 hover:bg-background/80'
              )}
            >
              <div className="text-lg mb-1">Cryptocurrency</div>
              <div className="text-xs opacity-70">BTC, ETH, USDT</div>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={cn(
                'px-6 py-4 rounded-xl font-medium transition-all text-center',
                paymentMethod === 'card'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background/50 hover:bg-background/80'
              )}
            >
              <div className="text-lg mb-1">Credit/Debit Card</div>
              <div className="text-xs opacity-70">Visa, Mastercard, etc.</div>
            </button>
          </div>
        </div>
      </div>

      {/* Cryptocurrency Selector - Only show if crypto is selected */}
      {paymentMethod === 'crypto' && (
        <div className="mx-auto max-w-2xl mb-12">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Select Cryptocurrency</h3>
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
      )}

      {/* CTA Section - Only shows for non-current plan */}
      {!isCurrentPlan && (
        <div className="mx-auto max-w-3xl mt-16 text-center glass-card rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Trade <span className="gradient-text">Smarter?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Choose your plan and start analyzing charts with AI-powered Smart Money Concepts
          </p>
          <Button size="lg" onClick={() => handleSubscribe('monthly')} disabled={loadingPlan === 'monthly'}>
            {loadingPlan === 'monthly' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Get Monthly Plan'
            )}
          </Button>
        </div>
      )}
    </>
  );
}

export function PricingButton({
  planId,
  cta,
  popular,
  currentPlanId,
}: {
  planId: string;
  cta: string;
  popular: boolean;
  currentPlanId: string | null;
}) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedCrypto] = useState<string>('usdttrc20');
  const router = useRouter();
  const isCurrentPlan = currentPlanId === planId;

  const handleSubscribe = async () => {
    if (isCurrentPlan) return;

    setLoadingPlan(planId);

    // Track checkout started
    Analytics.checkoutStarted(planId, selectedCrypto);

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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      // Always redirect to our payment page which will show payment details
      toast.success('Payment created! Redirecting...');
      router.push(`/checkout/payment?id=${data.payment.payment_id}`);
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start subscription');
    } finally {
      setLoadingPlan(null);
    }
  };

  const isLoading = loadingPlan === planId;

  return (
    <Button
      className="w-full min-h-[48px]"
      size="lg"
      variant={popular ? 'default' : 'outline'}
      onClick={handleSubscribe}
      disabled={isLoading || isCurrentPlan}
    >
      {isCurrentPlan ? (
        'Current Plan'
      ) : isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        cta
      )}
    </Button>
  );
}
