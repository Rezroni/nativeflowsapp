/**
 * Script to fix MRR calculation in get_dashboard_stats function
 * Run with: node scripts/fix-mrr-calculation.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const fixMrrCalculationSQL = `
-- Fix MRR calculation to use correct current pricing
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
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT jsonb_build_object(
    'totalUsers', (SELECT count(*) FROM auth.users),
    'activeSubscriptions', (
      SELECT count(*)
      FROM public.subscriptions
      WHERE status = 'active'
    ),
    'totalRevenue', (
      SELECT coalesce(sum(
        case
          when plan_type = 'weekly' then 10.00
          when plan_type = 'monthly' then 25.00
          when plan_type = 'annual' then 250.00
          else 0
        end
      ), 0)
      FROM public.subscriptions
      WHERE status = 'active' OR status = 'past_due'
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
    'recentAnalyses', (
      SELECT coalesce(jsonb_agg(
        jsonb_build_object(
          'id', a.id,
          'user_id', a.user_id,
          'image_url', a.image_url,
          'created_at', a.created_at,
          'user_email', u.email
        ) ORDER BY a.created_at DESC
      ), '[]'::jsonb)
      FROM public.analyses a
      LEFT JOIN auth.users u ON u.id = a.user_id
      LIMIT 10
    ),
    'recentSubscriptions', (
      SELECT coalesce(jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'user_id', s.user_id,
          'plan_type', s.plan_type,
          'status', s.status,
          'created_at', s.created_at,
          'user_email', u.email
        ) ORDER BY s.created_at DESC
      ), '[]'::jsonb)
      FROM public.subscriptions s
      LEFT JOIN auth.users u ON u.id = s.user_id
      LIMIT 10
    ),
    'monthlyRevenue', (
      SELECT coalesce(jsonb_object_agg(
        to_char(month, 'YYYY-MM'),
        revenue
      ), '{}'::jsonb)
      FROM (
        SELECT
          date_trunc('month', created_at) as month,
          sum(
            case
              when plan_type = 'weekly' then 10.00
              when plan_type = 'monthly' then 25.00
              when plan_type = 'annual' then 250.00
              else 0
            end
          ) as revenue
        FROM public.subscriptions
        WHERE status IN ('active', 'past_due')
          AND created_at >= date_trunc('month', current_date) - interval '11 months'
        GROUP BY date_trunc('month', created_at)
        ORDER BY month DESC
      ) monthly_data
    )
  ) INTO result;

  RETURN result;
END;
$$;
`;

async function fixMrrCalculation() {
  console.log('🔧 Fixing MRR calculation in get_dashboard_stats function...\n');

  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: fixMrrCalculationSQL
    });

    if (error) {
      // Try direct approach if RPC doesn't work
      console.log('⚠️  RPC approach failed, trying direct SQL execution...\n');

      const { error: directError } = await supabase
        .from('_sql')
        .insert({ query: fixMrrCalculationSQL });

      if (directError) {
        throw directError;
      }
    }

    console.log('✅ Successfully updated get_dashboard_stats function!');
    console.log('\n📊 Updated MRR calculation:');
    console.log('   - Weekly plan: $10 → $43.30/month (10 * 4.33)');
    console.log('   - Monthly plan: $25/month');
    console.log('   - Annual plan: $250 → $20.83/month (250 / 12)');
    console.log('\n✨ MRR will now display correctly in the admin dashboard!');

  } catch (error) {
    console.error('❌ Error updating function:', error.message);
    console.log('\n📝 Manual fix required:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Copy the SQL from: supabase/migrations/20251106_fix_mrr_calculation.sql');
    console.log('3. Execute the SQL directly in the editor');
    process.exit(1);
  }
}

fixMrrCalculation();
