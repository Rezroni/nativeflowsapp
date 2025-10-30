# NOWPayments IPN Setup Guide

## Overview
This guide explains how to configure the IPN (Instant Payment Notification) callback URL for NOWPayments integration with your Nativeflows application.

## Production IPN Callback URL
```
https://www.nativeflows.com/api/payment/ipn
```

## Step-by-Step Setup

### 1. Configure NOWPayments Dashboard

1. **Login to NOWPayments Dashboard**
   - Go to: https://account.nowpayments.io/
   - Sign in with your credentials

2. **Navigate to Settings**
   - Click on "Settings" in the left sidebar
   - Look for "IPN Settings" or "Callback Settings"

3. **Set IPN Callback URL**
   - **IPN Callback URL:** `https://www.nativeflows.com/api/payment/ipn`
   - **Important:** Make sure the URL is HTTPS (required for production)
   - Save the settings

4. **Get Your IPN Secret Key**
   - In the same settings area, you'll find your IPN Secret Key
   - Copy this key - you'll need it for Vercel environment variables
   - **Keep this secret secure** - it's used to verify webhook authenticity

5. **Get Your API Key**
   - Navigate to API settings
   - Copy your API Key
   - This is different from the IPN Secret

### 2. Configure Vercel Environment Variables

Add these environment variables to your Vercel project:

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard
   - Select your `nativeflows` project

2. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add the following variables:

```bash
# NOWPayments Configuration
NOWPAYMENTS_API_KEY=your_api_key_from_nowpayments_dashboard
NOWPAYMENTS_IPN_SECRET=your_ipn_secret_from_nowpayments_dashboard

# App URL (should be set to production domain)
NEXT_PUBLIC_APP_URL=https://www.nativeflows.com
```

3. **Important Notes:**
   - Make sure `NEXT_PUBLIC_APP_URL` is set to `https://www.nativeflows.com` (no trailing slash)
   - The IPN callback URL is automatically constructed as `${NEXT_PUBLIC_APP_URL}/api/payment/ipn`
   - Both API Key and IPN Secret are sensitive - mark them as "Sensitive" in Vercel

4. **Redeploy**
   - After adding environment variables, redeploy your application
   - Vercel will automatically rebuild with the new variables

### 3. Verify IPN Setup

After deployment, verify your IPN endpoint is accessible:

#### Test IPN Endpoint Accessibility
```bash
curl -X POST https://www.nativeflows.com/api/payment/ipn \
  -H "Content-Type: application/json" \
  -H "x-nowpayments-sig: test" \
  -d '{"payment_id": "test"}'
```

**Expected Response:**
- If endpoint is accessible but signature is invalid: `400` or `401` status (this is correct!)
- If endpoint doesn't exist: `404` status (this means something is wrong)

## How IPN Works

### Payment Flow
1. **User Creates Payment**
   - User selects Pro plan and cryptocurrency
   - System creates payment via NOWPayments API
   - Payment record stored in database with status: `pending`

2. **User Pays**
   - User sends cryptocurrency to the provided address
   - NOWPayments detects the payment

3. **IPN Callback Triggered**
   - NOWPayments sends POST request to: `https://www.nativeflows.com/api/payment/ipn`
   - Request includes payment status and transaction details
   - Request has signature in `x-nowpayments-sig` header

4. **Signature Verification**
   - Your endpoint receives the callback
   - Verifies HMAC-SHA512 signature using `NOWPAYMENTS_IPN_SECRET`
   - If signature is invalid, request is rejected (prevents fraud)

5. **Status Update**
   - If signature is valid, payment status is processed
   - Database updated based on payment status:
     - `finished` or `confirmed` → Subscription activated, user upgraded to Pro
     - `partially_paid` → Marked as `past_due`
     - `failed`, `refunded`, `expired` → Subscription canceled
     - `waiting`, `confirming`, `sending` → Marked as `pending`

### Payment Statuses
- **waiting**: Payment created, waiting for user to send funds
- **confirming**: Payment detected, waiting for blockchain confirmations
- **confirmed**: Payment confirmed on blockchain
- **sending**: Funds being sent to your account
- **finished**: Payment completed successfully ✅
- **failed**: Payment failed ❌
- **refunded**: Payment refunded to user
- **expired**: Payment expired (user didn't pay in time)
- **partially_paid**: User sent less than required amount

## Code Implementation

### IPN Endpoint Location
```
app/api/payment/ipn/route.ts
```

### Key Security Features
✅ **HMAC-SHA512 Signature Verification** - Prevents unauthorized callbacks
✅ **Service Role Key** - Uses Supabase service role for database writes
✅ **Error Handling** - Comprehensive error logging and handling
✅ **Idempotency** - Handles duplicate callbacks gracefully

### Payment Creation
When a payment is created in `app/api/payment/create/route.ts`:
```typescript
ipn_callback_url: `${baseUrl}/api/payment/ipn`
```
This automatically sets your IPN URL for each payment.

## Testing IPN Locally

### For Local Development

1. **Use ngrok or similar tool to expose local server:**
```bash
ngrok http 3005
```

2. **Set IPN URL in NOWPayments dashboard to ngrok URL:**
```
https://your-ngrok-url.ngrok.io/api/payment/ipn
```

3. **Update local .env:**
```bash
NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok.io
```

4. **Create a test payment and monitor console logs**

### Testing Production IPN

1. **Create a small test payment (minimum amount)**
   - Use smallest cryptocurrency amount possible
   - Monitor Vercel logs for IPN callbacks

2. **Check Vercel Logs**
   - Go to Vercel Dashboard → Your Project → Logs
   - Filter for `/api/payment/ipn` endpoint
   - Look for IPN callback logs

3. **Verify Database Updates**
   - Check Supabase `subscriptions` table
   - Verify status changes from `pending` → `active` after payment

## Troubleshooting

### IPN Callbacks Not Received
1. ✅ Verify `NEXT_PUBLIC_APP_URL` is set correctly in Vercel
2. ✅ Check NOWPayments dashboard shows correct IPN URL
3. ✅ Ensure URL is HTTPS (HTTP won't work in production)
4. ✅ Check Vercel function logs for errors

### Invalid Signature Errors
1. ✅ Verify `NOWPAYMENTS_IPN_SECRET` matches dashboard value
2. ✅ Check environment variable is deployed (redeploy if needed)
3. ✅ Ensure no extra whitespace in environment variable

### Payment Status Not Updating
1. ✅ Check Vercel logs for IPN callback errors
2. ✅ Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
3. ✅ Check database permissions for service role
4. ✅ Look for errors in subscription update queries

## Support Resources

- **NOWPayments API Documentation:** https://documenter.getpostman.com/view/7907941/2s93JusNJt
- **NOWPayments Support:** support@nowpayments.io
- **IPN Callback Documentation:** https://nowpayments.io/help/ipn-instant-payment-notifications

## Security Best Practices

1. ✅ **Never commit API keys** - Use environment variables only
2. ✅ **Always verify signatures** - Don't trust callbacks without verification
3. ✅ **Use HTTPS** - Required for production IPN callbacks
4. ✅ **Log everything** - Keep detailed logs for debugging
5. ✅ **Handle duplicates** - IPN may send same callback multiple times
6. ✅ **Validate data** - Don't assume callback data is always correct

## Production Checklist

Before going live, ensure:

- [ ] `NOWPAYMENTS_API_KEY` is set in Vercel
- [ ] `NOWPAYMENTS_IPN_SECRET` is set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL=https://www.nativeflows.com` is set in Vercel
- [ ] IPN URL `https://www.nativeflows.com/api/payment/ipn` is configured in NOWPayments dashboard
- [ ] Test payment completed successfully
- [ ] IPN callback received and logged in Vercel
- [ ] Subscription status updated to `active` in database
- [ ] User profile upgraded to `pro` tier
- [ ] Email notification sent (if implemented)

---

## Quick Reference

**Production IPN URL:**
```
https://www.nativeflows.com/api/payment/ipn
```

**Environment Variables Required:**
```bash
NOWPAYMENTS_API_KEY=<from-nowpayments-dashboard>
NOWPAYMENTS_IPN_SECRET=<from-nowpayments-dashboard>
NEXT_PUBLIC_APP_URL=https://www.nativeflows.com
SUPABASE_SERVICE_ROLE_KEY=<from-supabase>
```

**Test IPN Endpoint:**
```bash
curl -I https://www.nativeflows.com/api/payment/ipn
```

Expected: `405 Method Not Allowed` (GET is not allowed, only POST)

---

**Last Updated:** 2025-10-30
**Version:** 1.0
