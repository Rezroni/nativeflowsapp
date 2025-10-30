'use client';

import { Layers, ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PremiumDiscount } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface PremiumDiscountCardProps {
  premiumDiscount: PremiumDiscount;
}

export function PremiumDiscountCard({
  premiumDiscount,
}: PremiumDiscountCardProps) {
  // Safe access with fallback values
  const currentPosition = premiumDiscount.current_position ?? 'equilibrium';
  const rangePercentage = premiumDiscount.range_percentage ?? 50;
  const premiumHigh = premiumDiscount.premium_high ?? 0;
  const equilibrium = premiumDiscount.equilibrium ?? 0;
  const discountLow = premiumDiscount.discount_low ?? 0;

  const positionColor = {
    premium: 'text-rose-400',
    equilibrium: 'text-purple-400',
    discount: 'text-emerald-400',
  };

  return (
    <Card className="transition-all hover:shadow-xl border-2 bg-purple-500/5 border-purple-500/20 hover:border-purple-500/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="h-5 w-5 text-purple-400" />
          <span className="font-semibold text-purple-400">Premium/Discount Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Position */}
        <div className={cn(
          'p-4 rounded-lg border-2',
          currentPosition === 'premium' && 'bg-rose-500/10 border-rose-500/30',
          currentPosition === 'equilibrium' && 'bg-purple-500/10 border-purple-500/30',
          currentPosition === 'discount' && 'bg-emerald-500/10 border-emerald-500/30'
        )}>
          <p className="text-xs text-muted-foreground mb-2">Current Position</p>
          <p className={cn(
            'text-2xl font-bold capitalize',
            positionColor[currentPosition]
          )}>
            {currentPosition}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {rangePercentage.toFixed(1)}% of price range
          </p>
        </div>

        {/* Premium Zone */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowDown className="h-5 w-5 text-rose-400" />
            <div>
              <h4 className="text-sm font-semibold text-rose-400">Premium Zone</h4>
              <p className="text-xs text-muted-foreground">
                Sell zone - Price above fair value
              </p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-rose-500/10 border-2 border-rose-500/30">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-rose-300">
                {premiumHigh.toFixed(2)}
              </span>
              <span className="text-xs text-rose-400 bg-rose-600/20 px-2 py-1 rounded">
                High
              </span>
            </div>
          </div>
        </div>

        {/* Equilibrium */}
        <div className="p-3 rounded-lg bg-purple-500/10 border-2 border-purple-500/30">
          <p className="text-xs text-muted-foreground mb-1">Equilibrium (50%)</p>
          <p className="text-xl font-bold text-purple-400">
            {equilibrium.toFixed(2)}
          </p>
          <p className="text-xs text-purple-300 mt-1">
            Fair value - optimal entry/exit reference
          </p>
        </div>

        {/* Discount Zone */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowUp className="h-5 w-5 text-emerald-400" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-400">
                Discount Zone
              </h4>
              <p className="text-xs text-muted-foreground">
                Buy zone - Price below fair value
              </p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 border-2 border-emerald-500/30">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-emerald-300">
                {discountLow.toFixed(2)}
              </span>
              <span className="text-xs text-emerald-400 bg-emerald-600/20 px-2 py-1 rounded">
                Low
              </span>
            </div>
          </div>
        </div>

        {/* Trading Tip */}
        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 text-sm">
          <p className="font-semibold mb-2 text-purple-300">Trading Tip:</p>
          <p className="text-xs text-muted-foreground">
            Look for entries in discount zones for longs and premium zones for
            shorts. Equilibrium often acts as a pivot point.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
