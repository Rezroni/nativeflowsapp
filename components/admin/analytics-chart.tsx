'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AnalyticsChartProps {
  type: 'users' | 'revenue'
}

export function AnalyticsChart({ type }: AnalyticsChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Get last 30 days of data
      const { data: analyticsData } = await supabase
        .from('analytics_daily')
        .select('*')
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('date', { ascending: true })

      setData(analyticsData || [])
      setLoading(false)
    }

    fetchData()
  }, [type])

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart data...</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-muted-foreground">No data available yet</div>
      </div>
    )
  }

  // Simple bar chart visualization
  const maxValue = Math.max(...data.map(d => type === 'users' ? d.new_users : d.total_revenue))

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 h-48">
        {data.map((item, index) => {
          const value = type === 'users' ? item.new_users : item.total_revenue
          const height = (value / maxValue) * 100

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                style={{ height: `${height}%`, minHeight: '4px' }}
                title={`${value} ${type === 'users' ? 'users' : '$'}`}
              />
              <div className="text-xs text-muted-foreground">
                {new Date(item.date).getDate()}
              </div>
            </div>
          )
        })}
      </div>
      <div className="text-xs text-muted-foreground text-center">
        Last 30 days
      </div>
    </div>
  )
}
