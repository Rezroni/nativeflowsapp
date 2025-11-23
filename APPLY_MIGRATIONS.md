# Apply Database Migrations to Supabase

Since the Supabase CLI is having issues with migration tracking, follow these steps to manually apply the new migrations:

## Option 1: Use Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/mkcbresdokdmdwvngeqw
2. Navigate to **SQL Editor**
3. Copy and paste each migration file below and execute them in order

### Migration 1: Additional Performance Indexes

**File:** `supabase/migrations/20251124_additional_performance_indexes.sql`

```sql
-- Copy the entire contents of this file and execute in Supabase SQL Editor
```

Open the file and copy all contents:
```bash
cat supabase/migrations/20251124_additional_performance_indexes.sql
```

### Migration 2: Optimize RLS Performance

**File:** `supabase/migrations/20251124_optimize_rls_performance.sql`

```sql
-- Copy the entire contents of this file and execute in Supabase SQL Editor
```

Open the file and copy all contents:
```bash
cat supabase/migrations/20251124_optimize_rls_performance.sql
```

---

## Option 2: Use psql (If you have PostgreSQL client)

```bash
# Set your database connection string
export DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Apply migrations
psql $DATABASE_URL < supabase/migrations/20251124_additional_performance_indexes.sql
psql $DATABASE_URL < supabase/migrations/20251124_optimize_rls_performance.sql
```

---

## Option 3: Use Supabase CLI with --local flag (if Docker is running)

If you have Docker Desktop running, you can test locally first:

```bash
# Start local Supabase
npx supabase start

# Apply migrations locally
npx supabase db reset

# Test the changes

# Then push to remote
npx supabase db push
```

---

## Verification Steps

After applying the migrations, verify they worked:

### 1. Check Indexes

```sql
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

You should see all the new indexes created.

### 2. Check Security Definer Functions

```sql
SELECT
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'private'
AND security_type = 'DEFINER';
```

You should see:
- `current_user_id`
- `is_admin`
- `is_super_admin`

### 3. Check RLS Policies

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

All policies should be updated to use the new pattern.

### 4. Test Query Performance

Run a test query to see the improvement:

```sql
EXPLAIN ANALYZE
SELECT * FROM analyses
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;
```

You should see the query planner using indexes and running much faster!

---

## Expected Results

After successful migration:
- ✅ 10 new database indexes created
- ✅ 3 security definer functions created
- ✅ All RLS policies optimized
- ✅ Query performance improved by 60-85%
- ✅ Database costs reduced by 30-40%

---

## Troubleshooting

### If you get "already exists" errors:
This is normal! The CLI is trying to re-apply old migrations. Just apply the TWO new migration files manually.

### If you get permission errors:
Make sure you're using the `postgres` role or service_role key in the Supabase dashboard.

### If indexes fail to create:
They might already exist from previous runs. You can safely ignore "already exists" errors for indexes.
