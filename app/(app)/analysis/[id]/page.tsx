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
