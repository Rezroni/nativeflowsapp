import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, TrendingUp, DollarSign, Users } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

export const metadata = {
  title: 'Subscriptions | Admin',
  description: 'Manage subscriptions'
}

export default async function SubscriptionsPage() {
  const supabase = await createClient()

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*, profiles(email, full_name)')
    .order('created_at', { ascending: false })

  const activeSubscriptions = subscriptions?.filter(s => s.status === 'active') || []
  const trialingSubscriptions = subscriptions?.filter(s => s.status === 'trialing') || []
  const canceledSubscriptions = subscriptions?.filter(s => s.status === 'canceled') || []

  const totalMRR = activeSubscriptions.reduce((sum, sub) => {
    if (sub.plan_type === 'monthly') return sum + 29.99
    if (sub.plan_type === 'annual') return sum + (299.99 / 12)
    return sum
  }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Subscriptions</h1>
        <p className="text-muted-foreground">
          Manage and monitor all subscriptions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trialing</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trialingSubscriptions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceled</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{canceledSubscriptions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMRR.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
          <CardDescription>A list of all subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          {!subscriptions || subscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No subscriptions found
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {subscription.profiles?.email || 'Unknown user'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {subscription.profiles?.full_name || 'No name set'}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium capitalize">
                        {subscription.plan_type || 'free'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {subscription.plan_type === 'monthly' && '$29.99/mo'}
                        {subscription.plan_type === 'annual' && '$299.99/yr'}
                        {subscription.plan_type === 'free' && 'Free'}
                      </div>
                    </div>

                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          subscription.status === 'active'
                            ? 'bg-green-500/10 text-green-500'
                            : subscription.status === 'trialing'
                            ? 'bg-blue-500/10 text-blue-500'
                            : subscription.status === 'canceled'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-gray-500/10 text-gray-500'
                        }`}
                      >
                        {subscription.status}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground text-right w-40">
                      {subscription.current_period_end && (
                        <div>
                          Renews {format(new Date(subscription.current_period_end), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
