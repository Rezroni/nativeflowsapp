import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { MarketStructureCard } from '@/components/smc/market-structure-card';
import { OrderBlockCard } from '@/components/smc/order-block-card';
import { FVGCard } from '@/components/smc/fvg-card';
import { LiquidityCard } from '@/components/smc/liquidity-card';
import { PremiumDiscountCard } from '@/components/smc/premium-discount-card';
import { TradeSetupCard } from '@/components/smc/trade-setup-card';

export default async function AnalysisDetailPage({
  params,
}: {
  params: { id: string };
}) {
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
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !analysis) {
    notFound();
  }

  const analysisData = analysis.analysis_data;

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

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

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

      {/* Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Market Structure */}
        {analysisData.marketStructure && (
          <MarketStructureCard structure={analysisData.marketStructure} />
        )}

        {/* Trade Setup */}
        {analysisData.tradeSetup && (
          <TradeSetupCard setup={analysisData.tradeSetup} />
        )}
      </div>

      {/* Premium/Discount Zones */}
      {analysisData.premiumDiscount && (
        <div className="mb-8">
          <PremiumDiscountCard
            premiumDiscount={analysisData.premiumDiscount}
          />
        </div>
      )}

      {/* Order Blocks */}
      {analysisData.orderBlocks && analysisData.orderBlocks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Order Blocks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisData.orderBlocks.map((ob: any, index: number) => (
              <OrderBlockCard key={index} orderBlock={ob} />
            ))}
          </div>
        </div>
      )}

      {/* Fair Value Gaps */}
      {analysisData.fvgs && analysisData.fvgs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Fair Value Gaps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisData.fvgs.map((fvg: any, index: number) => (
              <FVGCard key={index} fvg={fvg} />
            ))}
          </div>
        </div>
      )}

      {/* Liquidity */}
      {analysisData.liquidity && (
        <div className="mb-8">
          <LiquidityCard liquidity={analysisData.liquidity} />
        </div>
      )}

      {/* Key Insights */}
      {analysisData.insights && (
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Market Narrative */}
            <div>
              <h3 className="font-semibold mb-2">Market Narrative</h3>
              <p className="text-sm text-muted-foreground">
                {analysisData.insights.narrative}
              </p>
            </div>

            {/* Smart Money Behavior */}
            <div>
              <h3 className="font-semibold mb-2">Smart Money Behavior</h3>
              <p className="text-sm text-muted-foreground">
                {analysisData.insights.smartMoneyBehavior}
              </p>
            </div>

            {/* Key Levels */}
            <div>
              <h3 className="font-semibold mb-2">Key Levels to Watch</h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.insights.keyLevels.map(
                  (level: number, index: number) => (
                    <div
                      key={index}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {level.toFixed(2)}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Scenarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-700 mb-2">
                  Bullish Scenario
                </h4>
                <p className="text-sm text-green-600">
                  {analysisData.insights.scenarios.bullish}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2">
                  Bearish Scenario
                </h4>
                <p className="text-sm text-red-600">
                  {analysisData.insights.scenarios.bearish}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Notes */}
      {analysisData.educationalNotes &&
        analysisData.educationalNotes.length > 0 && (
          <Card className="mt-8 border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-blue-700">
                Educational Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisData.educationalNotes.map(
                  (note: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-0.5">📚</span>
                      <span>{note}</span>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
