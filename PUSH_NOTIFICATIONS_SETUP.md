# Push Notifications Setup Guide

Complete guide to setting up and using the push notification system in NativeFlows.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Generate VAPID Keys](#generate-vapid-keys)
4. [Database Setup](#database-setup)
5. [Configuration](#configuration)
6. [Testing](#testing)
7. [Usage](#usage)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The push notification system enables real-time engagement with users through:
- **Analysis completion notifications**
- **Subscription expiry reminders**
- **Usage limit warnings**
- **New feature announcements**
- **Daily trading tips** (optional)

### Architecture

- **Client Library**: `lib/push/client.ts` - Browser-side push handling
- **Server Library**: `lib/push/server.ts` - Server-side push sending
- **Service Worker**: `public/service-worker.js` - Background push handler
- **Database**: Push subscriptions and notification history tables
- **UI Components**: Permission prompts, notification center, preferences

---

## ✅ Prerequisites

Before setting up push notifications, ensure you have:

1. **Supabase Project** - For database and authentication
2. **Service Worker** - Already implemented in `/public/service-worker.js`
3. **HTTPS Connection** - Required for Web Push API (localhost is OK for development)
4. **Modern Browser** - Chrome, Firefox, Edge, or Safari 16.4+

---

## 🔑 Generate VAPID Keys

VAPID (Voluntary Application Server Identification) keys are required for Web Push API.

### Step 1: Install web-push (Already installed)

```bash
npm install web-push
```

### Step 2: Generate Keys

```bash
npx web-push generate-vapid-keys
```

### Expected Output:

```
=======================================

Public Key:
BEl62iUYgUivxIkv69yViEuiBIa-Ib27SGeN...

Private Key:
nNEiw2I5R7JEXPrCUvH6X1tG3yI7rHoTnMU...

=======================================
```

### Step 3: Add Keys to `.env.local`

```env
# PWA Push Notifications (VAPID Keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa-Ib27SGeN...
VAPID_PRIVATE_KEY=nNEiw2I5R7JEXPrCUvH6X1tG3yI7rHoTnMU...
VAPID_SUBJECT=mailto:your-email@example.com
```

> **Important**: Never commit your private key to version control!

---

## 💾 Database Setup

### Run the Migration

The push notification system requires two tables:

1. **push_subscriptions** - Stores user push subscriptions
2. **notification_history** - Logs sent notifications

```bash
npx supabase db push
```

Or manually run the migration:

```sql
-- Located in: supabase/migrations/20250131000000_add_push_subscriptions.sql
```

### Verify Tables Created

Check in Supabase Dashboard → Table Editor:

- ✅ `push_subscriptions` table exists
- ✅ `notification_history` table exists
- ✅ `profiles.notification_preferences` column added

---

## ⚙️ Configuration

### 1. Environment Variables

Ensure these are set in `.env.local`:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3005
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

### 2. Service Worker

The service worker is already configured at `/public/service-worker.js`.

Verify it's registered in your app by checking:
- Browser DevTools → Application → Service Workers
- Should show "activated and is running"

### 3. Notification Preferences

Default preferences are set for all users:

```typescript
{
  push_enabled: true,
  email_enabled: true,
  analysis_complete: true,
  subscription_expiring: true,
  new_feature: true,
  daily_tip: false,  // Opt-in
  usage_warning: true
}
```

Users can customize these in Settings → Notification Preferences.

---

## 🧪 Testing

### 1. Test Push Permission

```typescript
import { isPushSupported, requestNotificationPermission } from '@/lib/push/client';

// Check if supported
if (isPushSupported()) {
  // Request permission
  const permission = await requestNotificationPermission();
  console.log('Permission:', permission); // "granted", "denied", or "default"
}
```

### 2. Test Local Notification

```typescript
import { showLocalNotification } from '@/lib/push/client';

await showLocalNotification({
  type: 'analysis_complete',
  title: '🎉 Analysis Complete!',
  body: 'Your chart analysis is ready to view.',
  data: {
    url: '/analysis/123',
  },
});
```

### 3. Test Server-Side Push

Create a test API route or use the existing `/api/push/send` endpoint:

```typescript
// Send to yourself (requires authentication)
fetch('/api/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'your-user-id',
    type: 'analysis_complete',
    data: {
      chartName: 'Test Chart',
      url: '/analysis/123',
    },
  }),
});
```

### 4. Test in Browser Console

```javascript
// Check service worker status
navigator.serviceWorker.ready.then(reg => {
  console.log('Service Worker Ready:', reg);
});

// Check push subscription
navigator.serviceWorker.ready.then(reg => {
  reg.pushManager.getSubscription().then(sub => {
    console.log('Push Subscription:', sub);
  });
});
```

---

## 📖 Usage

### Enable Push Notifications (User Flow)

1. **Automatic Prompt**: After 5 seconds on first visit
2. **Manual Toggle**: Settings → Notification Preferences
3. **Permission Request**: Browser shows native prompt
4. **Subscription**: Saved to database automatically

### Send Push Notification (Server)

```typescript
import { sendPushNotification } from '@/lib/push/server';

// Send analysis complete notification
await sendPushNotification(
  userId,
  'analysis_complete',
  {
    chartName: 'EURUSD Daily Chart',
    url: `/analysis/${analysisId}`,
  }
);
```

### Notification Types

```typescript
type NotificationType =
  | 'analysis_complete'     // ✅ When analysis finishes
  | 'subscription_expiring'  // ⏰ 3 days before expiry
  | 'new_feature'           // ✨ Product updates
  | 'daily_tip'             // 💡 Educational content
  | 'usage_warning';        // ⚠️ Near usage limit
```

### Helper Functions

```typescript
// Analysis complete
import { notifyAnalysisComplete } from '@/lib/push/server';
await notifyAnalysisComplete(userId, analysisId, 'Chart Name');

// Subscription expiring
import { notifySubscriptionExpiring } from '@/lib/push/server';
await notifySubscriptionExpiring(userId, 3, 'Pro Monthly');

// Usage warning
import { notifyUsageWarning } from '@/lib/push/server';
await notifyUsageWarning(userId, 2);

// New feature (to all users)
import { notifyNewFeature } from '@/lib/push/server';
await notifyNewFeature('Dark Mode', 'Toggle between light and dark themes', '/settings');
```

---

## 🐛 Troubleshooting

### Push Notifications Not Working

**1. Check Browser Support**

```javascript
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('✅ Push supported');
} else {
  console.log('❌ Push not supported');
}
```

**2. Check Service Worker**

- Open DevTools → Application → Service Workers
- Should show "activated and is running"
- If not, try: Clear site data → Hard refresh (Ctrl+Shift+R)

**3. Check Permission**

```javascript
console.log('Notification permission:', Notification.permission);
// Should be "granted"
```

**4. Check Subscription**

```javascript
navigator.serviceWorker.ready.then(reg => {
  reg.pushManager.getSubscription().then(sub => {
    if (sub) {
      console.log('✅ Subscribed:', sub.endpoint);
    } else {
      console.log('❌ Not subscribed');
    }
  });
});
```

**5. Check VAPID Keys**

- Verify keys are in `.env.local`
- Restart dev server after adding keys
- Check browser console for errors

### Common Errors

#### "Push notifications are not supported"

- **Solution**: Use HTTPS or localhost
- **Check**: Browser compatibility

#### "Permission denied"

- **Solution**: Clear site data and try again
- **Check**: Browser settings → Site permissions

#### "Subscription not found"

- **Solution**: Re-subscribe by toggling notifications
- **Check**: Database has subscription record

#### "Failed to send notification"

- **Solution**: Check VAPID keys are correct
- **Check**: Service worker is active
- **Solution**: Verify subscription endpoint is valid

### Debug Mode

Enable verbose logging:

```typescript
// lib/push/client.ts
const DEBUG = true;

if (DEBUG) {
  console.log('[Push] Detailed log message...');
}
```

### Browser-Specific Issues

**Chrome/Edge**
- Check chrome://flags/#enable-push-api
- Ensure notifications are enabled in OS settings

**Firefox**
- Check about:config → dom.webnotifications.enabled
- Ensure push is not blocked

**Safari**
- Requires Safari 16.4+
- May need explicit permissions

---

## 📱 Testing on Mobile

### iOS (Safari 16.4+)

1. Add to Home Screen
2. Open as PWA
3. Grant notification permission
4. Test receiving notifications

### Android (Chrome/Firefox)

1. Visit site in browser
2. Grant notification permission
3. Can receive without installing PWA
4. Test both browser and PWA mode

---

## 🚀 Production Deployment

### Checklist

- [ ] Generate production VAPID keys
- [ ] Add keys to Vercel environment variables
- [ ] Run database migration on production
- [ ] Test notifications on production URL
- [ ] Verify HTTPS is enabled
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Monitor error logs (Sentry)

### Vercel Environment Variables

Add to Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=production_public_key
VAPID_PRIVATE_KEY=production_private_key
VAPID_SUBJECT=mailto:support@nativeflows.com
```

---

## 📊 Monitoring

### Key Metrics to Track

- **Permission Grant Rate**: % of users who enable notifications
- **Subscription Rate**: % of users with active subscriptions
- **Delivery Success Rate**: % of sent notifications delivered
- **Click-Through Rate**: % of notifications clicked
- **Unsubscribe Rate**: % of users who disable notifications

### Mixpanel Events

Already tracked:
- `push_permission_requested`
- `push_permission_granted`
- `push_subscription_created`
- `notification_sent`
- `notification_clicked`

---

## 🎯 Best Practices

### Do's ✅

- Request permission after user engagement
- Provide clear value proposition
- Allow easy opt-out
- Respect user preferences
- Test on real devices
- Monitor delivery rates

### Don'ts ❌

- Don't spam users
- Don't request permission on page load
- Don't ignore user preferences
- Don't send sensitive data
- Don't assume delivery
- Don't forget error handling

---

## 📚 Additional Resources

- [Web Push API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker Guide](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [VAPID Specification](https://datatracker.ietf.org/doc/html/rfc8292)
- [web-push Library](https://github.com/web-push-libs/web-push)

---

## ✅ Quick Start Checklist

- [ ] Generate VAPID keys: `npx web-push generate-vapid-keys`
- [ ] Add keys to `.env.local`
- [ ] Run database migration: `npx supabase db push`
- [ ] Restart dev server: `npm run dev`
- [ ] Test permission prompt in browser
- [ ] Enable notifications in settings
- [ ] Send test notification
- [ ] Verify notification received
- [ ] Check notification center

---

**Need Help?** Check the troubleshooting section or review the code in:
- `lib/push/` - Push notification logic
- `components/notifications/` - UI components
- `app/api/push/` - API endpoints

**Ready to go!** Push notifications are now fully configured. 🎉
