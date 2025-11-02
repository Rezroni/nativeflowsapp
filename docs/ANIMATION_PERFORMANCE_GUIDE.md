# Animation Performance Testing Guide

## Overview
This guide provides instructions for testing and optimizing animations to achieve 60fps performance across all devices.

## Performance Targets
- **Target Frame Rate**: 60fps (16.67ms per frame)
- **Acceptable Range**: 55-60fps on modern devices
- **Minimum**: 30fps on older devices
- **Animation Duration**: 150ms - 700ms for most animations
- **Stagger Delay**: 50ms - 150ms between items

## Testing Tools

### 1. Chrome DevTools Performance Tab
**Location**: Chrome DevTools > Performance

**Steps**:
1. Open DevTools (F12)
2. Navigate to Performance tab
3. Click Record (Ctrl+E)
4. Interact with animated elements
5. Stop recording
6. Analyze FPS chart and timeline

**What to Look For**:
- Green bars above 60fps line
- No red bars (dropped frames)
- Smooth animation timeline
- Low CPU usage during animations

### 2. Chrome DevTools Rendering Tab
**Location**: Chrome DevTools > More Tools > Rendering

**Enable**:
- ✅ Frame Rendering Stats
- ✅ Paint flashing
- ✅ Layout Shift Regions

**What to Check**:
- FPS counter stays near 60
- Minimal paint flashing (green boxes)
- No layout shifts (blue boxes)

### 3. React DevTools Profiler
**Location**: React DevTools > Profiler

**Steps**:
1. Click Record
2. Trigger animations
3. Stop recording
4. Review component render times

**What to Look For**:
- Render times < 16ms
- No unnecessary re-renders
- Efficient component updates

### 4. Lighthouse Performance Audit
**Location**: Chrome DevTools > Lighthouse

**Run Audit**:
1. Select "Performance"
2. Click "Analyze page load"
3. Review metrics

**Target Scores**:
- Performance: 95+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total Blocking Time: < 200ms

## Animation Performance Checklist

### ✅ CSS/Animation Best Practices
- [x] Use `transform` and `opacity` (GPU-accelerated)
- [x] Avoid animating `width`, `height`, `top`, `left`
- [x] Use `will-change` sparingly and remove after animation
- [x] Implement `prefers-reduced-motion` support
- [x] Use CSS containment (`contain: layout paint`)

### ✅ Framer Motion Optimizations
- [x] Use `layout` prop only when necessary
- [x] Leverage `useReducedMotion` hook
- [x] Use `AnimatePresence` for exit animations
- [x] Implement proper animation variants
- [x] Use spring physics for natural motion

### ✅ React Performance
- [x] Memoize expensive calculations with `useMemo`
- [x] Use `React.memo` for pure components
- [x] Avoid inline functions in render
- [x] Implement proper `useCallback` usage
- [x] Lazy load heavy animation components

### ✅ Browser Optimizations
- [x] Enable hardware acceleration
- [x] Use CSS `transform: translateZ(0)` for GPU layer
- [x] Minimize DOM manipulations during animation
- [x] Batch DOM reads and writes
- [x] Use `requestAnimationFrame` for custom animations

## Testing Scenarios

### 1. Dashboard Stats Animation
**Test**: Dashboard page load with counter animations

**Expected**:
- Counters animate smoothly from 0 to target
- No jank during number transitions
- Staggered cards appear without frame drops

**How to Test**:
```bash
# Navigate to dashboard
# Open Performance tab
# Record page load
# Verify FPS stays above 55
```

### 2. Analysis Results Animation
**Test**: Analysis detail page with staggered card entrance

**Expected**:
- Cards fade in with stagger effect
- SMC components animate internal items
- No layout shifts during animation
- Smooth scroll behavior

**How to Test**:
```bash
# Navigate to analysis detail page
# Monitor FPS during page load
# Scroll to trigger lazy animations
# Verify smooth transitions
```

### 3. Scroll Animations
**Test**: Long pages with scroll-triggered animations

**Expected**:
- Elements animate in when entering viewport
- No performance degradation during scroll
- Smooth parallax effects if implemented
- IntersectionObserver working efficiently

**How to Test**:
```bash
# Navigate to page with scroll animations
# Record during scrolling
# Check for smooth FPS
# Verify no memory leaks
```

### 4. Status Animations
**Test**: Success/error/loading animations

**Expected**:
- Checkmark bounce is smooth
- Error shake has proper timing
- Loading spinner rotates at 60fps
- No CPU spikes during animation

**How to Test**:
```bash
# Trigger success/error states
# Monitor animation performance
# Verify spring physics feel natural
# Check for proper cleanup
```

## Performance Optimization Techniques

### 1. GPU Acceleration
```tsx
// Force GPU acceleration
<motion.div
  style={{
    transform: 'translateZ(0)',
    willChange: 'transform',
  }}
  animate={{ x: 100 }}
/>
```

### 2. Reduce Motion Support
```tsx
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{
    duration: shouldReduceMotion ? 0 : 0.5,
  }}
/>
```

### 3. Animation Variants
```tsx
// Good: Reusable variants
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Bad: Inline object creation
<motion.div animate={{ opacity: 1 }} /> // Creates new object every render
```

### 4. Lazy Loading
```tsx
// Lazy load heavy animation components
const HeavyAnimation = lazy(() => import('./HeavyAnimation'));

<Suspense fallback={<Shimmer />}>
  <HeavyAnimation />
</Suspense>
```

## Common Performance Issues

### Issue 1: Janky Animations
**Symptoms**: Choppy, stuttering animations
**Causes**:
- Animating non-GPU properties
- Too many simultaneous animations
- Heavy JavaScript execution during animation

**Solutions**:
```tsx
// Bad
<motion.div animate={{ width: 100, height: 100 }} />

// Good
<motion.div animate={{ scale: 1.5 }} />
```

### Issue 2: Layout Thrashing
**Symptoms**: Slow animations, layout recalculations
**Causes**:
- Reading layout properties during animation
- Causing reflows/repaints

**Solutions**:
```tsx
// Use transform instead of position
<motion.div
  animate={{
    x: 100  // Uses transform
  }}
/>
```

### Issue 3: Memory Leaks
**Symptoms**: Increasing memory usage, slow page over time
**Causes**:
- Not cleaning up event listeners
- Uncontrolled animations

**Solutions**:
```tsx
useEffect(() => {
  const animation = controls.start({ x: 100 });

  return () => {
    animation.stop(); // Cleanup
  };
}, [controls]);
```

## Mobile Testing

### Device Testing Matrix
- **iPhone 12+** (iOS 16+): Target 60fps
- **Android 12+**: Target 55-60fps
- **Older devices**: Target 30fps minimum

### Mobile-Specific Checks
1. **Touch Performance**
   - Tap animations respond instantly
   - No lag during gesture animations
   - Smooth swipe interactions

2. **Battery Impact**
   - Animations don't drain battery excessively
   - No continuous animations when idle
   - Proper pause/resume behavior

3. **Network Conditions**
   - Animations work on slow 3G
   - No blocking during asset loading
   - Progressive enhancement

## Automated Testing

### Performance Budget
```json
{
  "performanceBudget": {
    "FCP": 1500,
    "LCP": 2500,
    "TBT": 200,
    "CLS": 0.1,
    "FPS": 55
  }
}
```

### CI/CD Integration
```bash
# Run Lighthouse in CI
npm run lighthouse -- --budget-path=budget.json

# Performance regression testing
npm run test:perf
```

## Results Documentation

### Template
```markdown
## Animation Performance Test Results

**Date**: YYYY-MM-DD
**Tester**: Name
**Device**: Device Name
**Browser**: Chrome/Safari/Firefox Version

### Test Results
| Scenario | FPS | Pass/Fail | Notes |
|----------|-----|-----------|-------|
| Dashboard Stats | 60 | ✅ Pass | Smooth |
| Analysis Cards | 58 | ✅ Pass | Minor jank on old devices |
| Scroll Animation | 60 | ✅ Pass | Perfect |
| Status Indicators | 60 | ✅ Pass | Smooth |

### Issues Found
1. None

### Recommendations
1. Monitor performance on older devices
2. Consider reducing particle count on mobile
```

## Continuous Monitoring

### Tools to Set Up
1. **Sentry Performance Monitoring**
2. **Web Vitals Tracking**
3. **Real User Monitoring (RUM)**
4. **Custom Performance Marks**

### Metrics to Track
- Animation FPS
- Time to Interactive (TTI)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Long Tasks (> 50ms)

## Conclusion

Regular performance testing ensures animations remain smooth across all devices and browsers. Follow this guide for comprehensive testing and optimization of all animation features in NativeFlows.

**Target Achievement**: All animations should run at 55-60fps on modern devices (2020+) and maintain 30fps minimum on older devices.
