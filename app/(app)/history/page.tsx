import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { History, TrendingUp, TrendingDown, Minus, Home } from 'lucide-react';
import Image from 'next/image';

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all analyses for the user
  const { data: analyses } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const thisMonthCount = analyses?.filter((a) => {
    const date = new Date(a.created_at);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Analysis History</h1>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-card border rounded-xl hover:bg-accent transition-all active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          {analyses?.length || 0} total analyses • {thisMonthCount} this month
        </p>
      </div>

      {/* Analyses List */}
      {analyses && analyses.length > 0 ? (
        <div className="px-4 space-y-3">
          {analyses.map((analysis) => {
            // Parse analysis data safely
            let analysisData: any = {};
            try {
              analysisData =
                typeof analysis.analysis_data === 'string'
                  ? JSON.parse(analysis.analysis_data)
                  : analysis.analysis_data || {};
            } catch (e) {
              console.error('Failed to parse analysis_data:', e);
            }

            // Extract all possible fields
            const trend = analysisData.marketStructure?.trend || analysisData.market_structure?.trend;
            const bias = analysisData.tradeSetup?.bias || analysisData.trade_setups?.[0]?.bias || analysisData.marketStructure?.trend || 'neutral';
            const rr = analysisData.tradeSetup?.riskReward || analysisData.trade_setups?.[0]?.riskReward;

            return (
              <Link href={`/analysis/${analysis.id}`} key={analysis.id}>
                <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-3 transition-all active:scale-[0.98] hover:border-primary/50">
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg bg-muted relative overflow-hidden flex-shrink-0">
                      {analysis.image_url && (
                        <Image
                          src={analysis.image_url}
                          alt="Chart"
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            Analysis #{analysis.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(analysis.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            {new Date(analysis.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        {/* Bias Icon - Always show */}
                        <div
                          className={`rounded-full p-1.5 ${
                            bias === 'bullish'
                              ? 'bg-green-500/20'
                              : bias === 'bearish'
                              ? 'bg-red-500/20'
                              : 'bg-muted'
                          }`}
                        >
                          {bias === 'bullish' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : bias === 'bearish' ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : (
                            <Minus className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* Tags - Always show at least bias */}
                      <div className="flex flex-wrap gap-1.5">
                        {trend && (
                          <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium capitalize">
                            {trend}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${
                            bias === 'bullish'
                              ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                              : bias === 'bearish'
                              ? 'bg-red-500/20 text-red-700 dark:text-red-400'
                              : 'bg-muted'
                          }`}
                        >
                          {bias}
                        </span>
                        {rr && (
                          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                            R:R 1:{Number(rr).toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="px-4">
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No analyses yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start analyzing charts to build your history
            </p>
            <Link href="/analyze">
              <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all active:scale-95">
                Analyze First Chart
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
