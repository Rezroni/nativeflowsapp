export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  trader_level: 'beginner' | 'intermediate' | 'advanced' | 'professional' | null
  trading_style: 'day_trader' | 'swing_trader' | 'position_trader' | 'scalper' | null
  preferred_markets: string[] | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export type Subscription = {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
  plan_type: 'free' | 'monthly' | 'annual'
  trial_start: string | null
  trial_end: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export type Analysis = {
  id: string
  user_id: string
  chart_image_url: string
  chart_image_hash: string | null
  user_analysis: any | null
  ai_analysis: any
  market_type: string | null
  timeframe: string | null
  symbol: string | null
  analysis_duration_ms: number | null
  cache_hit: boolean
  feedback_rating: number | null
  feedback_comment: string | null
  created_at: string
}

export type SavedSetup = {
  id: string
  user_id: string
  analysis_id: string | null
  setup_data: any
  notes: string | null
  status: 'active' | 'triggered' | 'completed' | 'invalidated'
  alert_enabled: boolean
  alert_price: number | null
  created_at: string
  updated_at: string
}

export type UsageLog = {
  id: string
  user_id: string
  action_type: string
  metadata: any | null
  created_at: string
}
