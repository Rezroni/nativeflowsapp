'use client';

import { Droplet, ArrowUp, ArrowDown, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Liquidity } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface LiquidityCardProps {
  liquidity: Liquidity;
}

export function LiquidityCard({ liquidity }: LiquidityCardProps) {
  return (
    <Card className="transition-all hover:shadow-xl border-2 smc-info-bg hover:border-blue-500/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-400" />
          <span className="font-semibold smc-info-text">Liquidity Zones</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Buy-Side Liquidity */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowUp className="h-5 w-5 text-emerald-400" />
            <h4 className="text-sm font-semibold text-emerald-400">
              Buy-Side Liquidity
            </h4>
          </div>
          <div className="space-y-2">
            {liquidity.buySide.map((level, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border-2 transition-all',
                  level.swept
                    ? 'bg-slate-800/30 border-slate-700/50'
                    : 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                )}
              >
                <div className="flex items-center gap-3">
                  {level.swept ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600/50" />
                  ) : (
                    <Circle className="h-5 w-5 text-emerald-400" />
                  )}
                  <div>
                    <p className={cn(
                      'text-sm font-bold',
                      level.swept ? 'text-muted-foreground' : 'text-emerald-300'
                    )}>
                      {level.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{level.type}</p>
                  </div>
                </div>
                <div className={cn(
                  'text-xs font-semibold px-2 py-1 rounded',
                  level.swept
                    ? 'bg-slate-700/50 text-slate-400'
                    : 'bg-emerald-600/20 text-emerald-300'
                )}>
                  {level.swept ? 'Swept' : 'Active'}
                </div>
              </div>
            ))}
            {liquidity.buySide.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-3 bg-slate-800/20 rounded-lg">
                No buy-side liquidity identified
              </p>
            )}
          </div>
        </div>

        {/* Sell-Side Liquidity */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowDown className="h-5 w-5 text-rose-400" />
            <h4 className="text-sm font-semibold text-rose-400">
              Sell-Side Liquidity
            </h4>
          </div>
          <div className="space-y-2">
            {liquidity.sellSide.map((level, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border-2 transition-all',
                  level.swept
                    ? 'bg-slate-800/30 border-slate-700/50'
                    : 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50'
                )}
              >
                <div className="flex items-center gap-3">
                  {level.swept ? (
                    <CheckCircle2 className="h-5 w-5 text-rose-600/50" />
                  ) : (
                    <Circle className="h-5 w-5 text-rose-400" />
                  )}
                  <div>
                    <p className={cn(
                      'text-sm font-bold',
                      level.swept ? 'text-muted-foreground' : 'text-rose-300'
                    )}>
                      {level.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{level.type}</p>
                  </div>
                </div>
                <div className={cn(
                  'text-xs font-semibold px-2 py-1 rounded',
                  level.swept
                    ? 'bg-slate-700/50 text-slate-400'
                    : 'bg-rose-600/20 text-rose-300'
                )}>
                  {level.swept ? 'Swept' : 'Active'}
                </div>
              </div>
            ))}
            {liquidity.sellSide.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-3 bg-slate-800/20 rounded-lg">
                No sell-side liquidity identified
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
