'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MarketStructure } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface MarketStructureCardProps {
  structure: MarketStructure;
}

export function MarketStructureCard({ structure }: MarketStructureCardProps) {
  const trendConfig = {
    bullish: {
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      label: 'Bullish',
      cardBg: 'smc-bullish-bg',
      hoverBorder: 'hover:border-emerald-500/60',
    },
    bearish: {
      icon: TrendingDown,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      label: 'Bearish',
      cardBg: 'smc-bearish-bg',
      hoverBorder: 'hover:border-rose-500/60',
    },
    ranging: {
      icon: Minus,
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/30',
      label: 'Ranging',
      cardBg: 'smc-neutral-bg',
      hoverBorder: 'hover:border-slate-500/60',
    },
  };

  const config = trendConfig[structure.trend];
  const Icon = config.icon;

  return (
    <Card className={cn('transition-all hover:shadow-xl border-2', config.cardBg, config.hoverBorder)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className={cn('h-5 w-5', config.color)} />
          <span className="font-semibold">Market Structure</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Trend */}
        <div
          className={cn(
            'p-4 rounded-lg border-2',
            config.bgColor,
            config.borderColor
          )}
        >
          <p className="text-xs text-muted-foreground mb-2">Current Trend</p>
          <p className={cn('text-xl font-bold', config.color)}>
            {config.label.toUpperCase()}
          </p>
        </div>

        {/* Break of Structure (BOS) */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Break of Structure (BOS)</h4>
          <div className="space-y-2">
            {structure.bos.map((bos, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border-2 transition-all',
                  bos.direction === 'bullish'
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50'
                )}
              >
                <div className="flex items-center gap-3">
                  {bos.direction === 'bullish' ? (
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-rose-400" />
                  )}
                  <div>
                    <p className={cn(
                      'text-sm font-bold',
                      bos.direction === 'bullish' ? 'text-emerald-300' : 'text-rose-300'
                    )}>
                      {bos.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bos.timestamp}
                    </p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    'border',
                    bos.direction === 'bullish'
                      ? 'bg-emerald-600/80 border-emerald-500'
                      : 'bg-rose-600/80 border-rose-500'
                  )}
                >
                  {bos.direction}
                </Badge>
              </div>
            ))}
            {structure.bos.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-3 bg-slate-800/20 rounded-lg">
                No BOS identified in current timeframe
              </p>
            )}
          </div>
        </div>

        {/* Change of Character (CHoCH) */}
        <div>
          <h4 className="text-sm font-semibold mb-3">
            Change of Character (CHoCH)
          </h4>
          <div className="space-y-2">
            {structure.choch.map((choch, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border-2 transition-all',
                  choch.direction === 'bullish'
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50'
                )}
              >
                <div className="flex items-center gap-3">
                  {choch.direction === 'bullish' ? (
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-rose-400" />
                  )}
                  <div>
                    <p className={cn(
                      'text-sm font-bold',
                      choch.direction === 'bullish' ? 'text-emerald-300' : 'text-rose-300'
                    )}>
                      {choch.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {choch.timestamp}
                    </p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    'border',
                    choch.direction === 'bullish'
                      ? 'bg-emerald-600/80 border-emerald-500'
                      : 'bg-rose-600/80 border-rose-500'
                  )}
                >
                  {choch.direction}
                </Badge>
              </div>
            ))}
            {structure.choch.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-3 bg-slate-800/20 rounded-lg">
                No CHoCH identified in current timeframe
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
