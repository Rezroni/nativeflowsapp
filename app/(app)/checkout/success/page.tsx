import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch updated subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const planNames = {
    free: 'Free Trial',
    pro_monthly: 'Pro Monthly',
    pro_annual: 'Pro Annual',
    enterprise: 'Enterprise',
  };

  const planName = subscription?.plan_id
    ? planNames[subscription.plan_id as keyof typeof planNames]
    : 'Pro';

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="border-2 border-green-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl">Payment Successful!</CardTitle>
          <CardDescription className="text-base mt-2">
            Welcome to ChartIQ AI {planName}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Your subscription is now active</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>You have full access to all premium features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>A confirmation email has been sent to your inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Your receipt will be available in your email</span>
              </li>
            </ul>
          </div>

          {subscription && (
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-3">Subscription Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Plan</p>
                  <p className="font-medium">{planName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  <p className="font-medium capitalize">{subscription.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Started</p>
                  <p className="font-medium">
                    {new Date(subscription.current_period_start).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Renews</p>
                  <p className="font-medium">
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/analyze" className="flex-1">
              <Button size="lg" className="w-full">
                Start Analyzing Charts <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Need help? <Link href="/settings" className="text-primary hover:underline">
                Manage your subscription
              </Link> or contact support.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Getting Started Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Upload Your First Chart</h4>
            <p className="text-sm text-muted-foreground">
              Head to the Analyze page and upload a screenshot of your trading chart.
              You can use charts from TradingView, MT4, MT5, or any platform.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">2. Add Context (Optional)</h4>
            <p className="text-sm text-muted-foreground">
              Include timeframe, pair, or specific questions to get more tailored analysis.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">3. Review Your Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Get detailed SMC analysis including order blocks, FVGs, liquidity zones,
              and trade setup recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
