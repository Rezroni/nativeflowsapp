# CRITICAL ISSUE: Bundle Size INCREASED

## Problem Analysis

### Before Optimizations:
```
/ (Homepage): 5.86 kB → 332 kB First Load JS
First Load JS shared by all: 218 kB
```

### After Optimizations:
```
/ (Homepage): 2.84 kB → 480 kB First Load JS ❌
First Load JS shared by all: 376 kB ❌

Shared chunks breakdown:
├ chunks/commons-61496ae312bd8137.js              36.9 kB
├ chunks/npm.next-dc57558a42667565.js              166 kB
├ chunks/npm.sentry-b2bf6b51029fdf87.js           78.1 kB ⚠️ PROBLEM
└ chunks/npm.sentry-internal-368b4cb1f64f5069.js    91 kB ⚠️ PROBLEM
```

## Root Cause

The webpack optimization caused **Sentry (~169 kB)** to be included in the shared chunks, which loads on **every page** including the homepage.

Sentry is only needed for:
- Error tracking (optional, can be deferred)
- Performance monitoring (optional, can be deferred)

It should NOT be in the critical path for FCP!

## Impact

- Homepage First Load JS: **+148 kB (45% INCREASE)** ❌
- FCP will be WORSE, not better
- This completely defeats the optimization

## Solution

1. **Remove Sentry from client-side initial bundle**
2. **Load Sentry asynchronously after page interactive**
3. **Consider removing Sentry entirely from homepage** (it's a landing page)
4. **Revert webpack chunking strategy** (it's causing more harm than good)

The webpack optimization strategy backfired because it put Sentry in shared chunks.
