import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BarChart3, ArrowLeft } from 'lucide-react';

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all analyses for the user
  const { data: analyses, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2 gradient-text">Analysis History</h1>
        <p className="text-muted-foreground">
          View and manage your past chart analyses
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card hover-glow transition-all hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Total Analyses
              </p>
              <p className="text-3xl font-bold">{analyses?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glow transition-all hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">This Month</p>
              <p className="text-3xl font-bold">
                {
                  analyses?.filter((a) => {
                    const date = new Date(a.created_at);
                    const now = new Date();
                    return (
                      date.getMonth() === now.getMonth() &&
                      date.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glow transition-all hover:-translate-y-1">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">This Week</p>
              <p className="text-3xl font-bold">
                {
                  analyses?.filter((a) => {
                    const date = new Date(a.created_at);
                    const now = new Date();
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return date >= weekAgo;
                  }).length
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analyses List */}
      {analyses && analyses.length > 0 ? (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="glass-card hover-glow transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Thumbnail */}
                  <div className="w-32 h-32 rounded-lg bg-muted relative overflow-hidden flex-shrink-0">
                    {analysis.image_url && (
                      <img
                        src={analysis.image_url}
                        alt="Chart"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1">
                          Analysis #{analysis.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {new Date(analysis.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}{' '}
                          at{' '}
                          {new Date(analysis.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-3">
                          {analysis.analysis_data?.marketStructure && (
                            <div className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                              Trend: {analysis.analysis_data.marketStructure.trend}
                            </div>
                          )}
                          {analysis.analysis_data?.tradeSetup && (
                            <div className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                              Bias: {analysis.analysis_data.tradeSetup.bias}
                            </div>
                          )}
                          {analysis.analysis_data?.tradeSetup && (
                            <div className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                              R:R 1:{analysis.analysis_data.tradeSetup.riskReward.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link href={`/analysis/${analysis.id}`}>
                        <Button className="hover-glow">
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="py-16">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No analyses yet</h3>
              <p className="text-muted-foreground mb-6">
                Start analyzing charts to build your history
              </p>
              <Link href="/analyze">
                <Button size="lg">
                  Analyze Your First Chart <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
