'use client';

import { Droplet, ArrowUp, ArrowDown, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LiquidityZone } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface LiquidityCardProps {
  liquidity: LiquidityZone;
}

export function LiquidityCard({ liquidity }: LiquidityCardProps) {
  const typeIcon = liquidity.type === 'equal_highs' ? ArrowUp : ArrowDown;
  const TypeIcon = typeIcon;
  const color = liquidity.type === 'equal_lows' ? 'emerald' : liquidity.type === 'equal_highs' ? 'rose' : 'blue';

  return (
    <Card className="transition-all hover:shadow-xl border-2 smc-info-bg hover:border-blue-500/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-400" />
          <span className="font-semibold smc-info-text">
            Liquidity Zone - {liquidity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TypeIcon className={`h-5 w-5 text-${color}-400`} />
            <h4 className={`text-sm font-semibold text-${color}-400`}>
              Price Levels
            </h4>
          </div>
          <div className="space-y-2">
            {liquidity.levels.map((level, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border-2 transition-all',
                  liquidity.swept
                    ? 'bg-slate-800/30 border-slate-700/50'
                    : `bg-${color}-500/10 border-${color}-500/30 hover:border-${color}-500/50`
                )}
              >
                <div className="flex items-center gap-3">
                  {liquidity.swept ? (
                    <CheckCircle2 className={`h-5 w-5 text-${color}-600/50`} />
                  ) : (
                    <Circle className={`h-5 w-5 text-${color}-400`} />
                  )}
                  <div>
                    <p className={cn(
                      'text-sm font-bold',
                      liquidity.swept ? 'text-muted-foreground' : `text-${color}-300`
                    )}>
                      {typeof level === 'number' ? level.toFixed(2) : level}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  'text-xs font-semibold px-2 py-1 rounded',
                  liquidity.swept
                    ? 'bg-slate-700/50 text-slate-400'
                    : `bg-${color}-600/20 text-${color}-300`
                )}>
                  {liquidity.swept ? 'Swept' : 'Active'}
                </div>
              </div>
            ))}
            {liquidity.levels.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-3 bg-slate-800/20 rounded-lg">
                No liquidity levels identified
              </p>
            )}
          </div>
        </div>

        {liquidity.description && (
          <div className="pt-2 border-t border-slate-700/50">
            <p className="text-xs text-muted-foreground">{liquidity.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
