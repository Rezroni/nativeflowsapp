# PWA Quick Start Guide - Nativeflows

## 🚀 Get Your PWA Running in 5 Minutes

### Step 1: Generate VAPID Keys (1 min)
```bash
npx web-push generate-vapid-keys
```

Copy the output.

### Step 2: Update Environment (1 min)
Create or edit `.env.local`:
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_SUBJECT=mailto:support@nativeflows.ai
```

### Step 3: Run Migration (1 min)
```bash
npx supabase db push
```

### Step 4: Start Development (1 min)
```bash
npm run dev
```

### Step 5: Test PWA (1 min)
1. Open http://localhost:3005
2. Wait 30 seconds → install prompt appears
3. Test offline: DevTools → Application → Service Workers → Offline checkbox
4. Refresh page → works offline ✅

## ✅ That's It!

Your PWA is now running with:
- Install prompts
- Offline support
- Push notifications (ready to use)
- App-like experience

## 🎯 What to Check

### Chrome DevTools → Application Tab
- **Manifest**: Should show Nativeflows details
- **Service Workers**: Should be active
- **Storage**: Check Cache Storage

### Chrome DevTools → Lighthouse
- Run PWA audit
- Expected score: 90-100%

## 📱 Test on Mobile

### Android
1. Visit your deployed URL
2. Chrome menu → "Install app"
3. App appears on home screen

### iOS
1. Visit your deployed URL in Safari
2. Share button → "Add to Home Screen"
3. App opens in standalone mode

## 🔥 Deploy to Production

```bash
npm run build
vercel --prod
```

Then test on real devices!

## 📚 More Information

- Full guide: [PWA_SETUP.md](PWA_SETUP.md)
- Implementation details: [PWA_IMPLEMENTATION_SUMMARY.md](PWA_IMPLEMENTATION_SUMMARY.md)

## 🆘 Need Help?

Common issues:
- **Install prompt not showing**: Wait 30s, check localStorage
- **Service worker not working**: Hard refresh (Ctrl+Shift+R)
- **Push notifications failing**: Check VAPID keys in .env.local

---

**You're all set! 🎉**
