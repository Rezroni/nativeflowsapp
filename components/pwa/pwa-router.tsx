'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMobileDetect } from '@/hooks/use-mobile-detect';

interface PWARouterProps {
  isAuthenticated: boolean;
}

export function PWARouter({ isAuthenticated }: PWARouterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, isClient } = useMobileDetect();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isClient) return;

    // Check if running as PWA (standalone mode)
    const isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // Only redirect if it's a PWA on mobile and user is on home page
    if (isPWA && isMobile && pathname === '/' && !hasRedirected) {
      setHasRedirected(true);

      // Redirect immediately (PWA will handle splash screen)
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isClient, isMobile, pathname, isAuthenticated, router, hasRedirected]);

  return null;
}
