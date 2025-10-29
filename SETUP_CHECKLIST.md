# 🚀 Complete Setup Checklist

Follow these steps in order to get ChartIQ AI fully working:

## ✅ Step 1: Supabase Setup (5 minutes)

### 1.1 Create Project
- [ ] Go to https://supabase.com/dashboard
- [ ] Click "New Project"
- [ ] Name it (e.g., "chartiq-ai")
- [ ] Set a strong database password
- [ ] Choose a region close to you
- [ ] Wait for project to initialize (~2 minutes)

### 1.2 Run Database Migrations
- [ ] Go to **SQL Editor** in Supabase Dashboard
- [ ] Click "New Query"
- [ ] Copy content from `supabase/migrations/001_initial_schema.sql`
- [ ] Paste and click **"Run"**
- [ ] Should see: "Success. No rows returned"

### 1.3 Fix Database Columns
- [ ] Still in SQL Editor, click "New Query"
- [ ] Copy content from `supabase/migrations/003_fix_analyses_columns.sql`
- [ ] Paste and click **"Run"**
- [ ] Verify columns renamed successfully

### 1.4 Create Storage Bucket
- [ ] Go to **Storage** in Supabase Dashboard
- [ ] Click **"Create a new bucket"**
- [ ] Name: `chart-images`
- [ ] Check ✅ **"Public bucket"**
- [ ] Click **"Create bucket"**
- [ ] Run storage policies from `002_storage_bucket.sql` (optional but recommended)

### 1.5 Get API Keys
- [ ] Go to **Settings** → **API** in Supabase
- [ ] Copy **Project URL**
- [ ] Copy **anon public** key
- [ ] Copy **service_role** key (for webhooks)

## ✅ Step 2: Environment Variables (2 minutes)

Edit `.env.local` and add:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# Claude AI (Required)
ANTHROPIC_API_KEY=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

# OpenAI (Optional - Fallback)
OPENAI_API_KEY=sk-proj-YOUR_KEY
# OPENAI_ORGANIZATION=org-YOUR_ORG # Only if needed

# Stripe (Optional - For payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...

# App Config
NEXT_PUBLIC_SITE_URL=http://localhost:3005
```

**Checklist**:
- [ ] Supabase URL added
- [ ] Supabase anon key added
- [ ] Supabase service role key added
- [ ] Claude API key added
- [ ] File saved

## ✅ Step 3: Install Dependencies (1 minute)

```bash
cd chartiq-web
npm install
```

**Checklist**:
- [ ] All packages installed without errors
- [ ] Check for `@anthropic-ai/sdk` in package.json

## ✅ Step 4: Start Development Server (30 seconds)

```bash
npm run dev
```

**Checklist**:
- [ ] Server starts on http://localhost:3005
- [ ] No errors in console
- [ ] Can access homepage

## ✅ Step 5: Test Core Features (10 minutes)

### 5.1 Authentication
- [ ] Go to http://localhost:3005
- [ ] Click "Sign Up"
- [ ] Create an account with email/password
- [ ] Verify you're redirected to dashboard
- [ ] Log out and log back in

### 5.2 Chart Analysis
- [ ] Go to /analyze
- [ ] Upload a trading chart (or use URL)
- [ ] Add optional context
- [ ] Click "Analyze with AI"
- [ ] Wait 10-30 seconds
- [ ] Should see complete analysis results

**Console should show**:
```
Using Claude AI for analysis...
Analysis complete!
```

### 5.3 Verify Storage
- [ ] After successful analysis
- [ ] Go to Supabase Dashboard → Storage → chart-images
- [ ] Should see uploaded image in your user folder

### 5.4 Check History
- [ ] Go to /history
- [ ] Should see your analysis listed
- [ ] Click "View Details"
- [ ] Should show full analysis

### 5.5 Dashboard
- [ ] Go to /dashboard
- [ ] Should show usage stats (1 analysis used)
- [ ] Should show recent analysis

## ✅ Step 6: Stripe Setup (Optional - 15 minutes)

Only needed if you want to enable subscriptions:

### 6.1 Create Stripe Account
- [ ] Go to https://stripe.com
- [ ] Sign up for account
- [ ] Switch to "Test Mode"

### 6.2 Create Products
- [ ] Go to Products → Add Product
- [ ] Create "Pro Monthly" - $29/month recurring
- [ ] Copy Price ID → Add to .env.local as `STRIPE_PRO_MONTHLY_PRICE_ID`
- [ ] Create "Pro Annual" - $290/year recurring
- [ ] Copy Price ID → Add to .env.local as `STRIPE_PRO_ANNUAL_PRICE_ID`

### 6.3 Get API Keys
- [ ] Go to Developers → API Keys
- [ ] Copy "Publishable key" → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Copy "Secret key" → `STRIPE_SECRET_KEY`

### 6.4 Setup Webhook
- [ ] Go to Developers → Webhooks
- [ ] Add endpoint: `http://localhost:3005/api/webhooks/stripe` (for local testing)
- [ ] Select events:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`
- [ ] Copy "Signing secret" → `STRIPE_WEBHOOK_SECRET`

### 6.5 Test Checkout
- [ ] Restart dev server
- [ ] Go to /pricing
- [ ] Click "Upgrade to Pro"
- [ ] Should redirect to Stripe Checkout
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Any future date and any CVC
- [ ] Complete payment
- [ ] Should redirect to success page

## 🎯 Success Checklist

After completing all steps, verify:

- ✅ Can sign up and log in
- ✅ Can upload and analyze charts
- ✅ Images are stored in Supabase
- ✅ Analyses are saved to database
- ✅ Can view analysis history
- ✅ Dashboard shows correct stats
- ✅ (Optional) Can upgrade subscription

## 📊 Current Status

Based on your setup:

- ✅ **Supabase**: Configured
- ✅ **Claude AI**: API key provided
- ✅ **Storage Bucket**: Need to create
- ⚠️ **Database Columns**: Need to run migration 003
- ❌ **Stripe**: Not yet configured
- ❌ **OpenAI**: Not configured (optional)

## 🔧 Troubleshooting

### "Bucket not found"
→ Go to Supabase Storage → Create `chart-images` bucket (public)

### "Could not find 'analysis_data' column"
→ Run migration `003_fix_analyses_columns.sql` in Supabase SQL Editor

### "No AI provider available"
→ Add `ANTHROPIC_API_KEY` to `.env.local` and restart server

### "Failed to upload file"
→ Check Supabase credentials and storage bucket exists

### "Unauthorized" on analysis
→ Make sure you're logged in

## 📚 Additional Resources

- [AI_SETUP.md](./AI_SETUP.md) - Detailed AI provider configuration
- [STORAGE_SETUP.md](./STORAGE_SETUP.md) - Storage bucket setup
- [DATABASE_FIX.md](./DATABASE_FIX.md) - Fix database column issues
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Full project status

## 🎉 Next Steps

After basic setup is working:

1. Configure Stripe for subscriptions
2. Set up OpenAI as backup (optional)
3. Deploy to Vercel (Phase 5)
4. Configure production environment
5. Set up monitoring and analytics

---

**Need Help?** Check the console logs (browser + server) for detailed error messages!
