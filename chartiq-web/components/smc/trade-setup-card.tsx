'use client';

import { Target, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TradeSetup } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface TradeSetupCardProps {
  setup: TradeSetup;
}

export function TradeSetupCard({ setup }: TradeSetupCardProps) {
  const isBullish = setup.bias === 'bullish';
  const isNeutral = setup.bias === 'neutral';

  const validityColors = {
    high: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <Card className="transition-all hover:shadow-md border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span>Trade Setup</span>
          </CardTitle>
          <Badge
            variant={isBullish ? 'default' : isNeutral ? 'secondary' : 'destructive'}
          >
            {setup.bias.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validity */}
        <div
          className={cn(
            'p-3 rounded-lg border text-center',
            validityColors[setup.validity]
          )}
        >
          <p className="text-xs font-medium mb-1">Setup Validity</p>
          <p className="text-lg font-bold uppercase">{setup.validity}</p>
        </div>

        {/* Entry Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Entry Type</p>
            <p className="text-sm font-semibold uppercase">{setup.entryType}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Entry Price</p>
            <p className="text-sm font-semibold">{setup.entry.toFixed(2)}</p>
          </div>
        </div>

        {/* Stop Loss */}
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <p className="text-xs font-medium text-red-700">Stop Loss</p>
          </div>
          <p className="text-sm font-bold text-red-700">
            {setup.stopLoss.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Risk: {Math.abs(setup.entry - setup.stopLoss).toFixed(2)} pts
          </p>
        </div>

        {/* Take Profit Targets */}
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          <p className="text-xs font-medium text-green-700 mb-2">
            Take Profit Targets
          </p>
          <div className="space-y-1">
            {setup.takeProfit.map((tp, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">TP{index + 1}:</span>
                <span className="text-sm font-semibold text-green-700">
                  {tp.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk-Reward */}
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-xs text-muted-foreground mb-1">Risk-Reward Ratio</p>
          <p className="text-2xl font-bold text-blue-700">
            1:{setup.riskReward.toFixed(2)}
          </p>
        </div>

        {/* Position Size */}
        <div className="p-3 rounded-lg bg-muted">
          <p className="text-xs text-muted-foreground mb-1">
            Suggested Position Size
          </p>
          <p className="text-sm font-semibold uppercase">{setup.positionSize}</p>
        </div>

        {/* Confluences */}
        <div>
          <p className="text-xs font-medium mb-2">Confluences</p>
          <div className="space-y-1">
            {setup.confluences.map((confluence, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-xs p-2 rounded bg-muted"
              >
                <span className="text-green-600">✓</span>
                <span>{confluence}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning for low validity */}
        {setup.validity === 'low' && (
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-xs">
            <p className="font-medium text-yellow-800 mb-1">⚠️ Caution</p>
            <p className="text-yellow-700">
              This setup has low validity. Consider waiting for better
              confirmation or reducing position size.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
