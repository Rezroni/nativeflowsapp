'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMobileDetect } from '@/hooks/use-mobile-detect';
import { SplashScreen } from './splash-screen';

interface PWARouterProps {
  isAuthenticated: boolean;
}

export function PWARouter({ isAuthenticated }: PWARouterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, isClient } = useMobileDetect();
  const [showSplash, setShowSplash] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isClient) return;

    // Check if running as PWA (standalone mode)
    const isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // Only show splash and redirect if it's a PWA on mobile and user is on home page
    if (isPWA && isMobile && pathname === '/' && !hasRedirected) {
      setShowSplash(true);
      setHasRedirected(true);

      // Wait for splash screen to show, then redirect
      setTimeout(() => {
        if (isAuthenticated) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      }, 2000);
    }
  }, [isClient, isMobile, pathname, isAuthenticated, router, hasRedirected]);

  if (!showSplash) return null;

  return <SplashScreen />;
}
