import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { ShareButton } from '@/components/analysis/share-button';
import { AnalysisResults } from '@/components/analysis/analysis-results';
import { DetailedAnalysisCard } from '@/components/analysis/detailed-analysis-card';
import {
  Shield,
  TrendingUp,
  Layers,
  Droplets,
  Boxes,
  Target,
  BarChart3,
  Lightbulb,
} from 'lucide-react';

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params as required by Next.js 15
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

  // Safely parse analysis_data
  let analysisData: any = {};
  try {
    analysisData = typeof analysis.analysis_data === 'string'
      ? JSON.parse(analysis.analysis_data)
      : (analysis.analysis_data || {});
  } catch (e) {
    console.error('Failed to parse analysis_data:', e);
    analysisData = {};
  }

  // Handle both camelCase and snake_case property names for backward compatibility
  const marketStructure = analysisData.marketStructure || analysisData.market_structure || null;
  const orderBlocks = Array.isArray(analysisData.orderBlocks)
    ? analysisData.orderBlocks
    : Array.isArray(analysisData.order_blocks)
    ? analysisData.order_blocks
    : [];
  const fvgs = Array.isArray(analysisData.fvgs)
    ? analysisData.fvgs
    : Array.isArray(analysisData.fair_value_gaps)
    ? analysisData.fair_value_gaps
    : [];
  const liquidity = analysisData.liquidity || analysisData.liquidity_zones || null;
  const premiumDiscount = analysisData.premiumDiscount || analysisData.premium_discount || null;
  const tradeSetup = analysisData.tradeSetup ||
    (Array.isArray(analysisData.trade_setups) && analysisData.trade_setups.length > 0
      ? analysisData.trade_setups[0]
      : null);
  const educationalInsights = analysisData.educational_insights || null;
  const summary = analysisData.summary || null;
  const disclaimer = analysisData.disclaimer || null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/history">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chart Analysis</h1>
            <p className="text-muted-foreground">
              Analyzed on {new Date(analysis.created_at).toLocaleDateString()}{' '}
              at {new Date(analysis.created_at).toLocaleTimeString()}
            </p>
          </div>

          <ShareButton analysisId={id} />
        </div>
      </div>

      {/* Disclaimer */}
      {disclaimer && (
        <Card className="mb-8 border-orange-500/30 bg-orange-950/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-400 mb-1">
                  Educational Disclaimer
                </h3>
                <p className="text-sm text-orange-200/90 leading-relaxed">
                  {disclaimer}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart Image */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            {analysis.image_url && (
              <Image
                src={analysis.image_url}
                alt="Chart"
                fill
                className="object-contain"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {summary && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis - Modern Card Style (PWA Optimized) */}
      <DetailedAnalysisCard
        title="Detailed Analysis"
        className="mb-8"
        sections={[
          {
            id: 'validation',
            number: 1,
            title: 'Validation & Invalidation Criteria',
            description: tradeSetup?.invalidation?.condition ||
              'Key levels that validate or invalidate the trade setup',
            icon: <Shield className="h-5 w-5" />,
            isExpandable: !!tradeSetup?.invalidation,
            content: tradeSetup?.invalidation && (
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Invalidation Price
                  </span>
                  <p className="text-sm font-semibold">
                    {tradeSetup.invalidation.price?.toFixed(2) || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Condition
                  </span>
                  <p className="text-sm">{tradeSetup.invalidation.condition}</p>
                </div>
              </div>
            ),
          },
          {
            id: 'trend',
            number: 2,
            title: 'General Trend',
            description: marketStructure
              ? `${marketStructure.trend || 'Analyzing'} trend with ${marketStructure.strength || 'moderate'} strength`
              : 'Market trend analysis and direction',
            icon: <TrendingUp className="h-5 w-5" />,
            badge: marketStructure?.trend?.toUpperCase(),
            isExpandable: !!marketStructure,
            content: marketStructure && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Trend
                    </span>
                    <p className="text-sm font-semibold capitalize">
                      {marketStructure.trend}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Phase
                    </span>
                    <p className="text-sm font-semibold capitalize">
                      {marketStructure.phase || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Strength
                    </span>
                    <p className="text-sm font-semibold capitalize">
                      {marketStructure.strength || 'Moderate'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      BOS Levels
                    </span>
                    <p className="text-sm font-semibold">
                      {marketStructure.bos_levels?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: 'structure',
            number: 3,
            title: 'Market Structure',
            description: `${marketStructure?.bos_levels?.length || 0} BOS levels, ${marketStructure?.choch_levels?.length || 0} CHoCH points identified`,
            icon: <Layers className="h-5 w-5" />,
            isExpandable: true,
          },
          {
            id: 'liquidity',
            number: 4,
            title: 'Liquidity Zones',
            description: liquidity
              ? `${liquidity.buySide?.length || 0} buy-side, ${liquidity.sellSide?.length || 0} sell-side zones`
              : 'Key liquidity areas and potential sweep zones',
            icon: <Droplets className="h-5 w-5" />,
            isExpandable: !!liquidity,
            content: liquidity && (
              <div className="space-y-3">
                {liquidity.buySide && liquidity.buySide.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-emerald-400">
                      Buy-Side Liquidity
                    </span>
                    <div className="mt-1 space-y-1">
                      {liquidity.buySide.slice(0, 3).map((zone: any, i: number) => (
                        <div
                          key={i}
                          className="text-sm flex justify-between items-center"
                        >
                          <span>{zone.type}</span>
                          <span className="font-mono">
                            {zone.price?.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {liquidity.sellSide && liquidity.sellSide.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-rose-400">
                      Sell-Side Liquidity
                    </span>
                    <div className="mt-1 space-y-1">
                      {liquidity.sellSide.slice(0, 3).map((zone: any, i: number) => (
                        <div
                          key={i}
                          className="text-sm flex justify-between items-center"
                        >
                          <span>{zone.type}</span>
                          <span className="font-mono">
                            {zone.price?.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ),
          },
          {
            id: 'order-blocks',
            number: 5,
            title: 'Order Blocks and Fair Value Gaps',
            description: `${orderBlocks?.length || 0} order blocks, ${fvgs?.length || 0} FVGs identified`,
            icon: <Boxes className="h-5 w-5" />,
            isExpandable: !!(orderBlocks?.length || fvgs?.length),
            content: (orderBlocks?.length || fvgs?.length) && (
              <div className="space-y-3">
                {orderBlocks && orderBlocks.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Order Blocks
                    </span>
                    <div className="mt-1 space-y-1">
                      {orderBlocks.slice(0, 2).map((ob: any, i: number) => (
                        <div
                          key={i}
                          className="text-sm p-2 rounded bg-muted/50 border border-border/40"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="capitalize font-medium">
                              {ob.type} OB
                            </span>
                            <span className="text-xs capitalize">
                              {ob.strength} strength
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {ob.high?.toFixed(2)} - {ob.low?.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {fvgs && fvgs.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Fair Value Gaps
                    </span>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {fvgs.length} FVG{fvgs.length > 1 ? 's' : ''} detected
                    </div>
                  </div>
                )}
              </div>
            ),
          },
          {
            id: 'price-action',
            number: 6,
            title: 'Price Action Analysis',
            description: premiumDiscount
              ? `Currently in ${premiumDiscount.current_position} zone`
              : 'Premium and discount zones analysis',
            icon: <Target className="h-5 w-5" />,
            badge: premiumDiscount?.current_position?.toUpperCase(),
            isExpandable: !!premiumDiscount,
            content: premiumDiscount && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Equilibrium
                    </span>
                    <p className="text-sm font-semibold font-mono">
                      {premiumDiscount.equilibrium?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Range %
                    </span>
                    <p className="text-sm font-semibold">
                      {premiumDiscount.range_percentage?.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="h-2 bg-gradient-to-r from-rose-500 via-yellow-500 to-emerald-500 rounded-full" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Discount</span>
                    <span>Equilibrium</span>
                    <span>Premium</span>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: 'indicators',
            number: 7,
            title: 'Indicator Analysis',
            description: educationalInsights
              ? 'Indicators are not visible on the chart. Focus on price action and key levels for potential setups.'
              : 'Technical indicators and oscillators',
            icon: <BarChart3 className="h-5 w-5" />,
            isExpandable: false,
          },
          {
            id: 'tips',
            number: 8,
            title: 'Tips',
            description: educationalInsights?.learning_points?.[0] ||
              'Key trading insights and recommendations',
            icon: <Lightbulb className="h-5 w-5" />,
            isExpandable: !!(educationalInsights?.learning_points?.length),
            content: educationalInsights?.learning_points && (
              <div className="space-y-2">
                {educationalInsights.learning_points.map((tip: string, i: number) => (
                  <div
                    key={i}
                    className="flex gap-2 items-start text-sm"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />

      {/* Analysis Results with Animations */}
      <AnalysisResults
        marketStructure={marketStructure}
        tradeSetup={tradeSetup}
        premiumDiscount={premiumDiscount}
        orderBlocks={orderBlocks}
        fvgs={fvgs}
        liquidity={liquidity}
        educationalInsights={educationalInsights}
      />
    </div>
  );
}
