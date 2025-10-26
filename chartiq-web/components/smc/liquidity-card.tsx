'use client';

import { Droplet, ArrowUp, ArrowDown, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Liquidity } from '@/types/analysis';

interface LiquidityCardProps {
  liquidity: Liquidity;
}

export function LiquidityCard({ liquidity }: LiquidityCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Droplet className="h-4 w-4 text-blue-500" />
          <span>Liquidity Zones</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Buy-Side Liquidity */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <h4 className="text-sm font-semibold text-green-700">
              Buy-Side Liquidity
            </h4>
          </div>
          <div className="space-y-2">
            {liquidity.buySide.map((level, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-green-50 border border-green-200"
              >
                <div className="flex items-center gap-2">
                  {level.swept ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-green-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{level.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{level.type}</p>
                  </div>
                </div>
                <div className="text-xs text-green-700">
                  {level.swept ? 'Swept' : 'Active'}
                </div>
              </div>
            ))}
            {liquidity.buySide.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-2">
                No buy-side liquidity identified
              </p>
            )}
          </div>
        </div>

        {/* Sell-Side Liquidity */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ArrowDown className="h-4 w-4 text-red-500" />
            <h4 className="text-sm font-semibold text-red-700">
              Sell-Side Liquidity
            </h4>
          </div>
          <div className="space-y-2">
            {liquidity.sellSide.map((level, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-red-50 border border-red-200"
              >
                <div className="flex items-center gap-2">
                  {level.swept ? (
                    <CheckCircle2 className="h-4 w-4 text-red-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{level.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{level.type}</p>
                  </div>
                </div>
                <div className="text-xs text-red-700">
                  {level.swept ? 'Swept' : 'Active'}
                </div>
              </div>
            ))}
            {liquidity.sellSide.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-2">
                No sell-side liquidity identified
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
