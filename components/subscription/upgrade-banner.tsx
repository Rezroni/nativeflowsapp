'use client';

import { Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useState } from 'react';

interface UpgradeBannerProps {
  currentPlan: string;
  usagePercent: number;
  analysesRemaining: number;
}

export function UpgradeBanner({
  currentPlan,
  usagePercent,
  analysesRemaining,
}: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // Only show banner for free users or when usage is high
  const shouldShow =
    currentPlan === 'free' && (usagePercent > 60 || analysesRemaining <= 2);

  if (!shouldShow || dismissed) {
    return null;
  }

  return (
    <Card className="mb-6 border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10 relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="p-6 pr-12">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">
              {analysesRemaining <= 2
                ? `Only ${analysesRemaining} analyses remaining this month`
                : "You're using your analyses quickly!"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upgrade to Pro and get 100 analyses per month, plus advanced features
              like liquidity analysis, trade setups, and priority support.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/pricing">
                <Button>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" onClick={() => setDismissed(true)}>
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
