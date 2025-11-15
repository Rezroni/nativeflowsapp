-- Fix MRR calculation and add all missing dashboard stats
-- Weekly: $10, Monthly: $25, Annual: $250

CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT jsonb_build_object(
    'total_users', (SELECT count(*) FROM auth.users),
    'active_subscriptions', (
      SELECT count(*)
      FROM public.subscriptions
      WHERE status = 'active'
    ),
    'total_analyses', (SELECT count(*) FROM public.analyses),
    'analyses_today', (
      SELECT count(*) FROM public.analyses
      WHERE created_at >= current_date
    ),
    'new_users_this_week', (
      SELECT count(*) FROM public.profiles
      WHERE created_at >= current_date - interval '7 days'
    ),
    'new_users_this_month', (
      SELECT count(*) FROM public.profiles
      WHERE created_at >= current_date - interval '30 days'
    ),
    'revenue_this_month', (
      SELECT coalesce(sum(
        case
          when plan_type = 'weekly' then 10.00
          when plan_type = 'monthly' then 25.00
          when plan_type = 'annual' then 250.00
          else 0
        end
      ), 0)
      FROM public.subscriptions
      WHERE status = 'active'
        AND current_period_start >= current_date - interval '30 days'
    ),
    'mrr', (
      SELECT coalesce(sum(
        case
          when plan_type = 'weekly' then 10.00 * 4.33  -- Weekly to monthly: $43.30/month
          when plan_type = 'monthly' then 25.00
          when plan_type = 'annual' then 250.00 / 12   -- Annual to monthly: $20.83/month
          else 0
        end
      ), 0)
      FROM public.subscriptions
      WHERE status = 'active'
    ),
    'trial_conversion_rate', (
      SELECT coalesce(
        round(
          (count(*) filter (where status = 'active' and trial_end is not null)::numeric /
          nullif(count(*) filter (where trial_end is not null), 0)::numeric) * 100,
          2
        ),
        0
      )
      FROM public.subscriptions
      WHERE trial_end >= current_date - interval '90 days'
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users (function will check admin role internally)
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;
