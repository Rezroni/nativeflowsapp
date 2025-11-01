import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { NotificationPreferencesCard } from '@/components/notifications/notification-preferences';
import { ProfileForm } from '@/components/settings/profile-form';
import Link from 'next/link';

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch subscription with correct ordering
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const planDisplayNames: Record<string, string> = {
    weekly: 'Weekly Plan',
    monthly: 'Monthly Plan',
    annual: 'Annual Plan',
    free: 'Free Trial',
  };

  // Use plan_type instead of plan_id
  const currentPlan = subscription?.plan_type || 'free';
  const planName = planDisplayNames[currentPlan] || 'Free';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm
              email={user.email || ''}
              fullName={profile?.full_name}
              username={profile?.username}
            />
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Manage your subscription plan</CardDescription>
              </div>
              <Badge
                variant={subscription?.status === 'active' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {subscription?.status === 'active' ? planName : 'Free'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-lg font-semibold capitalize">
                  {planName}
                </p>
              </div>
              {subscription?.current_period_end && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {subscription.cancel_at_period_end ? 'Expires' : 'Renews'} On
                  </p>
                  <p className="text-lg font-semibold">
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {subscription?.status === 'active' && (
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm">
                  <span className="font-medium">Status:</span> Active
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  You have unlimited analyses with {planName}
                </p>
              </div>
            )}

            <Separator />

            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/pricing">
                <Button variant="outline" className="w-full sm:w-auto">View Plans</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>
              Track your analysis usage and limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Usage statistics coming soon
            </p>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <NotificationPreferencesCard />

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <Button variant="destructive" disabled>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
