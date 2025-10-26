'use client';

import { Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PremiumDiscount } from '@/types/analysis';

interface PremiumDiscountCardProps {
  premiumDiscount: PremiumDiscount;
}

export function PremiumDiscountCard({
  premiumDiscount,
}: PremiumDiscountCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="h-4 w-4 text-purple-500" />
          <span>Premium/Discount Zones</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Equilibrium */}
        <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
          <p className="text-xs text-muted-foreground mb-1">Equilibrium (50%)</p>
          <p className="text-lg font-bold text-purple-700">
            {premiumDiscount.equilibrium.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Fair value - optimal entry/exit reference
          </p>
        </div>

        {/* Premium Zones */}
        <div>
          <div className="mb-2">
            <h4 className="text-sm font-semibold text-blue-700">Premium Zones</h4>
            <p className="text-xs text-muted-foreground">
              Sell zones - Price above fair value
            </p>
          </div>
          <div className="space-y-2">
            {premiumDiscount.premium.map((zone, index) => (
              <div
                key={index}
                className="p-2 rounded bg-blue-50 border border-blue-200"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {zone.high.toFixed(2)} - {zone.low.toFixed(2)}
                  </span>
                  <span className="text-xs text-blue-700">
                    Range: {(zone.high - zone.low).toFixed(2)} pts
                  </span>
                </div>
              </div>
            ))}
            {premiumDiscount.premium.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-2">
                No premium zones identified
              </p>
            )}
          </div>
        </div>

        {/* Discount Zones */}
        <div>
          <div className="mb-2">
            <h4 className="text-sm font-semibold text-green-700">
              Discount Zones
            </h4>
            <p className="text-xs text-muted-foreground">
              Buy zones - Price below fair value
            </p>
          </div>
          <div className="space-y-2">
            {premiumDiscount.discount.map((zone, index) => (
              <div
                key={index}
                className="p-2 rounded bg-green-50 border border-green-200"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {zone.high.toFixed(2)} - {zone.low.toFixed(2)}
                  </span>
                  <span className="text-xs text-green-700">
                    Range: {(zone.high - zone.low).toFixed(2)} pts
                  </span>
                </div>
              </div>
            ))}
            {premiumDiscount.discount.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-2">
                No discount zones identified
              </p>
            )}
          </div>
        </div>

        {/* Trading Tip */}
        <div className="p-3 rounded-lg bg-muted text-sm">
          <p className="font-medium mb-1">Trading Tip:</p>
          <p className="text-xs text-muted-foreground">
            Look for entries in discount zones for longs and premium zones for
            shorts. Equilibrium often acts as a pivot point.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
