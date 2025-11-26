'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mixpanelLoaded, setMixpanelLoaded] = useState(false);

  // Defer Mixpanel initialization until after page is interactive
  useEffect(() => {
    // Wait for page to be fully loaded, then load analytics
    const loadAnalytics = async () => {
      // Defer loading by 2 seconds to prioritize FCP/LCP
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { initMixpanel } = await import('@/lib/analytics/mixpanel');
      initMixpanel();
      setMixpanelLoaded(true);
    };

    if (typeof window !== 'undefined' && document.readyState === 'complete') {
      loadAnalytics();
    } else {
      window.addEventListener('load', loadAnalytics);
      return () => window.removeEventListener('load', loadAnalytics);
    }
  }, []);

  // Track page views on route change (only after Mixpanel is loaded)
  useEffect(() => {
    if (pathname && mixpanelLoaded) {
      import('@/lib/analytics/mixpanel').then(({ trackPageView }) => {
        trackPageView(pathname);
      });
    }
  }, [pathname, mixpanelLoaded]);

  return <>{children}</>;
}
