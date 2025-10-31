# PWA Setup Guide for Nativeflows

## Overview
Nativeflows has been converted into a Progressive Web App (PWA) with full offline support, push notifications, and installability.

## Features Implemented

### ✅ Phase 1: Core PWA Foundation
- [x] Web app manifest with app metadata and branding
- [x] PWA icons (192x192, 512x512, maskable icons)
- [x] Service worker with offline caching strategy
- [x] Service worker registration and lifecycle management

### ✅ Phase 2: User Engagement
- [x] Install prompt component with beautiful UI
- [x] Install detection and smart triggering (after 30s engagement)
- [x] Platform-specific instructions (iOS/Android)

### ✅ Phase 3: Push Notifications
- [x] Database schema for push subscriptions
- [x] Push notification infrastructure
- [x] Notification permission UI
- [x] Subscription management API

### ✅ Phase 4: App Experience
- [x] App-like navigation with standalone mode
- [x] Offline fallback page
- [x] Service worker update notifications
- [x] Safe area insets for notched devices

### ✅ Phase 5: Configuration
- [x] Next.js PWA optimizations
- [x] Proper caching headers
- [x] iOS-specific PWA fixes

## Setup Instructions

### 1. Generate VAPID Keys for Push Notifications

```bash
npx web-push generate-vapid-keys
```

This will output:
```
Public Key: <your-public-key>
Private Key: <your-private-key>
```

### 2. Add Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your-public-key>
VAPID_PRIVATE_KEY=<your-private-key>
VAPID_SUBJECT=mailto:your-email@nativeflows.ai
```

### 3. Run Database Migration

```bash
npx supabase db push
```

This creates the `push_subscriptions` and `notification_history` tables.

### 4. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3005` and:
- Check for the install prompt after 30 seconds
- Grant notification permissions
- Test offline by stopping the server

### 5. Deploy

```bash
npm run build
npm start
```

Or deploy to Vercel:
```bash
vercel --prod
```

## How It Works

### Service Worker Caching Strategy

- **Precache**: Essential files (/, /offline, manifest, icons)
- **Network First**: Navigation requests (fallback to cache if offline)
- **Cache First**: Static assets (images, CSS, JS, fonts)
- **Network Only**: API calls, Supabase, Stripe

### Install Prompt Behavior

- Shows after 30 seconds of user engagement
- Can be dismissed (won't show again for 24 hours)
- Platform-specific instructions for iOS users
- Auto-detects if already installed

### Notification Prompt Behavior

- Shows after 2 minutes of engagement
- Requires install prompt to be dismissed first
- Can be dismissed (won't show again for 3 days)
- Stores subscriptions in Supabase

### Offline Support

- Previously viewed pages work offline
- Cached images and resources load
- Custom offline page shown for new pages
- Network requests queue and sync when online

## Testing

### Test PWA Score
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Run audit (should score 100%)

### Test Installation

**Android Chrome:**
1. Visit site
2. Wait for install prompt or tap menu → "Install app"
3. App appears on home screen

**iOS Safari:**
1. Visit site
2. Tap Share button
3. Scroll down → "Add to Home Screen"
4. Tap "Add"

**Desktop Chrome:**
1. Visit site
2. Look for install icon in address bar
3. Click to install

### Test Offline Mode

1. Install the app
2. Visit some pages
3. Open DevTools → Application → Service Workers
4. Check "Offline"
5. Reload page (should work)
6. Navigate to cached pages (should work)
7. Navigate to new page (shows offline page)

### Test Push Notifications

1. Grant notification permission
2. Use the admin API to send a test notification
3. Notification should appear even if app is closed

## Browser Support

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Install | ✅ | ✅ | ✅ (iOS 16.4+) | ✅ |
| Offline | ✅ | ✅ | ✅ | ✅ |
| Push | ✅ | ✅ | ✅ (iOS 16.4+) | ✅ |
| Shortcuts | ✅ | ✅ | ❌ | ❌ |

## File Structure

```
public/
├── manifest.json              # PWA manifest
├── browserconfig.xml          # Windows tile config
├── service-worker.js          # Service worker
└── icons/                     # PWA icons
    ├── icon-*.png
    └── icon-maskable-*.png

app/
├── offline/page.tsx           # Offline fallback page
└── api/push/subscribe/route.ts # Push subscription API

components/pwa/
├── pwa-provider.tsx           # PWA context provider
├── install-prompt.tsx         # Install prompt UI
└── notification-prompt.tsx    # Notification permission UI

lib/pwa/
├── service-worker-registration.ts # SW registration
└── push-notifications.ts      # Push notification utils

hooks/
└── use-pwa.ts                 # PWA status hook

supabase/migrations/
└── 20250131000000_add_push_subscriptions.sql
```

## Sending Push Notifications

To send push notifications to users, you'll need to create an API endpoint or server function that:

1. Retrieves subscriptions from the database
2. Uses the web-push library to send notifications

Example (create in `lib/pwa/send-notification.ts`):

```typescript
import webpush from 'web-push'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function sendNotification(subscription: any, payload: any) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload))
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}
```

## Troubleshooting

### Service Worker Not Updating
- Hard refresh (Ctrl+Shift+R)
- Clear cache and reload
- Increment version in service-worker.js

### Install Prompt Not Showing
- Check localStorage for 'install-prompt-dismissed'
- Clear localStorage and wait 30 seconds
- Check console for errors

### Push Notifications Not Working
- Verify VAPID keys are set correctly
- Check notification permission is granted
- Verify subscription is saved to database
- Check service worker is registered

### Icons Not Loading
- Run `node scripts/generate-pwa-icons.js`
- Check `public/icons/` directory
- Verify manifest.json paths

## Next Steps

1. **Generate VAPID keys** and add to environment variables
2. **Run the database migration** to create subscription tables
3. **Test the PWA locally** before deploying
4. **Deploy to production** and test on real devices
5. **Implement notification sending** logic for your use cases

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web Push Protocol](https://web.dev/push-notifications-overview/)
- [iOS PWA Support](https://developer.apple.com/documentation/webkit/supporting_web_apps_with_manifest_files)

---

**Note**: For push notifications to work, you need to install the `web-push` package:

```bash
npm install web-push
```

Then generate VAPID keys and configure them in your environment variables.
