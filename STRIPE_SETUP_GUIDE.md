# Complete Stripe Integration Setup Guide

This guide will walk you through **every step** needed to integrate Stripe with your Nativeflows app, including creating products, setting up webhooks, and testing payments.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Access Stripe Dashboard](#step-1-access-stripe-dashboard)
3. [Step 2: Create Subscription Products](#step-2-create-subscription-products)
4. [Step 3: Get Your API Keys](#step-3-get-your-api-keys)
5. [Step 4: Set Up Webhook](#step-4-set-up-webhook)
6. [Step 5: Update Environment Variables](#step-5-update-environment-variables)
7. [Step 6: Apply Database Migration](#step-6-apply-database-migration)
8. [Step 7: Test the Integration](#step-7-test-the-integration)
9. [Step 8: Go Live](#step-8-go-live)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- ✅ Stripe account (already have with the keys you provided)
- ✅ Access to your production server/deployment
- ✅ Access to Supabase database
- ✅ Code changes already implemented

---

## Step 1: Access Stripe Dashboard

### 1.1 Login to Stripe

1. Go to: **https://dashboard.stripe.com/**
2. Sign in with your Stripe account credentials
3. You'll see the Stripe Dashboard home page

### 1.2 Switch to Test Mode (for initial setup)

1. Look at the top-left corner of the dashboard
2. You'll see a toggle that says **"Test mode"** or **"Live mode"**
3. Make sure it's in **Test mode** (the toggle should be ON/enabled)
4. The toggle will be **orange/amber** when in test mode

> **Important:** We'll set everything up in test mode first, then repeat for live mode later.

---

## Step 2: Create Subscription Products

You need to create **3 products** (Weekly, Monthly, Annual) with recurring billing.

### 2.1 Navigate to Products

1. In the left sidebar, click on **"Products"**
2. You'll see the Products Catalog page
3. Click the **"+ Add product"** button (top-right corner)

---

### 2.2 Create Weekly Plan ($10/week)

#### Product Details:

1. **Name:** `Nativeflows Weekly`
2. **Description:** `Weekly subscription for unlimited AI chart analysis`
3. Click **"Add pricing"** or scroll down to the pricing section

#### Pricing Details:

1. **Pricing model:** Select **"Standard pricing"**
2. **Price:** Enter `10`
3. **Billing period:** Select **"Weekly"** from the dropdown
   - If you don't see "Weekly", select **"Custom"** and then:
     - Interval: `1`
     - Period: `week`
4. **Currency:** Select **"USD"**
5. **Payment type:** Select **"Recurring"**

#### Additional Options:

1. **Trial period:** Leave blank (optional: you can set 7 days if you want)
2. Scroll down and click **"Save product"**

#### Copy the Price ID:

1. After saving, you'll be redirected to the product page
2. Under **"Pricing"**, you'll see your price listed
3. Click on the price to expand it
4. You'll see **"Price ID"** - it looks like: `price_1AbCdEfGhIjKlMnO`
5. Click the **copy icon** next to it or select and copy it
6. **Save this ID** - you'll need it later: `STRIPE_WEEKLY_PRICE_ID`

---

### 2.3 Create Monthly Plan ($25/month)

Repeat the same process:

1. Click **"+ Add product"** again
2. **Name:** `Nativeflows Monthly`
3. **Description:** `Monthly subscription for unlimited AI chart analysis - Most Popular!`
4. **Price:** `25`
5. **Billing period:** `Monthly` (or Custom: 1 month)
6. **Currency:** `USD`
7. **Payment type:** `Recurring`
8. Click **"Save product"**
9. **Copy the Price ID** and save it as: `STRIPE_MONTHLY_PRICE_ID`

---

### 2.4 Create Annual Plan ($250/year)

Repeat one more time:

1. Click **"+ Add product"** again
2. **Name:** `Nativeflows Annual`
3. **Description:** `Annual subscription - Best value for serious traders`
4. **Price:** `250`
5. **Billing period:** `Yearly` (or Custom: 1 year)
6. **Currency:** `USD`
7. **Payment type:** `Recurring`
8. Click **"Save product"**
9. **Copy the Price ID** and save it as: `STRIPE_ANNUAL_PRICE_ID`

---

### 2.5 Verify Your Products

1. Go back to **Products** in the sidebar
2. You should now see **3 products** listed:
   - Nativeflows Weekly - $10/week
   - Nativeflows Monthly - $25/month
   - Nativeflows Annual - $250/year

**✅ Products created!** You should now have 3 Price IDs saved.

---

## Step 3: Get Your API Keys

### 3.1 Navigate to API Keys

1. In the left sidebar, click on **"Developers"**
2. Click on **"API keys"** in the submenu
3. You'll see the API keys page

### 3.2 Test Mode Keys

Since you're in **Test mode**, you'll see:

1. **Publishable key** (starts with `pk_test_`)
2. **Secret key** (starts with `sk_test_`)

#### Copy Test Keys:

1. Click **"Reveal test key"** under the Secret key
2. Copy both keys and save them:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
   - `STRIPE_SECRET_KEY` = `sk_test_...`

### 3.3 Live Mode Keys (You Already Have These)

You already provided your live keys:
- Public: `pk_live_51HyGshB1oDFFmZrIu2qTvBwNDJypuWui0lkg3rNDFlasUVcC0a5OEv3C8AegtvmaamWMpZgwYfDQY4B06JKlmw9Y00LQdrR2xN`
- Secret: `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`

**✅ API Keys obtained!**

---

## Step 4: Set Up Webhook

Webhooks allow Stripe to notify your app when events happen (payment succeeded, subscription canceled, etc.).

### 4.1 Navigate to Webhooks

1. Still in **"Developers"** section (left sidebar)
2. Click on **"Webhooks"**
3. You'll see the Webhooks page

### 4.2 Add Endpoint

1. Click **"+ Add endpoint"** button (top-right)
2. You'll see the "Add endpoint" form

### 4.3 Configure Endpoint

#### Endpoint URL:

**For Testing (localhost):**
```
Use Stripe CLI (see section 7.2)
```

**For Production:**
```
https://your-domain.com/api/stripe/webhook
```

Replace `your-domain.com` with your actual domain (e.g., `nativeflows.ai`)

**Example:**
```
https://nativeflows.ai/api/stripe/webhook
```

#### Description (optional):
```
Nativeflows subscription webhooks
```

#### Events to Listen To:

1. Click **"Select events"** button
2. You'll see a list of all possible events
3. Search or scroll to find and check these **4 events**:

   **Required Events:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_failed`

4. Alternatively, you can select **"Select all customer events"** and **"Select all checkout events"** to receive all related events

#### API Version:
- Leave as default (latest version)

### 4.4 Save Endpoint

1. Scroll down and click **"Add endpoint"**
2. You'll be redirected to the endpoint details page

### 4.5 Get Webhook Signing Secret

This is **critical** for security - it verifies that webhooks actually come from Stripe.

1. On the endpoint details page, look for **"Signing secret"**
2. Click **"Reveal"** or the eye icon
3. You'll see a secret that starts with `whsec_`
4. Click **"Copy"** or select and copy it
5. **Save this** as: `STRIPE_WEBHOOK_SECRET`

**Example:** `whsec_abc123xyz789...`

**✅ Webhook configured!**

---

## Step 5: Update Environment Variables

### 5.1 Open Your .env.local File

Navigate to your project root and open `.env.local`

### 5.2 Add/Update Stripe Variables

Replace the placeholder values with your actual values:

```env
# Stripe (Credit/Debit Card Payment Processor)

# Test Mode Keys (for development)
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_TEST_WEBHOOK_SECRET

# Live Mode Keys (for production)
# STRIPE_SECRET_KEY=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
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51HyGshB1oDFFmZrIu2qTvBwNDJypuWui0lkg3rNDFlasUVcC0a5OEv3C8AegtvmaamWMpZgwYfDQY4B06JKlmw9Y00LQdrR2xN

# Price IDs (create separate ones for test and live mode)
STRIPE_WEEKLY_PRICE_ID=price_YOUR_WEEKLY_PRICE_ID
STRIPE_MONTHLY_PRICE_ID=price_YOUR_MONTHLY_PRICE_ID
STRIPE_ANNUAL_PRICE_ID=price_YOUR_ANNUAL_PRICE_ID
```

### 5.3 For Production Deployment

When deploying to production (Vercel, etc.):

1. Go to your hosting platform's environment variables section
2. Add each variable with the **LIVE mode** values
3. Never commit `.env.local` to Git (it should be in `.gitignore`)

**✅ Environment variables configured!**

---

## Step 6: Apply Database Migration

The Stripe integration needs additional columns in your `subscriptions` table.

### 6.1 Using Supabase Dashboard (Easiest)

1. Go to: **https://supabase.com/dashboard**
2. Select your **Nativeflows** project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New query"**
5. Copy the entire contents of `supabase/migrations/20250206_stripe_integration.sql`
6. Paste into the SQL editor
7. Click **"Run"** (or press Ctrl/Cmd + Enter)
8. You should see: **"Success. No rows returned"**

### 6.2 Using Supabase CLI

If you have Supabase CLI installed:

```bash
npx supabase db push
```

When prompted, select **only** the `20250206_stripe_integration.sql` migration.

### 6.3 Verify Migration

1. In Supabase Dashboard, go to **"Table Editor"**
2. Click on **"subscriptions"** table
3. You should see new columns:
   - `payment_provider`
   - `stripe_customer_id`
   - `stripe_subscription_id`
   - `stripe_session_id`

**✅ Database migration applied!**

---

## Step 7: Test the Integration

### 7.1 Start Your Development Server

```bash
npm run dev
```

Server should start at `http://localhost:3005`

### 7.2 Set Up Stripe CLI for Local Testing (Optional but Recommended)

To test webhooks locally:

#### Install Stripe CLI:

**Windows:**
```bash
# Using Scoop
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
# Download from https://github.com/stripe/stripe-cli/releases/latest
```

#### Login to Stripe:

```bash
stripe login
```

This will open a browser - authorize the CLI.

#### Forward Webhooks to Local Server:

```bash
stripe listen --forward-to localhost:3005/api/stripe/webhook
```

This will output a webhook signing secret like:
```
> Ready! Your webhook signing secret is whsec_abc123...
```

**Copy this secret** and temporarily use it as `STRIPE_WEBHOOK_SECRET` in your `.env.local`

### 7.3 Test Payment Flow

1. Go to `http://localhost:3005/pricing`
2. You should see:
   - Payment method selector (Crypto vs Card)
   - Pricing plans (Weekly, Monthly, Annual)
3. Select **"Credit/Debit Card"**
4. Click **"Choose Plan"** on any plan
5. You should be redirected to **Stripe Checkout**

### 7.4 Use Test Card

Stripe provides test card numbers:

**Successful Payment:**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

**Declined Payment:**
```
Card Number: 4000 0000 0000 0002
```

**Requires 3D Secure:**
```
Card Number: 4000 0027 6000 3184
```

### 7.5 Complete Test Checkout

1. Enter test card details
2. Click **"Subscribe"**
3. You should be redirected back to your success page
4. Check your terminal/console for webhook events

### 7.6 Verify in Stripe Dashboard

1. Go to **"Payments"** in Stripe Dashboard
2. You should see your test payment
3. Go to **"Customers"**
4. You should see a new customer created
5. Go to **"Subscriptions"**
6. You should see an active subscription

### 7.7 Verify in Your Database

1. In Supabase, go to **"Table Editor"** → **"subscriptions"**
2. You should see a new row with:
   - `payment_provider` = `stripe`
   - `status` = `active`
   - `stripe_subscription_id` = `sub_...`
   - `stripe_customer_id` = `cus_...`

**✅ Test successful!**

---

## Step 8: Go Live

Once testing is complete, switch to production:

### 8.1 Switch Stripe to Live Mode

1. In Stripe Dashboard, toggle from **Test mode** to **Live mode** (top-left)
2. The toggle will turn **blue** when in live mode

### 8.2 Create Live Products

**Important:** You need to create products again in live mode.

Repeat **Step 2** (Create Subscription Products) while in **Live mode**:
- Create Weekly plan ($10)
- Create Monthly plan ($25)
- Create Annual plan ($250)
- Copy the **live Price IDs**

### 8.3 Create Live Webhook

Repeat **Step 4** (Set Up Webhook) while in **Live mode**:
- Add endpoint with your production URL
- Select the same 4 events
- Copy the **live webhook signing secret**

### 8.4 Update Production Environment Variables

In your hosting platform (Vercel, Netlify, etc.):

```env
# Live Mode
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51HyGshB1oDFFmZrIu2qTvBwNDJypuWui0lkg3rNDFlasUVcC0a5OEv3C8AegtvmaamWMpZgwYfDQY4B06JKlmw9Y00LQdrR2xN
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET

# Live Price IDs
STRIPE_WEEKLY_PRICE_ID=price_YOUR_LIVE_WEEKLY_ID
STRIPE_MONTHLY_PRICE_ID=price_YOUR_LIVE_MONTHLY_ID
STRIPE_ANNUAL_PRICE_ID=price_YOUR_LIVE_ANNUAL_ID
```

### 8.5 Deploy to Production

```bash
# Build your app
npm run build

# Deploy to your hosting platform
git add .
git commit -m "Add Stripe integration"
git push
```

### 8.6 Test Live Payment

**⚠️ Important:** Test with a **REAL card** first (you can refund it later)

1. Go to your production site
2. Complete the checkout flow
3. Verify webhook delivery in Stripe Dashboard → Developers → Webhooks
4. Check your database for the subscription record

### 8.7 Refund Test Payment (if needed)

1. Go to Stripe Dashboard → Payments
2. Click on the test payment
3. Click **"Refund payment"**
4. Enter full amount
5. Click **"Refund"**

**✅ Live mode activated!**

---

## Troubleshooting

### Issue: Webhook Not Receiving Events

**Solution:**

1. Check webhook URL is correct and accessible
2. Verify webhook secret matches
3. Check webhook event selection includes required events
4. Look at Stripe Dashboard → Developers → Webhooks → Endpoint details → **"Attempted events"**
5. Click on failed attempts to see error messages

### Issue: "No such price: price_xxx"

**Solution:**

1. Verify you're using the correct price ID
2. Ensure you're using **live** price IDs in production and **test** price IDs in development
3. Check that the price IDs are set in environment variables

### Issue: Checkout Session Not Creating

**Solution:**

1. Check browser console for errors
2. Verify API keys are correct
3. Check server logs for error messages
4. Ensure user is authenticated

### Issue: Database Not Updating

**Solution:**

1. Verify webhook secret is correct
2. Check that migration was applied successfully
3. Look at webhook event logs in Stripe
4. Check server logs for errors during webhook processing

### Issue: User Not Redirected After Payment

**Solution:**

1. Verify success URL is correct in checkout session creation
2. Check that session ID is being passed correctly
3. Look for JavaScript errors in browser console

---

## Quick Reference

### Stripe Dashboard URLs

- **Main Dashboard:** https://dashboard.stripe.com/
- **Products:** https://dashboard.stripe.com/products
- **API Keys:** https://dashboard.stripe.com/apikeys
- **Webhooks:** https://dashboard.stripe.com/webhooks
- **Payments:** https://dashboard.stripe.com/payments
- **Customers:** https://dashboard.stripe.com/customers
- **Subscriptions:** https://dashboard.stripe.com/subscriptions
- **Logs:** https://dashboard.stripe.com/logs

### Test Card Numbers

| Purpose | Card Number | Details |
|---------|-------------|---------|
| Success | 4242 4242 4242 4242 | Always succeeds |
| Declined | 4000 0000 0000 0002 | Always declined |
| 3D Secure | 4000 0027 6000 3184 | Requires authentication |
| Insufficient Funds | 4000 0000 0000 9995 | Declined - insufficient funds |

**For all test cards:**
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

### Webhook Events

Your app listens to these 4 events:

1. `checkout.session.completed` - Payment successful, activate subscription
2. `customer.subscription.updated` - Subscription changed (renewed, upgraded, etc.)
3. `customer.subscription.deleted` - Subscription canceled
4. `invoice.payment_failed` - Payment failed, mark as past_due

---

## Support Resources

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe API Reference:** https://stripe.com/docs/api
- **Stripe Testing Guide:** https://stripe.com/docs/testing
- **Stripe Webhooks:** https://stripe.com/docs/webhooks
- **Stripe Support:** https://support.stripe.com/

---

## Checklist

Use this checklist to track your progress:

### Setup Phase
- [ ] Login to Stripe Dashboard
- [ ] Switch to Test mode
- [ ] Create Weekly product ($10/week)
- [ ] Create Monthly product ($25/month)
- [ ] Create Annual product ($250/year)
- [ ] Copy all 3 Price IDs
- [ ] Get test API keys (publishable & secret)
- [ ] Create webhook endpoint
- [ ] Configure webhook events (4 events)
- [ ] Copy webhook signing secret
- [ ] Update .env.local with test keys
- [ ] Update .env.local with price IDs
- [ ] Apply database migration

### Testing Phase
- [ ] Start dev server
- [ ] Test crypto payment (existing)
- [ ] Test card payment (new Stripe)
- [ ] Complete test checkout
- [ ] Verify payment in Stripe Dashboard
- [ ] Verify subscription in database
- [ ] Test webhook delivery
- [ ] Test subscription cancellation

### Production Phase
- [ ] Switch to Live mode in Stripe
- [ ] Create live products (3 plans)
- [ ] Copy live Price IDs
- [ ] Create live webhook
- [ ] Copy live webhook secret
- [ ] Update production environment variables
- [ ] Deploy to production
- [ ] Test live payment
- [ ] Monitor webhook delivery
- [ ] Refund test payment (if needed)

**✅ All Done!** Your Stripe integration is complete.

---

**Last Updated:** February 6, 2025
**Status:** Ready for Implementation
