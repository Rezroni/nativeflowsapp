# Next.js and Sentry Configuration Warnings - FIXED ✅

## Summary
All Next.js and Sentry configuration warnings have been resolved with proper migrations and best practices.

## Warnings Fixed

### 1. ✅ Invalid `serverActions` Configuration
**Warning:**
```
⚠ Invalid next.config.js options detected:
 ⚠     Unrecognized key(s) in object: 'serverActions'
```

**Fix:**
Moved `serverActions` configuration into the `experimental` section in [next.config.js](next.config.js):

```javascript
experimental: {
  optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  serverActions: {
    bodySizeLimit: '15mb', // For camera photo uploads
  },
}
```

### 2. ✅ Missing Global Error Handler
**Warning:**
```
[@sentry/nextjs] It seems like you don't have a global error handler set up
```

**Fix:**
Created [app/global-error.tsx](app/global-error.tsx) with Sentry instrumentation for React rendering error reporting.

### 3. ✅ Deprecated `sentry.client.config.ts`
**Warning:**
```
[@sentry/nextjs] DEPRECATION WARNING: It is recommended renaming your `sentry.client.config.ts` file
```

**Fix:**
- Created [instrumentation-client.ts](instrumentation-client.ts) (Turbopack-compatible)
- Added `onRouterTransitionStart` hook for navigation instrumentation
- Deleted deprecated `sentry.client.config.ts` file
- Updated [instrumentation.ts](instrumentation.ts) to load client config

### 4. ✅ Missing `onRequestError` Hook
**Warning:**
```
[@sentry/nextjs] Could not find `onRequestError` hook in instrumentation file
```

**Fix:**
Added `onRequestError` hook in [instrumentation.ts](instrumentation.ts) to capture errors from nested React Server Components:

```typescript
export function onRequestError(error, request, context) {
  Sentry.captureRequestError(error, request, context);
}
```

### 5. ✅ Missing Router Transition Hook
**Warning:**
```
[@sentry/nextjs] ACTION REQUIRED: To instrument navigations, export an `onRouterTransitionStart` hook
```

**Fix:**
Added to [instrumentation-client.ts](instrumentation-client.ts):

```typescript
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
```

## Files Modified

1. **next.config.js** - Moved serverActions to experimental
2. **instrumentation.ts** - Added onRequestError hook and client loader
3. **app/global-error.tsx** - New global error handler (created)
4. **instrumentation-client.ts** - New client-side Sentry config (created)
5. **sentry.client.config.ts** - Deleted (deprecated)

## Benefits

- ✅ **Next.js 15.5+** fully compatible configuration
- ✅ **Turbopack** ready (future Next.js compiler)
- ✅ **Better error tracking** with RSC and navigation errors
- ✅ **No deprecation warnings** on server startup
- ✅ **Production ready** with proper error boundaries

## Testing

Server starts cleanly without warnings:
```bash
npm run dev
```

Expected output:
```
   ▲ Next.js 15.5.7
   - Local:        http://localhost:3005
   - Experiments (use with caution):
     · serverActions
     · optimizePackageImports
 ✓ Starting...
 ✓ Ready in 8.2s
```

## Related Commits

- `12fcf05` - fix: Resolve Next.js and Sentry configuration warnings
- `2ea857a` - fix: Profile update and OpenRouter Gemini 2.0 Flash upgrade
