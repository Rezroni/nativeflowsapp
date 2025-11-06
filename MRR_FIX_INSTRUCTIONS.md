# MRR Calculation Fix Instructions

## Problem
The admin dashboard MRR (Monthly Recurring Revenue) display shows incorrect values because the `get_dashboard_stats()` function uses outdated pricing:
- Old: Monthly $29.99, Annual $299.99
- Current: Weekly $10, Monthly $25, Annual $250

## Solution
Update the `get_dashboard_stats()` SQL function with correct pricing calculations.

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

### Updated MRR Calculation
The function now correctly calculates Monthly Recurring Revenue:

| Plan Type | Price | MRR Conversion |
|-----------|-------|----------------|
| Weekly | $10 | $10 × 4.33 = **$43.30/month** |
| Monthly | $25 | **$25/month** |
| Annual | $250 | $250 ÷ 12 = **$20.83/month** |

### Updated Fields
- **totalRevenue**: Uses correct prices ($10, $25, $250)
- **mrr**: Converts all plans to monthly equivalents
- **monthlyRevenue**: Historical revenue with correct prices

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
- ✅ `supabase/migrations/20251106_fix_mrr_calculation.sql` - Migration file created
- ✅ `scripts/fix-mrr-calculation.js` - Helper script (optional)
- ✅ `MRR_FIX_INSTRUCTIONS.md` - This documentation

## Status
- [x] Migration file created
- [ ] SQL function updated in database (manual step required)
- [ ] MRR displaying correctly in admin dashboard

## Next Steps
1. Apply the fix using Option 1 or Option 2 above
2. Verify MRR shows correct values in admin dashboard
3. Mark this task as complete
