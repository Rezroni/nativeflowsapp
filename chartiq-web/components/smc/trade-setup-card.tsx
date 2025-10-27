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
    high: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    low: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <Card className={cn(
      'transition-all hover:shadow-xl border-2',
      isBullish ? 'smc-bullish-bg hover:border-emerald-500/60' : isNeutral ? 'smc-neutral-bg hover:border-slate-500/60' : 'smc-bearish-bg hover:border-rose-500/60'
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
                : isNeutral
                  ? 'bg-slate-600/80 border-slate-500'
                  : 'bg-rose-600/80 border-rose-500'
            )}
          >
            {setup.bias.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validity */}
        <div
          className={cn(
            'p-4 rounded-lg border-2 text-center',
            validityColors[setup.validity]
          )}
        >
          <p className="text-xs font-medium mb-2">Setup Validity</p>
          <p className="text-2xl font-bold uppercase">{setup.validity}</p>
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
              {setup.entryType}
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
              {setup.entry.toFixed(2)}
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
            {setup.stopLoss.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Risk: {Math.abs(setup.entry - setup.stopLoss).toFixed(2)} pts
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
            {setup.takeProfit.map((tp, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-emerald-500/5">
                <span className="text-xs text-muted-foreground font-medium">TP{index + 1}:</span>
                <span className="text-sm font-bold text-emerald-300">
                  {tp.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk-Reward */}
        <div className="p-4 rounded-lg bg-blue-500/10 border-2 border-blue-500/30 text-center">
          <p className="text-xs text-muted-foreground mb-2">Risk-Reward Ratio</p>
          <p className="text-3xl font-bold text-blue-400">
            1:{setup.riskReward.toFixed(2)}
          </p>
        </div>

        {/* Position Size */}
        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
          <p className="text-xs text-muted-foreground mb-1">
            Suggested Position Size
          </p>
          <p className="text-sm font-bold uppercase">{setup.positionSize}</p>
        </div>

        {/* Confluences */}
        <div>
          <p className="text-xs font-semibold mb-3 text-blue-400">Confluences</p>
          <div className="space-y-2">
            {setup.confluences.map((confluence, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-xs p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
              >
                <span className="text-emerald-400 font-bold text-base">✓</span>
                <span className="text-foreground/90">{confluence}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning for low validity */}
        {setup.validity === 'low' && (
          <div className="p-4 rounded-lg smc-warning-bg border-2 border-amber-500/30 text-sm">
            <p className="font-bold smc-warning-text mb-2">⚠️ Caution</p>
            <p className="text-xs text-muted-foreground">
              This setup has low validity. Consider waiting for better
              confirmation or reducing position size.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
