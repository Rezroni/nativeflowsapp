'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { OrderBlock } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface OrderBlockCardProps {
  orderBlock: OrderBlock;
}

export function OrderBlockCard({ orderBlock }: OrderBlockCardProps) {
  const isBullish = orderBlock.type === 'bullish';

  // Safe access with fallback values
  const high = orderBlock.high ?? 0;
  const low = orderBlock.low ?? 0;
  const strength = orderBlock.strength ?? 'moderate';
  const tested = orderBlock.tested ?? false;
  const reasoning = orderBlock.reasoning ?? 'No reasoning provided';

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
              {isBullish ? 'Bullish' : 'Bearish'} Order Block
            </span>
          </CardTitle>
          <Badge
            variant={tested ? 'secondary' : 'default'}
            className={cn(
              'border',
              tested
                ? 'bg-slate-700/50 border-slate-600'
                : isBullish
                  ? 'bg-emerald-600/80 border-emerald-500'
                  : 'bg-rose-600/80 border-rose-500'
            )}
          >
            {tested ? 'Tested' : 'Untested'}
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

        <div>
          <p className="text-xs text-muted-foreground mb-2">Strength</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700">
              <div
                className={cn(
                  'h-full rounded-full transition-all shadow-lg',
                  isBullish ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-rose-500 to-rose-400',
                  strength === 'strong' ? 'w-full' : strength === 'moderate' ? 'w-2/3' : 'w-1/3'
                )}
              />
            </div>
            <span className={cn('text-sm font-bold capitalize', isBullish ? 'text-emerald-400' : 'text-rose-400')}>
              {strength}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Reasoning</p>
          <p className="text-sm text-foreground/90">{reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}
