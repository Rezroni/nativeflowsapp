import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, BarChart3, DollarSign, Activity, Clock } from 'lucide-react'
import { RecentActivityList } from '@/components/admin/recent-activity-list'
import { AnalyticsChart } from '@/components/admin/analytics-chart'

export const metadata = {
  title: 'Admin Dashboard | Nativeflows',
  description: 'Admin dashboard with analytics and insights'
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get dashboard stats
  const { data: stats } = await supabase
    .rpc('get_dashboard_stats')

  // Get recent activity
  const { data: recentActivity } = await supabase
    .rpc('get_recent_activity', { limit_count: 10 })

  const dashboardStats = stats || {
    total_users: 0,
    active_subscriptions: 0,
    total_analyses: 0,
    analyses_today: 0,
    new_users_this_week: 0,
    new_users_this_month: 0,
    revenue_this_month: 0,
    mrr: 0,
    trial_conversion_rate: 0
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform performance and key metrics
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={dashboardStats.total_users.toLocaleString()}
          description={`+${dashboardStats.new_users_this_week} this week`}
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
        <StatCard
          title="Active Subscriptions"
          value={dashboardStats.active_subscriptions.toLocaleString()}
          description="Paying customers"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
        />
        <StatCard
          title="Total Analyses"
          value={dashboardStats.total_analyses.toLocaleString()}
          description={`${dashboardStats.analyses_today} today`}
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <StatCard
          title="MRR"
          value={`$${dashboardStats.mrr.toLocaleString()}`}
          description={`$${dashboardStats.revenue_this_month.toLocaleString()} this month`}
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users (Month)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.new_users_this_month}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.trial_conversion_rate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 90 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Analyses/User</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.total_users > 0
                ? (dashboardStats.total_analyses / dashboardStats.total_users).toFixed(1)
                : '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per user lifetime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New users over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart type="users" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly recurring revenue trend</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart type="revenue" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
          <CardDescription>Latest user activities across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivityList activities={recentActivity || []} />
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: 'up' | 'down'
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
