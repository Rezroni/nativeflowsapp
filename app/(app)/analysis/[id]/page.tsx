import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  DollarSign,
  AlertCircle,
  Share2,
} from 'lucide-react';

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch analysis
  const { data: analysis, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !analysis) {
    notFound();
  }

  // Parse analysis data
  let analysisData: any = {};
  try {
    analysisData =
      typeof analysis.analysis_data === 'string'
        ? JSON.parse(analysis.analysis_data)
        : analysis.analysis_data || {};
  } catch (e) {
    console.error('Failed to parse analysis_data:', e);
    analysisData = {};
  }

  const marketStructure = analysisData.marketStructure || analysisData.market_structure || {};
  const orderBlocks =
    analysisData.orderBlocks || analysisData.order_blocks || [];
  const fvgs = analysisData.fvgs || analysisData.fair_value_gaps || [];
  const liquidity = analysisData.liquidity || analysisData.liquidity_zones || {};
  const tradeSetup =
    analysisData.tradeSetup ||
    (analysisData.trade_setups && analysisData.trade_setups[0]) ||
    {};
  const insights = analysisData.insights || {};
  const summary = analysisData.summary || '';
  const disclaimer = analysisData.disclaimer || '';

  const bias = tradeSetup.bias || marketStructure.trend || 'ranging';

  // Log trade setup for debugging
  console.log('[AnalysisPage] Trade setup data:', JSON.stringify(tradeSetup, null, 2));

  // Extract entry price with multiple fallback paths
  let entry =
    tradeSetup.entry?.price ||
    tradeSetup.entry ||
    tradeSetup.entryPrice ||
    tradeSetup.entry_price ||
    null;

  // Ensure entry is a number and format it
  if (entry && typeof entry === 'number') {
    entry = entry.toFixed(entry < 10 ? 5 : 2);
  } else if (entry && typeof entry === 'string' && !isNaN(parseFloat(entry))) {
    entry = parseFloat(entry).toFixed(parseFloat(entry) < 10 ? 5 : 2);
  }

  // Extract stop loss with multiple fallback paths
  let stopLoss =
    tradeSetup.stopLoss?.price ||
    tradeSetup.stopLoss ||
    tradeSetup.stopLossPrice ||
    tradeSetup.stop_loss?.price ||
    tradeSetup.stop_loss ||
    null;

  // Ensure stop loss is a number and format it
  if (stopLoss && typeof stopLoss === 'number') {
    stopLoss = stopLoss.toFixed(stopLoss < 10 ? 5 : 2);
  } else if (stopLoss && typeof stopLoss === 'string' && !isNaN(parseFloat(stopLoss))) {
    stopLoss = parseFloat(stopLoss).toFixed(parseFloat(stopLoss) < 10 ? 5 : 2);
  }

  // Extract take profit with multiple fallback paths
  let takeProfit1 =
    tradeSetup.takeProfit?.[0]?.price ||
    tradeSetup.takeProfit?.[0] ||
    tradeSetup.takeProfitPrices?.[0] ||
    tradeSetup.take_profit?.[0]?.price ||
    tradeSetup.take_profit?.[0] ||
    (Array.isArray(tradeSetup.takeProfit) && tradeSetup.takeProfit[0]) ||
    null;

  // Ensure take profit is a number and format it
  if (takeProfit1 && typeof takeProfit1 === 'number') {
    takeProfit1 = takeProfit1.toFixed(takeProfit1 < 10 ? 5 : 2);
  } else if (takeProfit1 && typeof takeProfit1 === 'string' && !isNaN(parseFloat(takeProfit1))) {
    takeProfit1 = parseFloat(takeProfit1).toFixed(parseFloat(takeProfit1) < 10 ? 5 : 2);
  }

  console.log('[AnalysisPage] Extracted values:', { entry, stopLoss, takeProfit1 });

  // Calculate risk/reward ratio
  let riskReward = tradeSetup.riskReward || tradeSetup.risk_reward;

  // If riskReward is not provided or invalid, calculate it
  if (!riskReward || isNaN(Number(riskReward))) {
    const entryNum = parseFloat(entry);
    const stopLossNum = parseFloat(stopLoss);
    const takeProfitNum = parseFloat(takeProfit1);

    if (!isNaN(entryNum) && !isNaN(stopLossNum) && !isNaN(takeProfitNum)) {
      const risk = Math.abs(entryNum - stopLossNum);
      const reward = Math.abs(takeProfitNum - entryNum);

      if (risk > 0) {
        riskReward = reward / risk;
        console.log('[AnalysisPage] Calculated R:R:', riskReward, '(Risk:', risk, 'Reward:', reward, ')');
      }
    }
  }

  console.log('[AnalysisPage] Final riskReward:', riskReward);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header with Chart Image */}
      <div className="relative">
        <div className="aspect-[16/10] w-full bg-muted relative">
          {analysis.image_url && (
            <Image
              src={analysis.image_url}
              alt="Chart"
              fill
              className="object-contain"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Floating back button */}
        <Link
          href="/history"
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm border rounded-full p-2 hover:bg-background transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>

        {/* Share button */}
        <button className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm border rounded-full p-2 hover:bg-background transition-all">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 -mt-8 relative z-10">
        {/* Trade Levels Card - Always show, prominent placement */}
        <div className="bg-card border-2 border-primary/20 rounded-2xl p-4 mb-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Trade Levels</h2>
            {riskReward && (
              <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                R:R 1:{Number(riskReward).toFixed(1)}
              </div>
            )}
          </div>
          <div className="space-y-3">
            {/* Entry Point */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 rounded-full p-2">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold">Entry Point</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {entry || 'See chart'}
              </span>
            </div>

            {/* Stop Loss */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 rounded-full p-2">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold">Stop Loss</span>
              </div>
              <span className="text-lg font-bold text-red-600">
                {stopLoss || 'See chart'}
              </span>
            </div>

            {/* Take Profit */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 rounded-full p-2">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold">Take Profit</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {takeProfit1 || 'See chart'}
              </span>
            </div>
          </div>
        </div>

        {/* Bias Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
              bias === 'bullish'
                ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                : bias === 'bearish'
                ? 'bg-red-500/20 text-red-700 dark:text-red-400'
                : 'bg-muted'
            }`}
          >
            {bias === 'bullish' ? (
              <TrendingUp className="h-5 w-5" />
            ) : bias === 'bearish' ? (
              <TrendingDown className="h-5 w-5" />
            ) : (
              <Minus className="h-5 w-5" />
            )}
            <span className="capitalize">{bias}</span>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 mb-4">
            <h2 className="text-lg font-bold mb-2">Summary</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        {/* Market Structure */}
        {marketStructure.trend && (
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 mb-4">
            <h2 className="text-lg font-bold mb-3">Market Structure</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Trend</span>
                <span className="font-medium capitalize">
                  {marketStructure.trend}
                </span>
              </div>
              {marketStructure.phase && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Phase</span>
                  <span className="font-medium capitalize">
                    {marketStructure.phase}
                  </span>
                </div>
              )}
              {marketStructure.strength && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Strength
                  </span>
                  <span className="font-medium capitalize">
                    {marketStructure.strength}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Blocks */}
        {orderBlocks.length > 0 && (
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 mb-4">
            <h2 className="text-lg font-bold mb-3">
              Order Blocks ({orderBlocks.length})
            </h2>
            <div className="space-y-2">
              {orderBlocks.slice(0, 3).map((ob: any, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      ob.type === 'bullish' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium capitalize">{ob.type} OB</p>
                    <p className="text-xs text-muted-foreground">
                      {ob.high} - {ob.low}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FVGs */}
        {fvgs.length > 0 && (
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 mb-4">
            <h2 className="text-lg font-bold mb-3">
              Fair Value Gaps ({fvgs.length})
            </h2>
            <div className="space-y-2">
              {fvgs.slice(0, 3).map((fvg: any, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      fvg.type === 'bullish' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium capitalize">{fvg.type} FVG</p>
                    <p className="text-xs text-muted-foreground">
                      {fvg.high} - {fvg.low}
                      {fvg.filled ? ' (Filled)' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liquidity */}
        {(liquidity.buySide || liquidity.sellSide) && (
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 mb-4">
            <h2 className="text-lg font-bold mb-3">Liquidity Zones</h2>
            <div className="space-y-3">
              {liquidity.buySide && liquidity.buySide.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">
                    Buy Side
                  </p>
                  {liquidity.buySide.slice(0, 2).map((liq: any, idx: number) => (
                    <p key={idx} className="text-xs text-muted-foreground">
                      {liq.price} - {liq.type}
                    </p>
                  ))}
                </div>
              )}
              {liquidity.sellSide && liquidity.sellSide.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-600 mb-1">
                    Sell Side
                  </p>
                  {liquidity.sellSide.slice(0, 2).map((liq: any, idx: number) => (
                    <p key={idx} className="text-xs text-muted-foreground">
                      {liq.price} - {liq.type}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Insights */}
        {insights.narrative && (
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 mb-4">
            <h2 className="text-lg font-bold mb-2">Key Insights</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insights.narrative}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        {disclaimer && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">
                  Educational Disclaimer
                </p>
                <p className="text-xs text-orange-600/80 leading-relaxed">
                  {disclaimer}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Info */}
        <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4 mb-4">
          <p className="text-xs text-muted-foreground text-center">
            Analyzed on {new Date(analysis.created_at).toLocaleDateString()} at{' '}
            {new Date(analysis.created_at).toLocaleTimeString()}
          </p>
          {analysis.cache_hit && (
            <p className="text-xs text-muted-foreground text-center mt-1">
              Cached result for consistency
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
