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
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Bullish',
    },
    bearish: {
      icon: TrendingDown,
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Bearish',
    },
    ranging: {
      icon: Minus,
      color: 'text-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      label: 'Ranging',
    },
  };

  const config = trendConfig[structure.trend];
  const Icon = config.icon;

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className={cn('h-4 w-4', config.color)} />
          <span>Market Structure</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Trend */}
        <div
          className={cn(
            'p-3 rounded-lg border',
            config.bgColor,
            config.borderColor
          )}
        >
          <p className="text-xs text-muted-foreground mb-1">Current Trend</p>
          <p className={cn('text-lg font-bold', config.color)}>
            {config.label.toUpperCase()}
          </p>
        </div>

        {/* Break of Structure (BOS) */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Break of Structure (BOS)</h4>
          <div className="space-y-2">
            {structure.bos.map((bos, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-muted"
              >
                <div className="flex items-center gap-2">
                  {bos.direction === 'bullish' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{bos.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {bos.timestamp}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={bos.direction === 'bullish' ? 'default' : 'destructive'}
                >
                  {bos.direction}
                </Badge>
              </div>
            ))}
            {structure.bos.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-2">
                No BOS identified in current timeframe
              </p>
            )}
          </div>
        </div>

        {/* Change of Character (CHoCH) */}
        <div>
          <h4 className="text-sm font-semibold mb-2">
            Change of Character (CHoCH)
          </h4>
          <div className="space-y-2">
            {structure.choch.map((choch, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-muted"
              >
                <div className="flex items-center gap-2">
                  {choch.direction === 'bullish' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {choch.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {choch.timestamp}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    choch.direction === 'bullish' ? 'default' : 'destructive'
                  }
                >
                  {choch.direction}
                </Badge>
              </div>
            ))}
            {structure.choch.length === 0 && (
              <p className="text-xs text-muted-foreground italic p-2">
                No CHoCH identified in current timeframe
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
