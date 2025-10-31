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
import Image from 'next/image';

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

  // Get active subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

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

  // Plan limits based on new structure
  const planLimits = {
    weekly: -1,   // unlimited
    monthly: -1,  // unlimited
    annual: -1,   // unlimited
  };

  const currentPlan = subscription?.plan_type || null;
  const limit = currentPlan ? planLimits[currentPlan as keyof typeof planLimits] : 0;
  const hasActivePlan = currentPlan !== null;
  const usagePercent = limit === -1 ? 0 : ((monthlyAnalyses || 0) / Math.max(limit, 1)) * 100;

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
              {hasActivePlan ? 'Unlimited analyses' : 'No active plan'}
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
              {currentPlan || 'No Plan'}
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {hasActivePlan ? 'Unlimited analyses' : 'Subscribe to start analyzing'}
            </p>
            {!hasActivePlan && (
              <Link href="/pricing">
                <Button size="sm" className="w-full text-xs">
                  View Plans
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

      {/* Usage Progress - Only show for active plans */}
      {hasActivePlan && (
        <Card className="mb-8 glass-card">
          <CardHeader>
            <CardTitle>Monthly Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {monthlyAnalyses || 0} analyses used this month
                </span>
                <span className="text-muted-foreground">
                  Unlimited
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: '100%',
                  }}
                />
              </div>
              <p className="text-sm text-green-600">
                You have unlimited analyses with your {currentPlan} plan
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 border-primary glass-card hover-glow transition-all hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Analyze New Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {hasActivePlan
                ? 'Upload a chart and get instant SMC analysis with AI-powered insights'
                : 'Subscribe to a plan to start analyzing charts with AI'}
            </p>
            {hasActivePlan ? (
              <Link href="/analyze">
                <Button className="w-full hover-glow">
                  Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/pricing">
                <Button className="w-full hover-glow">
                  View Plans <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
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
                        <Image
                          src={analysis.image_url}
                          alt="Chart"
                          fill
                          className="object-cover"
                          sizes="64px"
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
