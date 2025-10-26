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

  return (
    <Card className={cn('transition-all hover:shadow-md')}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {isBullish ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={isBullish ? 'text-green-700' : 'text-red-700'}>
              {isBullish ? 'Bullish' : 'Bearish'} Order Block
            </span>
          </CardTitle>
          <Badge variant={orderBlock.tested ? 'secondary' : 'default'}>
            {orderBlock.tested ? 'Tested' : 'Untested'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">High</p>
            <p className="text-sm font-semibold">
              {orderBlock.zone.high.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Low</p>
            <p className="text-sm font-semibold">
              {orderBlock.zone.low.toFixed(2)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Strength</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  isBullish ? 'bg-green-500' : 'bg-red-500'
                )}
                style={{ width: `${orderBlock.strength * 10}%` }}
              />
            </div>
            <span className="text-sm font-semibold">
              {orderBlock.strength}/10
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Description</p>
          <p className="text-sm">{orderBlock.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
