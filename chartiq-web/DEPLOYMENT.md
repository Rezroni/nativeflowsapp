# Deployment Guide

## Prerequisites

Before deploying to production, ensure you have:

1. ✅ Supabase project created
2. ✅ OpenAI API key with GPT-4 Vision access
3. ✅ NOWPayments account configured
4. ✅ Sentry project created (optional but recommended)
5. ✅ Mixpanel project created

## Environment Variables

### Required for Production

Copy these environment variables to your Vercel project settings:

#### Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### OpenAI
```bash
OPENAI_API_KEY=sk-your-openai-key
```

#### NOWPayments
```bash
NOWPAYMENTS_API_KEY=your_nowpayments_api_key
NOWPAYMENTS_IPN_SECRET=your_ipn_secret_key
```

#### App Configuration
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

#### Analytics & Monitoring (Optional)
```bash
# Mixpanel (Optional - token is hardcoded, but can be overridden)
NEXT_PUBLIC_MIXPANEL_TOKEN=88069cff4ab270a6057723937aab503e

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

## Deployment Steps

### 1. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Option B: Using Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure environment variables
6. Deploy!

### 2. Configure Database

After deployment, run the Supabase migrations:

```bash
# Connect to your Supabase project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# Or run migrations manually in Supabase SQL Editor
# Use the SQL file: supabase/migrations/001_initial_schema.sql
```

### 3. Configure NOWPayments IPN

1. Go to [NOWPayments Dashboard](https://nowpayments.io/dashboard)
2. Navigate to Settings > IPN
3. Set IPN Callback URL to: `https://your-domain.com/api/payment/ipn`
4. Save your IPN secret key and add it to environment variables

### 4. Configure Custom Domain (Optional)

In Vercel:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

### 5. Verify Deployment

After deployment, verify:

- [ ] Landing page loads correctly
- [ ] Authentication works (Sign up, Sign in, Sign out)
- [ ] Chart analysis functions
- [ ] Payment creation works
- [ ] Webhooks are receiving updates
- [ ] Analytics are tracking events
- [ ] Errors are being captured in Sentry

## Post-Deployment Checklist

### Security
- [ ] All environment variables are set correctly
- [ ] No sensitive data exposed in client-side code
- [ ] Rate limiting is active
- [ ] CORS is configured properly
- [ ] SSL/HTTPS is enabled

### Performance
- [ ] Images are optimized
- [ ] Bundle size is reasonable (<300KB initial JS)
- [ ] Loading states are visible
- [ ] Error boundaries are working

### Monitoring
- [ ] Sentry is receiving errors
- [ ] Mixpanel is tracking events
- [ ] Vercel Analytics enabled
- [ ] Server logs are accessible

### Testing
- [ ] Create a test user account
- [ ] Upload and analyze a test chart
- [ ] Test payment flow (use testnet/small amount)
- [ ] Verify webhook IPN callbacks
- [ ] Test on mobile devices

## Rollback Plan

If something goes wrong:

1. **Immediate Rollback**
   ```bash
   # Rollback to previous deployment
   vercel rollback
   ```

2. **Check Logs**
   ```bash
   # View logs
   vercel logs your-deployment-url
   ```

3. **Debug**
   - Check Sentry for errors
   - Review Vercel deployment logs
   - Verify environment variables

## Updating Production

To deploy updates:

```bash
# For automatic deployment (with Git integration)
git push origin main

# For manual deployment
vercel --prod
```

## Environment-Specific Configuration

### Development
```bash
npm run dev
# Uses .env.local
```

### Staging (Optional)
```bash
vercel
# Preview deployment with production-like settings
```

### Production
```bash
vercel --prod
# Full production deployment
```

## Troubleshooting

### Build Fails
- Check that all dependencies are in package.json
- Verify Node version (use Node 18+)
- Review build logs in Vercel dashboard

### Runtime Errors
- Check Sentry for detailed error reports
- Verify all environment variables are set
- Check Supabase connection

### Payment Issues
- Verify NOWPayments API keys
- Check IPN webhook URL is accessible
- Review NOWPayments dashboard for failed payments

### Database Issues
- Verify Supabase connection string
- Check RLS policies are configured
- Ensure migrations ran successfully

## Support

For deployment issues:
- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/support
- NOWPayments: https://nowpayments.io/help

## Security Notes

### Never Commit to Git
- `.env.local`
- `.env.production`
- Any file containing API keys or secrets

### Rotate Keys Regularly
- Supabase service role key
- OpenAI API key
- NOWPayments API key
- Sentry auth token

### Monitor Access
- Review Vercel team access
- Check Supabase project members
- Audit API key usage

---

Last Updated: 2025-10-28
