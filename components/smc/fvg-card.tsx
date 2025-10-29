'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FairValueGap } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface FVGCardProps {
  fvg: FairValueGap;
}

export function FVGCard({ fvg }: FVGCardProps) {
  const isBullish = fvg.type === 'bullish';

  // Safe access with fallback values
  const high = fvg.high ?? 0;
  const low = fvg.low ?? 0;
  const mitigated = fvg.filled ?? false;
  const significance = fvg.significance ?? 'medium';

  return (
    <Card className={cn(
      'transition-all hover:shadow-xl border-2',
      isBullish ? 'smc-bullish-bg hover:border-emerald-500/60' : 'smc-bearish-bg hover:border-rose-500/60'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {isBullish ? (
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-rose-400" />
            )}
            <span className={cn('font-semibold', isBullish ? 'smc-bullish-text' : 'smc-bearish-text')}>
              {isBullish ? 'Bullish' : 'Bearish'} FVG
            </span>
          </CardTitle>
          <Badge
            variant={mitigated ? 'secondary' : 'default'}
            className={cn(
              'border',
              mitigated
                ? 'bg-slate-700/50 border-slate-600'
                : isBullish
                  ? 'bg-emerald-600/80 border-emerald-500'
                  : 'bg-rose-600/80 border-rose-500'
            )}
          >
            {mitigated ? 'Filled' : 'Open'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className={cn('p-2 rounded-lg', isBullish ? 'bg-emerald-500/5' : 'bg-rose-500/5')}>
            <p className="text-xs text-muted-foreground mb-1">High</p>
            <p className={cn('text-sm font-bold', isBullish ? 'text-emerald-300' : 'text-rose-300')}>
              {high.toFixed(2)}
            </p>
          </div>
          <div className={cn('p-2 rounded-lg', isBullish ? 'bg-emerald-500/5' : 'bg-rose-500/5')}>
            <p className="text-xs text-muted-foreground mb-1">Low</p>
            <p className={cn('text-sm font-bold', isBullish ? 'text-emerald-300' : 'text-rose-300')}>
              {low.toFixed(2)}
            </p>
          </div>
        </div>

        <div className={cn('p-2 rounded-lg', isBullish ? 'bg-emerald-500/5' : 'bg-rose-500/5')}>
          <p className="text-xs text-muted-foreground mb-1">Gap Size</p>
          <p className={cn('text-sm font-bold', isBullish ? 'text-emerald-300' : 'text-rose-300')}>
            {(high - low).toFixed(2)} pts
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Significance</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700">
              <div
                className={cn(
                  'h-full rounded-full transition-all shadow-lg',
                  isBullish ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-rose-500 to-rose-400',
                  significance === 'high' ? 'w-full' : significance === 'medium' ? 'w-2/3' : 'w-1/3'
                )}
              />
            </div>
            <span className={cn('text-sm font-bold capitalize', isBullish ? 'text-emerald-400' : 'text-rose-400')}>
              {significance}
            </span>
          </div>
        </div>

        <div
          className={cn(
            'p-3 rounded-lg text-sm border',
            mitigated
              ? 'bg-slate-800/30 border-slate-700/50 text-muted-foreground'
              : isBullish
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
          )}
        >
          {mitigated
            ? 'This gap has been filled and is no longer active'
            : 'Active imbalance - price may return to fill this gap'}
        </div>
      </CardContent>
    </Card>
  );
}
