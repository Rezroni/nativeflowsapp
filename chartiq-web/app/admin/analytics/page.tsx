import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react'

export const metadata = {
  title: 'Analytics | Admin',
  description: 'Platform analytics and insights'
}

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Get analytics data
  const { data: analyses } = await supabase
    .from('analyses')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: users } = await supabase
    .from('profiles')
    .select('created_at')

  // Calculate metrics
  const totalAnalyses = analyses?.length || 0
  const last7DaysAnalyses = analyses?.filter(
    a => new Date(a.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  )?.length || 0

  const last30DaysAnalyses = analyses?.filter(
    a => new Date(a.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  )?.length || 0

  const last7DaysUsers = users?.filter(
    u => new Date(u.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  )?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed platform analytics and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnalyses}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{last7DaysAnalyses}</div>
            <p className="text-xs text-muted-foreground mt-1">Analyses this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{last30DaysAnalyses}</div>
            <p className="text-xs text-muted-foreground mt-1">Analyses this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users (7d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{last7DaysUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Analysis by Market Type */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Breakdown</CardTitle>
          <CardDescription>Analysis distribution by market type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['forex', 'crypto', 'stocks', 'commodities'].map((marketType) => {
              const count = analyses?.filter(a => a.market_type === marketType)?.length || 0
              const percentage = totalAnalyses > 0 ? (count / totalAnalyses) * 100 : 0

              return (
                <div key={marketType} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize font-medium">{marketType}</span>
                    <span className="text-muted-foreground">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
          <CardDescription>Latest chart analyses performed</CardDescription>
        </CardHeader>
        <CardContent>
          {!analyses || analyses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No analyses yet
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.slice(0, 10).map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <div className="font-medium">
                      {analysis.market_type ? `${analysis.market_type.toUpperCase()}` : 'Unknown'} Analysis
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(analysis.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID: {analysis.id.slice(0, 8)}
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
