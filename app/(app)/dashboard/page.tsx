import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Plus, History, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Calculate start of month for usage stats
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Parallelize all database queries for faster page load
  const [
    { data: profile },
    { data: subscription },
    { data: analyses, count: totalAnalyses },
    { count: monthlyAnalyses },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, username')
      .eq('id', user.id)
      .single(),
    supabase
      .from('subscriptions')
      .select('plan_type, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('analyses')
      .select('id, image_url, created_at', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString()),
  ]);

  const currentPlan = subscription?.plan_type || null;
  const hasActivePlan = currentPlan !== null;
  const userName = profile?.username || profile?.full_name || user.email?.split('@')[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Simplified Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold mb-1">
          {t('welcome')}, {userName}!
        </h1>
        <p className="text-sm text-muted-foreground">
          {hasActivePlan ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
              <span className="capitalize">{currentPlan}</span> {t('plan')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted flex-shrink-0"></span>
              {t('noPlan')}
            </span>
          )}
        </p>
      </div>

      {/* Stats Overview - Simplified Cards */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Total Analyses */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-primary/10 rounded-full p-2.5">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">{t('stats.allTime')}</span>
            </div>
            <div className="text-3xl font-bold">{totalAnalyses || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">{t('stats.totalAnalyses')}</div>
          </div>

          {/* This Month */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-primary/10 rounded-full p-2.5">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">{t('stats.thisMonth')}</span>
            </div>
            <div className="text-3xl font-bold">{monthlyAnalyses || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">{t('analysesUsed')}</div>
          </div>
        </div>
      </div>

      {/* Primary Action - Prominent CTA */}
      <div className="px-4 pb-6">
        {hasActivePlan ? (
          <Link href="/analyze" className="block">
            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl p-5 transition-all active:scale-[0.98] shadow-lg shadow-primary/20">
              <div className="flex items-center justify-between gap-4">
                <div className="text-left flex-1">
                  <div className="text-lg font-bold mb-1">{t('analyzeNewChart')}</div>
                  <div className="text-sm opacity-90 line-clamp-2">{t('analyzeDescription')}</div>
                </div>
                <div className="bg-white/20 rounded-full p-2.5 flex-shrink-0">
                  <Plus className="h-6 w-6" />
                </div>
              </div>
            </button>
          </Link>
        ) : (
          <Link href="/pricing" className="block">
            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl p-5 transition-all active:scale-[0.98] shadow-lg shadow-primary/20">
              <div className="flex items-center justify-between gap-4">
                <div className="text-left flex-1">
                  <div className="text-lg font-bold mb-1">{t('viewPlans')}</div>
                  <div className="text-sm opacity-90 line-clamp-2">{t('subscribeToAnalyze')}</div>
                </div>
                <div className="bg-white/20 rounded-full p-2.5 flex-shrink-0">
                  <Plus className="h-6 w-6" />
                </div>
              </div>
            </button>
          </Link>
        )}
      </div>

      {/* Recent Analyses - Clean List */}
      {analyses && analyses.length > 0 && (
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t('recentAnalyses')}</h2>
            <Link href="/history">
              <Button variant="ghost" size="sm" className="text-xs h-8">
                {t('viewAll')}
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {analyses.map((analysis) => (
              <Link href={`/analysis/${analysis.id}`} key={analysis.id}>
                <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-3 transition-all active:scale-[0.98] hover:border-primary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-muted relative overflow-hidden flex-shrink-0">
                      {analysis.image_url && (
                        <Image
                          src={analysis.image_url}
                          alt="Chart"
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {t('analysisId', { id: analysis.id.slice(0, 8) })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-muted-foreground flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!analyses || analyses.length === 0) && (
        <div className="px-4 pb-6">
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">{t('noAnalyses')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('noAnalysesDescription')}
            </p>
            {hasActivePlan && (
              <Link href="/analyze">
                <Button size="sm">{t('startFirstAnalysis')}</Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Secondary Action */}
      <div className="px-4 pb-8">
        <Link href="/history" className="block">
          <button className="w-full bg-card/50 backdrop-blur-sm border hover:border-primary/50 rounded-2xl p-4 transition-all active:scale-[0.98]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <History className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">{t('viewHistory')}</div>
                  <div className="text-xs text-muted-foreground">{t('viewHistoryDescription')}</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
}
