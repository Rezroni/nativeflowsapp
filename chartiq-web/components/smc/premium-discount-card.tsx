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
  return (
    <Card className="transition-all hover:shadow-xl border-2 bg-purple-500/5 border-purple-500/20 hover:border-purple-500/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="h-5 w-5 text-purple-400" />
          <span className="font-semibold text-purple-400">Premium/Discount Zones</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Equilibrium */}
        <div className="p-4 rounded-lg bg-purple-500/10 border-2 border-purple-500/30">
          <p className="text-xs text-muted-foreground mb-2">Equilibrium (50%)</p>
          <p className="text-2xl font-bold text-purple-400">
            {premiumDiscount.equilibrium.toFixed(2)}
          </p>
          <p className="text-xs text-purple-300 mt-2">
            Fair value - optimal entry/exit reference
          </p>
        </div>

        {/* Premium Zones */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowDown className="h-5 w-5 text-rose-400" />
            <div>
              <h4 className="text-sm font-semibold text-rose-400">Premium Zones</h4>
              <p className="text-xs text-muted-foreground">
                Sell zones - Price above fair value
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {premiumDiscount.premium.map((zone, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-rose-500/10 border-2 border-rose-500/30 hover:border-rose-500/50 transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-rose-300">
                    {zone.high.toFixed(2)} - {zone.low.toFixed(2)}
                  </span>
                  <span className="text-xs text-rose-400 bg-rose-600/20 px-2 py-1 rounded">
                    {(zone.high - zone.low).toFixed(2)} pts
                  </span>
                </div>
              </div>
            ))}
            {premiumDiscount.premium.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-3 bg-slate-800/20 rounded-lg">
                No premium zones identified
              </p>
            )}
          </div>
        </div>

        {/* Discount Zones */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowUp className="h-5 w-5 text-emerald-400" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-400">
                Discount Zones
              </h4>
              <p className="text-xs text-muted-foreground">
                Buy zones - Price below fair value
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {premiumDiscount.discount.map((zone, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-emerald-500/10 border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-emerald-300">
                    {zone.high.toFixed(2)} - {zone.low.toFixed(2)}
                  </span>
                  <span className="text-xs text-emerald-400 bg-emerald-600/20 px-2 py-1 rounded">
                    {(zone.high - zone.low).toFixed(2)} pts
                  </span>
                </div>
              </div>
            ))}
            {premiumDiscount.discount.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-3 bg-slate-800/20 rounded-lg">
                No discount zones identified
              </p>
            )}
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
