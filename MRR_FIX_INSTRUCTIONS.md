# Admin Dashboard Stats Fix Instructions

## Problem
The admin dashboard shows **ALL ZEROS** and incorrect data because:
1. The `get_dashboard_stats()` function has **missing fields** (analyses_today, new_users_this_week, trial_conversion_rate, etc.)
2. Uses **outdated pricing**: Old (Monthly $29.99, Annual $299.99) vs Current (Weekly $10, Monthly $25, Annual $250)
3. TypeScript mapping issues between snake_case SQL and camelCase frontend

## Solution
Comprehensive fix that:
1. Updates SQL function with ALL required fields
2. Fixes pricing calculations (Weekly $10, Monthly $25, Annual $250)
3. Corrects TypeScript property mapping

## How to Apply Fix

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/mkcbresdokdmdwvngeqw
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire SQL from `supabase/migrations/20251106_fix_mrr_calculation.sql`
5. Paste it into the SQL Editor
6. Click **Run** button
7. Verify you see "Success. No rows returned"

### Option 2: Supabase CLI
```bash
# If migration system is working
npx supabase db push

# If you get migration history errors, manually execute:
psql "postgresql://postgres:[YOUR-PASSWORD]@db.mkcbresdokdmdwvngeqw.supabase.co:5432/postgres" -f supabase/migrations/20251106_fix_mrr_calculation.sql
```

## What the Fix Does

### All Dashboard Fields Now Included
The updated SQL function returns ALL required fields:
- `total_users` - Total registered users
- `active_subscriptions` - Count of active paying subscriptions
- `total_analyses` - Total chart analyses performed
- `analyses_today` - Analyses performed today
- `new_users_this_week` - New users in last 7 days
- `new_users_this_month` - New users in last 30 days
- `revenue_this_month` - Revenue from subscriptions started this month
- `mrr` - Monthly Recurring Revenue (normalized to monthly)
- `trial_conversion_rate` - % of trials that converted to paid (last 90 days)

### Updated MRR Calculation
The function now correctly calculates Monthly Recurring Revenue:

| Plan Type | Price | MRR Conversion |
|-----------|-------|----------------|
| Weekly | $10 | $10 × 4.33 = **$43.30/month** |
| Monthly | $25 | **$25/month** |
| Annual | $250 | $250 ÷ 12 = **$20.83/month** |

### Revenue Calculation
All revenue fields now use correct current prices ($10, $25, $250) instead of old prices ($29.99, $299.99)

## Verification

After applying the fix:

1. Go to Admin Dashboard: `/admin`
2. Check the MRR value in the stats cards
3. It should now correctly sum:
   - Active weekly subscriptions × $43.30
   - Active monthly subscriptions × $25
   - Active annual subscriptions × $20.83

## Example
If you have:
- 2 active weekly subscriptions
- 3 active monthly subscriptions
- 1 active annual subscription

**MRR = (2 × $43.30) + (3 × $25) + (1 × $20.83) = $86.60 + $75 + $20.83 = $182.43**

## Files Changed
- ✅ `supabase/migrations/20251106_fix_mrr_calculation.sql` - Updated SQL migration with all fields
- ✅ `app/admin/page.tsx` - Fixed TypeScript property mapping
- ✅ `scripts/fix-mrr-calculation.js` - Helper script (optional)
- ✅ `MRR_FIX_INSTRUCTIONS.md` - This documentation

## Changes Made

### Frontend (app/admin/page.tsx)
```typescript
// Before: Incorrect property access
const dashboardStats = stats || { total_users: 0, ... }
value={dashboardStats.total_users.toLocaleString()}

// After: Correct JSONB property mapping
const dashboardStats = stats ? {
  totalUsers: Number(stats.total_users || 0),
  activeSubscriptions: Number(stats.active_subscriptions || 0),
  ...
}
value={dashboardStats.totalUsers.toLocaleString()}
```

### Backend (SQL Function)
- Added all 9 required fields
- Updated pricing from ($29.99/$299.99) to ($10/$25/$250)
- Fixed MRR calculation to normalize all plans to monthly rate

## Status
- [x] Migration file created and updated
- [x] Frontend TypeScript mapping fixed
- [ ] SQL function updated in database (**MANUAL STEP REQUIRED**)
- [ ] Dashboard displaying correct data

## Next Steps
1. Apply the fix using Option 1 or Option 2 above
2. Verify MRR shows correct values in admin dashboard
3. Mark this task as complete
