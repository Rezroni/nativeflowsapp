# Stripe Payment Setup Guide

## Current Issue
The "Failed to create checkout session" error occurs because Stripe Price IDs are not configured in the production environment.

## Required Environment Variables

Add these to your production environment (Vercel/hosting platform):

```bash
# Stripe API Keys (already configured)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (MISSING - need to be added)
STRIPE_WEEKLY_PRICE_ID=price_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_ANNUAL_PRICE_ID=price_...
```

## Steps to Configure Stripe Prices

### 1. Create Products in Stripe Dashboard

Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)

Create 3 products:

#### Weekly Plan
- **Name**: Weekly Plan
- **Description**: Perfect for short-term needs
- **Pricing**: $10 USD per week (recurring)
- **Billing period**: Weekly
- Copy the **Price ID** (starts with `price_`)

#### Monthly Plan
- **Name**: Monthly Plan
- **Description**: Best value for active traders
- **Pricing**: $25 USD per month (recurring)
- **Billing period**: Monthly
- Copy the **Price ID** (starts with `price_`)

#### Annual Plan
- **Name**: Annual Plan
- **Description**: Maximum savings for professionals
- **Pricing**: $250 USD per year (recurring)
- **Billing period**: Yearly
- Copy the **Price ID** (starts with `price_`)

### 2. Add Price IDs to Environment Variables

#### For Vercel Production:
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the following:
   - `STRIPE_WEEKLY_PRICE_ID` = `price_xxxxxxxxxxxxx`
   - `STRIPE_MONTHLY_PRICE_ID` = `price_xxxxxxxxxxxxx`
   - `STRIPE_ANNUAL_PRICE_ID` = `price_xxxxxxxxxxxxx`
4. Redeploy your application

#### For Local Development (.env.local):
```bash
STRIPE_WEEKLY_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_ANNUAL_PRICE_ID=price_xxxxxxxxxxxxx
```

### 3. Configure Webhook (if not already done)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it as `STRIPE_WEBHOOK_SECRET` environment variable

## Testing

After configuration:

1. **Test Mode**: Use test price IDs (start with `price_test_`) for development
2. **Live Mode**: Use live price IDs (start with `price_`) for production

## Verification

To verify the setup:

1. Visit `/pricing` page
2. Select "Credit/Debit Card" payment method
3. Click "Get Monthly Plan" (or any plan)
4. You should be redirected to Stripe Checkout (not see an error)

## Current Payment Flow

### Card Payments (Stripe)
1. User selects "Credit/Debit Card" on pricing page
2. Clicks a plan button
3. Frontend calls `/api/stripe/checkout`
4. Backend creates Stripe Checkout Session
5. User redirected to Stripe Checkout page
6. After payment, redirected to `/checkout/success`

### Crypto Payments (NOWPayments)
1. User selects "Cryptocurrency" on pricing page
2. Selects crypto (BTC, ETH, USDT TRC20, USDT BSC)
3. Clicks a plan button
4. Frontend calls `/api/payment/create`
5. Backend creates NOWPayments invoice
6. User redirected to `/checkout/payment` with payment details

## Support

If you encounter issues:
- Check Vercel logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure Stripe is in Live mode for production
- Contact Stripe support if price creation fails
