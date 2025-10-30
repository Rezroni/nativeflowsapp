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
  const isBullish = setup.type === 'long';

  // Ensure take_profit is always an array
  const takeProfits = Array.isArray(setup.take_profit) ? setup.take_profit : [];

  const validityColors = {
    high: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    low: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <Card className={cn(
      'transition-all hover:shadow-xl border-2',
      isBullish ? 'smc-bullish-bg hover:border-emerald-500/60' : 'smc-bearish-bg hover:border-rose-500/60'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            <span className="font-semibold">Trade Setup</span>
          </CardTitle>
          <Badge
            className={cn(
              'border',
              isBullish
                ? 'bg-emerald-600/80 border-emerald-500'
                : 'bg-rose-600/80 border-rose-500'
            )}
          >
            {setup.type.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validity */}
        <div
          className={cn(
            'p-4 rounded-lg border-2 text-center',
            validityColors[setup.confluence_rating]
          )}
        >
          <p className="text-xs font-medium mb-2">Confluence Rating</p>
          <p className="text-2xl font-bold uppercase">{setup.confluence_rating}</p>
        </div>

        {/* Entry Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className={cn(
            'p-3 rounded-lg border-2',
            isBullish ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
          )}>
            <p className="text-xs text-muted-foreground mb-1">Entry Type</p>
            <p className={cn(
              'text-sm font-bold uppercase',
              isBullish ? 'text-emerald-300' : 'text-rose-300'
            )}>
              {setup.entry.entry_type}
            </p>
          </div>
          <div className={cn(
            'p-3 rounded-lg border-2',
            isBullish ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
          )}>
            <p className="text-xs text-muted-foreground mb-1">Entry Price</p>
            <p className={cn(
              'text-sm font-bold',
              isBullish ? 'text-emerald-300' : 'text-rose-300'
            )}>
              {setup.entry.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Stop Loss */}
        <div className="p-4 rounded-lg bg-rose-500/10 border-2 border-rose-500/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <p className="text-xs font-semibold text-rose-400">Stop Loss</p>
          </div>
          <p className="text-xl font-bold text-rose-300">
            {setup.stop_loss.price.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Risk: {Math.abs(setup.entry.price - setup.stop_loss.price).toFixed(2)} pts
          </p>
        </div>

        {/* Take Profit Targets */}
        <div className="p-4 rounded-lg bg-emerald-500/10 border-2 border-emerald-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-emerald-400" />
            <p className="text-xs font-semibold text-emerald-400">
              Take Profit Targets
            </p>
          </div>
          <div className="space-y-2">
            {takeProfits.map((tp, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-emerald-500/5">
                <span className="text-xs text-muted-foreground font-medium">{tp.target.toUpperCase()}:</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-300">
                    {tp.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({tp.percentage})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk-Reward */}
        <div className="p-4 rounded-lg bg-blue-500/10 border-2 border-blue-500/30 text-center">
          <p className="text-xs text-muted-foreground mb-2">Risk-Reward Ratio</p>
          <p className="text-3xl font-bold text-blue-400">
            {setup.risk_reward}
          </p>
        </div>

        {/* Probability */}
        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 text-center">
          <p className="text-xs text-muted-foreground mb-1">
            Success Probability
          </p>
          <p className="text-2xl font-bold">{setup.probability}%</p>
        </div>

        {/* Notes */}
        {setup.notes && (
          <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 text-sm">
            <p className="text-xs text-muted-foreground mb-2">Setup Notes:</p>
            <p className="text-xs text-foreground/90">{setup.notes}</p>
          </div>
        )}

        {/* Warning for low confluence */}
        {setup.confluence_rating === 'low' && (
          <div className="p-4 rounded-lg smc-warning-bg border-2 border-amber-500/30 text-sm">
            <p className="font-bold smc-warning-text mb-2">⚠️ Caution</p>
            <p className="text-xs text-muted-foreground">
              This setup has low confluence. Consider waiting for better
              confirmation or reducing position size.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
