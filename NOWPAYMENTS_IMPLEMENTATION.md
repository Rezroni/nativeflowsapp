# NOWPayments Implementation Guide

## Overview

Successfully migrated from Stripe to NOWPayments cryptocurrency payment processor. The application now accepts Bitcoin, Ethereum, Tether, Litecoin, and 150+ other cryptocurrencies.

## Changes Made

### 1. Pricing Structure Updated

**Old Plan (Stripe):**
- Free Trial: 7 days, 10 analyses
- Pro Monthly: $29/month, 100 analyses
- Pro Annual: $290/year, 100 analyses
- Enterprise: $999/month, unlimited

**New Plan (NOWPayments):**
- **Free Trial**: 3 days, 5 analyses total
- **Pro**: $59/month, unlimited analyses

### 2. New Files Created

#### NOWPayments Client Library
- `lib/nowpayments/client.ts` - API client with all endpoints
- `lib/nowpayments/pricing.ts` - Pricing configuration

#### API Routes
- `app/api/payment/create/route.ts` - Creates cryptocurrency payments
- `app/api/payment/ipn/route.ts` - IPN webhook handler for payment updates
- `app/api/payment/status/[paymentId]/route.ts` - Check payment status

#### Database Migration
- `supabase/migrations/20250127_nowpayments_migration.sql` - Database schema updates

### 3. Files Modified

#### Updated for NOWPayments
- `app/(app)/pricing/page.tsx` - Now shows 2 plans with crypto selection
- `app/page.tsx` - Homepage pricing section updated
- `actions/subscription.ts` - Subscription management actions
- `.env.example` - Environment variables template
- `.env.local` - Your credentials configured

### 4. Files Removed

#### Stripe Integration (Deleted)
- `lib/stripe/client.ts`
- `lib/stripe/server.ts`
- `app/api/checkout/route.ts`
- `app/api/customer-portal/route.ts`
- `app/api/webhooks/stripe/route.ts`

## Environment Variables

### Required Configuration

Add these to your `.env.local` file (already done):

```env
# NOWPayments
NOWPAYMENTS_API_KEY=CHE07VR-7QWMSSV-KPBJVS0-TXCK63A
NOWPAYMENTS_IPN_SECRET=GBU0zyS18Nj4uu6dJc9xF7O16l5uqJU2

# App URL (for IPN callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3005
```

## Database Schema Changes

Run the migration to update your database:

```sql
-- Add NOWPayments columns
ALTER TABLE subscriptions
ADD COLUMN payment_id TEXT,
ADD COLUMN order_id TEXT UNIQUE,
ADD COLUMN pay_currency TEXT,
ADD COLUMN pay_amount DECIMAL(20, 8);

-- Update plan constraints to only allow 'free' and 'pro'
-- Remove 'enterprise' tier
```

## How It Works

### Payment Flow

1. **User clicks "Upgrade to Pro"** on pricing page
2. **Selects cryptocurrency** (BTC, ETH, USDT, or LTC)
3. **Payment is created** via `/api/payment/create`
   - Generates unique order ID
   - Creates payment with NOWPayments
   - Stores pending subscription in database
4. **User is redirected** to NOWPayments invoice page
5. **User sends crypto** to the provided address
6. **NOWPayments sends IPN callback** to `/api/payment/ipn`
7. **Subscription is activated** automatically when payment is confirmed

### IPN Webhook

The IPN webhook (`/api/payment/ipn`) handles:
- Payment confirmation → Activate subscription
- Payment failure → Cancel subscription
- Partial payment → Mark as past_due
- Payment expiry → Cancel subscription

**Security:** All IPN callbacks are verified using HMAC SHA-512 signature.

## Testing

### Local Testing Setup

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Expose local server for IPN:**
   ```bash
   # Use ngrok or similar
   ngrok http 3005
   ```

3. **Configure IPN URL in NOWPayments dashboard:**
   ```
   https://your-ngrok-url.ngrok.io/api/payment/ipn
   ```

### Test Payment Flow

1. Go to `http://localhost:3005/pricing`
2. Select a cryptocurrency
3. Click "Upgrade to Pro"
4. You'll be redirected to NOWPayments
5. Complete payment (use testnet for testing)
6. IPN will trigger and activate subscription

## Supported Cryptocurrencies

The platform supports 150+ cryptocurrencies including:

- **Bitcoin (BTC)**
- **Ethereum (ETH)**
- **Tether (USDT)** - ERC20, TRC20, BEP20
- **Litecoin (LTC)**
- **Bitcoin Cash (BCH)**
- **Dogecoin (DOGE)**
- **Monero (XMR)**
- **Ripple (XRP)**
- And 140+ more...

Users can select their preferred cryptocurrency on the pricing page.

## Production Deployment

### Steps for Production

1. **Set production environment variables:**
   ```env
   NOWPAYMENTS_API_KEY=your_production_api_key
   NOWPAYMENTS_IPN_SECRET=your_production_ipn_secret
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. **Configure IPN URL in NOWPayments dashboard:**
   ```
   https://yourdomain.com/api/payment/ipn
   ```

3. **Run database migration:**
   ```bash
   # Apply migration to production Supabase
   ```

4. **Test the complete flow:**
   - Create test payment
   - Verify IPN callback is received
   - Check subscription activation

## API Documentation

### Create Payment

**Endpoint:** `POST /api/payment/create`

**Request:**
```json
{
  "planId": "pro",
  "payCurrency": "btc"
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "payment_id": "5245717658",
    "pay_address": "bc1q...",
    "pay_amount": 0.00123456,
    "pay_currency": "btc",
    "payment_url": "https://nowpayments.io/payment/...",
    "order_id": "sub_user123_1234567890"
  }
}
```

### Check Payment Status

**Endpoint:** `GET /api/payment/status/:paymentId`

**Response:**
```json
{
  "success": true,
  "payment": {
    "payment_id": "5245717658",
    "payment_status": "confirmed",
    "pay_amount": 0.00123456,
    "actually_paid": 0.00123456,
    "order_id": "sub_user123_1234567890"
  }
}
```

### IPN Callback

**Endpoint:** `POST /api/payment/ipn`

**Headers:**
```
x-nowpayments-sig: hmac_sha512_signature
```

**Body:**
```json
{
  "payment_id": "5245717658",
  "payment_status": "finished",
  "pay_address": "bc1q...",
  "price_amount": 59,
  "price_currency": "usd",
  "pay_amount": 0.00123456,
  "pay_currency": "btc",
  "order_id": "sub_user123_1234567890"
}
```

## Troubleshooting

### IPN Not Receiving

1. Check IPN URL is correctly configured in NOWPayments dashboard
2. Verify IPN secret is correct in `.env.local`
3. Check server logs for signature verification errors
4. Ensure server is publicly accessible (use ngrok for local testing)

### Payment Not Activating

1. Check IPN callback was received (check server logs)
2. Verify database was updated (check subscriptions table)
3. Check payment status in NOWPayments dashboard
4. Look for errors in `/api/payment/ipn` logs

### Wrong Amount

1. NOWPayments automatically calculates crypto amount based on current exchange rates
2. Users must send exact amount shown
3. Partial payments will mark subscription as "past_due"

## Support

- **NOWPayments Documentation:** https://nowpayments.io/doc
- **NOWPayments API Status:** https://nowpayments.io/status
- **Support Email:** support@nowpayments.io

## Next Steps

- [ ] Test payment flow thoroughly
- [ ] Set up production IPN endpoint
- [ ] Configure rate limiting for API routes
- [ ] Add payment status polling on frontend
- [ ] Implement email notifications for successful payments
- [ ] Add subscription renewal handling (30-day recurring)
- [ ] Create admin dashboard to view payments

---

**Implementation Date:** January 27, 2025
**Status:** ✅ Complete and Ready for Testing
