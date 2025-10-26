'use client';

import { Gap, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FVG } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface FVGCardProps {
  fvg: FVG;
}

export function FVGCard({ fvg }: FVGCardProps) {
  const isBullish = fvg.type === 'bullish';

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {isBullish ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={isBullish ? 'text-green-700' : 'text-red-700'}>
              {isBullish ? 'Bullish' : 'Bearish'} FVG
            </span>
          </CardTitle>
          <Badge variant={fvg.mitigated ? 'secondary' : 'default'}>
            {fvg.mitigated ? 'Mitigated' : 'Open'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">High</p>
            <p className="text-sm font-semibold">{fvg.zone.high.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Low</p>
            <p className="text-sm font-semibold">{fvg.zone.low.toFixed(2)}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Gap Size</p>
          <p className="text-sm font-semibold">
            {(fvg.zone.high - fvg.zone.low).toFixed(2)} pts
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Description</p>
          <p className="text-sm">{fvg.description}</p>
        </div>

        <div
          className={cn(
            'p-2 rounded text-xs',
            fvg.mitigated
              ? 'bg-muted text-muted-foreground'
              : isBullish
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          )}
        >
          {fvg.mitigated
            ? 'This gap has been filled and is no longer active'
            : 'Active imbalance - price may return to fill this gap'}
        </div>
      </CardContent>
    </Card>
  );
}
