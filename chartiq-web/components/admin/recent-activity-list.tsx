'use client'

import { Activity, BarChart3, CreditCard } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ActivityItem {
  id: string
  activity_type: string
  description: string
  user_email: string
  created_at: string
}

interface RecentActivityListProps {
  activities: ActivityItem[]
}

export function RecentActivityList({ activities }: RecentActivityListProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent activity
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
        >
          <div className="mt-0.5">
            {activity.activity_type === 'analysis' && (
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
            )}
            {activity.activity_type === 'subscription' && (
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-green-500" />
              </div>
            )}
            {activity.activity_type === 'activity' && (
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-purple-500" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{activity.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {activity.user_email}
            </p>
          </div>

          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  )
}
