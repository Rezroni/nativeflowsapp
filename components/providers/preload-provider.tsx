'use client';

import { useEffect } from 'react';
import { initializePreloading } from '@/lib/preload/resources';

/**
 * Preload Provider Component
 *
 * Initializes React 19 resource preloading on client mount.
 * This provider should be placed high in the component tree (in root layout).
 */
export function PreloadProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize preloading strategies once on mount
    initializePreloading();
  }, []);

  return <>{children}</>;
}
