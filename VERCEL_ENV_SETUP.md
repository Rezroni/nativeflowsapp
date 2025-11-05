# Vercel Environment Variables Setup

**Quick Guide:** How to add environment variables to Vercel to fix the deployment error.

---

## The Error You're Seeing

```
Error: STRIPE_SECRET_KEY is not set in environment variables
```

This happens because Vercel doesn't have access to your local `.env.local` file. You need to add the environment variables directly in Vercel's dashboard.

---

## Step-by-Step: Add Environment Variables to Vercel

### 1. Go to Your Vercel Project Dashboard

1. Open https://vercel.com/dashboard
2. Click on your **nativeflowsapp** project
3. Click on **Settings** (top navigation)
4. Click on **Environment Variables** (left sidebar)

### 2. Add Each Environment Variable

For each variable below, click **Add** and fill in:

#### Required Variables (Already Working):

These are already set, but verify they exist:

```
NEXT_PUBLIC_SUPABASE_URL=https://mkcbresdokdmdwvngeqw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-1nzkTZEY5jPHyXt6pAXJHfisYNDwgrW9...
ANTHROPIC_API_KEY=sk-ant-api03-jLtrKplDAF4piwGITQCZWgXIEbh3d6Kp...
OPENROUTER_API_KEY=sk-or-v1-d976ec1249eb3de6695c1895fa591c81...
NOWPAYMENTS_API_KEY=CHE07VR-7QWMSSV-KPBJVS0-TXCK63A
NOWPAYMENTS_IPN_SECRET=GBU0zyS18Nj4uu6dJc9xF7O16l5uqJU2
NEXT_PUBLIC_APP_URL=https://nativeflows.ai
NEXT_PUBLIC_API_URL=https://nativeflows.ai/api
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BGlyHUzMEEdpWo5Z3l_6ahyIIx8PNIYbs...
VAPID_PRIVATE_KEY=WMEenbBH-p_uS9QwSRGEyEmlNO44nplXyZA...
VAPID_SUBJECT=mailto:mokhamedrezk@gmail.com
```

#### NEW Variables to Add (Stripe):

**Option 1: Use Test Mode (Recommended First)**

Add these to test Stripe integration before going live:

```
Key: STRIPE_SECRET_KEY
Value: sk_test_YOUR_TEST_SECRET_KEY
Environments: ✓ Production ✓ Preview ✓ Development

Key: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_YOUR_TEST_PUBLISHABLE_KEY
Environments: ✓ Production ✓ Preview ✓ Development

Key: STRIPE_WEBHOOK_SECRET
Value: whsec_YOUR_TEST_WEBHOOK_SECRET
Environments: ✓ Production ✓ Preview ✓ Development

Key: STRIPE_WEEKLY_PRICE_ID
Value: price_YOUR_WEEKLY_PRICE_ID
Environments: ✓ Production ✓ Preview ✓ Development

Key: STRIPE_MONTHLY_PRICE_ID
Value: price_YOUR_MONTHLY_PRICE_ID
Environments: ✓ Production ✓ Preview ✓ Development

Key: STRIPE_ANNUAL_PRICE_ID
Value: price_YOUR_ANNUAL_PRICE_ID
Environments: ✓ Production ✓ Preview ✓ Development
```

**Option 2: Use Live Mode (After Testing)**

```
Key: STRIPE_SECRET_KEY
Value: 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
Environments: ✓ Production

Key: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_live_51HyGshB1oDFFmZrIu2qTvBwNDJypuWui0lkg3rNDFlasUVcC0a5OEv3C8AegtvmaamWMpZgwYfDQY4B06JKlmw9Y00LQdrR2xN
Environments: ✓ Production

Key: STRIPE_WEBHOOK_SECRET
Value: whsec_YOUR_LIVE_WEBHOOK_SECRET
Environments: ✓ Production

Key: STRIPE_WEEKLY_PRICE_ID
Value: price_YOUR_LIVE_WEEKLY_ID
Environments: ✓ Production

Key: STRIPE_MONTHLY_PRICE_ID
Value: price_YOUR_LIVE_MONTHLY_ID
Environments: ✓ Production

Key: STRIPE_ANNUAL_PRICE_ID
Value: price_YOUR_LIVE_ANNUAL_ID
Environments: ✓ Production
```

---

## Quick Start: Minimum Required for Build to Pass

**To make the build pass immediately**, add these placeholder values:

```
STRIPE_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
STRIPE_WEEKLY_PRICE_ID=price_placeholder
STRIPE_MONTHLY_PRICE_ID=price_placeholder
STRIPE_ANNUAL_PRICE_ID=price_placeholder
```

Then replace with real values when you complete Stripe setup.

---

## How to Add a Variable in Vercel

1. Click **Add New** button
2. Fill in the form:
   - **Key:** Variable name (e.g., `STRIPE_SECRET_KEY`)
   - **Value:** The actual value
   - **Environments:** Select which environments need this:
     - ✓ **Production** - Your live site
     - ✓ **Preview** - PR preview deployments
     - ✓ **Development** - Local development (optional)
3. Click **Save**
4. Repeat for each variable

---

## After Adding Variables

### Trigger a Redeploy

1. Go to **Deployments** tab
2. Find the latest failed deployment
3. Click the **•••** menu
4. Click **Redeploy**
5. Confirm redeploy

**OR**

1. Push a new commit to trigger automatic deployment:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

---

## Screenshot Guide

### Where to Find Settings:
```
vercel.com/dashboard
  └── Your Project (nativeflowsapp)
      └── Settings (top nav)
          └── Environment Variables (left sidebar)
              └── Add New button
```

### The Form Looks Like:
```
┌─────────────────────────────────────┐
│ Add Environment Variable            │
├─────────────────────────────────────┤
│ Key:   [STRIPE_SECRET_KEY        ]  │
│ Value: [sk_live_51HyGsh...       ]  │
│                                     │
│ Environments:                       │
│ ☑ Production                        │
│ ☑ Preview                           │
│ ☐ Development                       │
│                                     │
│        [Cancel]  [Save]             │
└─────────────────────────────────────┘
```

---

## Verify Variables Are Set

After adding:

1. Go to **Settings** → **Environment Variables**
2. You should see all your variables listed
3. Click on any variable to view/edit
4. Values are hidden by default (•••••) for security

---

## Common Issues

### Issue: "Still Getting the Same Error"

**Solution:**
- Make sure you clicked **Save** after adding each variable
- Wait 1-2 minutes for Vercel to update
- Trigger a new deployment (don't reuse the old one)

### Issue: "Can't Find Environment Variables Section"

**Solution:**
- Make sure you're in the correct project
- Check you have admin/owner access to the project
- Try Settings → Environment Variables in left menu

### Issue: "Build Still Fails After Adding"

**Solution:**
- Check for typos in variable names (case-sensitive!)
- Verify you selected the correct environment (Production)
- Check the build logs for which variable is missing

---

## Test Your Stripe Setup

After deployment succeeds:

1. Go to your deployed site
2. Navigate to `/pricing`
3. Try to select "Credit/Debit Card" payment method
4. If it works, Stripe is configured!
5. If not, check browser console for errors

---

## Next Steps

1. ✅ Add environment variables to Vercel
2. ✅ Trigger redeploy
3. ✅ Verify build succeeds
4. 📋 Complete Stripe product setup (see [STRIPE_SETUP_GUIDE.md](STRIPE_SETUP_GUIDE.md))
5. 📋 Test payment flow
6. 📋 Replace test keys with live keys

---

**Quick Link:** https://vercel.com/dashboard/your-project/settings/environment-variables

---

**Last Updated:** February 6, 2025
