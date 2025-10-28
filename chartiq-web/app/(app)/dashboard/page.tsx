import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user's profile and stats
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: analyses, count: totalAnalyses } = await supabase
    .from('analyses')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Calculate usage for current month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: monthlyAnalyses } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfMonth.toISOString());

  const planLimits = {
    free: 5,
    pro_monthly: 100,
    pro_annual: 100,
    enterprise: 999999,
  };

  const currentPlan = subscription?.plan_id || 'free';
  const limit = planLimits[currentPlan as keyof typeof planLimits] || 5;
  const usagePercent = ((monthlyAnalyses || 0) / limit) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">
          Welcome back, {profile?.full_name || user.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your trading analysis journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Analyses */}
        <Card className="glass-card hover-glow transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Analyses
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnalyses || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time chart analyses
            </p>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card className="glass-card hover-glow transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyAnalyses || 0}</div>
            <p className="text-xs text-muted-foreground">
              {limit - (monthlyAnalyses || 0)} remaining
            </p>
          </CardContent>
        </Card>

        {/* Current Plan */}
        <Card className="glass-card hover-glow transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {currentPlan.replace('_', ' ')}
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {limit === 999999 ? 'Unlimited' : `${limit} analyses/month`}
            </p>
            {currentPlan === 'free' && (
              <Link href="/pricing">
                <Button size="sm" className="w-full text-xs">
                  Upgrade to Pro
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Last Analysis */}
        <Card className="glass-card hover-glow transition-all hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Analysis</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyses && analyses.length > 0
                ? new Date(analyses[0].created_at).toLocaleDateString()
                : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              {analyses && analyses.length > 0
                ? new Date(analyses[0].created_at).toLocaleTimeString()
                : 'Upload your first chart'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card className="mb-8 glass-card">
        <CardHeader>
          <CardTitle>Monthly Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {monthlyAnalyses || 0} of {limit === 999999 ? '∞' : limit}{' '}
                analyses used
              </span>
              <span className="text-muted-foreground">
                {limit === 999999 ? '0' : usagePercent.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${Math.min(usagePercent, 100)}%`,
                }}
              />
            </div>
            {usagePercent > 80 && limit !== 999999 && (
              <p className="text-sm text-yellow-600">
                You're running low on analyses this month. Consider upgrading
                your plan.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 border-primary glass-card hover-glow transition-all hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Analyze New Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a chart and get instant SMC analysis with AI-powered
              insights
            </p>
            <Link href="/analyze">
              <Button className="w-full hover-glow">
                Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-card hover-glow transition-all hover:-translate-y-1">
          <CardHeader>
            <CardTitle>View History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Review your past analyses and track your trading progress
            </p>
            <Link href="/history">
              <Button variant="outline" className="w-full">
                View All Analyses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analyses */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Analyses</CardTitle>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {analyses && analyses.length > 0 ? (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded bg-muted relative overflow-hidden">
                      {analysis.image_url && (
                        <img
                          src={analysis.image_url}
                          alt="Chart"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        Analysis #{analysis.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(analysis.created_at).toLocaleDateString()} at{' '}
                        {new Date(analysis.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Link href={`/analysis/${analysis.id}`}>
                    <Button variant="ghost" size="sm">
                      View <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No analyses yet. Upload your first chart to get started!
              </p>
              <Link href="/analyze">
                <Button>Start Your First Analysis</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
