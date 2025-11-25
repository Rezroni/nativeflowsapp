'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { memo, useMemo } from 'react';

// Memoized navigation item component for better performance
const NavItem = memo(function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
  isCenter = false,
}: {
  href: string;
  label: string;
  icon: any;
  isActive: boolean;
  isCenter?: boolean;
}) {
  if (isCenter) {
    return (
      <Link
        href={href}
        className="flex flex-col items-center justify-center gap-1 relative -mt-6"
        prefetch={true}
      >
        {/* Elevated circular button - Optimized */}
        <div
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200',
            'shadow-xl shadow-primary/30 gpu-accelerated',
            isActive
              ? 'bg-primary text-primary-foreground scale-110'
              : 'bg-gradient-to-br from-primary/90 to-primary text-primary-foreground hover:scale-105'
          )}
          style={{ willChange: isActive ? 'auto' : 'transform' }}
        >
          <Icon className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
        </div>

        <span
          className={cn(
            'text-xs mt-1 transition-colors duration-200',
            isActive ? 'text-primary font-semibold' : 'text-muted-foreground font-medium'
          )}
        >
          {label}
        </span>

        {/* Glow effect for active state - Optimized */}
        {isActive && (
          <div
            className="absolute top-0 w-16 h-16 bg-primary/30 rounded-full blur-2xl -z-10 pointer-events-none"
            aria-hidden="true"
          />
        )}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center gap-1.5 min-w-[70px] py-2 px-3 rounded-2xl transition-all duration-200 relative',
        isActive ? 'text-primary scale-105' : 'text-muted-foreground hover:text-foreground'
      )}
      prefetch={true}
    >
      {/* Active indicator - Simplified */}
      {isActive && (
        <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full" aria-hidden="true" />
      )}

      <Icon
        className={cn('transition-all duration-200', isActive ? 'h-6 w-6' : 'h-5 w-5')}
        strokeWidth={isActive ? 2.5 : 2}
        aria-hidden="true"
      />

      <span
        className={cn(
          'text-xs transition-all duration-200',
          isActive ? 'font-semibold' : 'font-medium'
        )}
      >
        {label}
      </span>
    </Link>
  );
});

export const MobileBottomNav = memo(function MobileBottomNav() {
  const pathname = usePathname();

  // Memoize navigation items configuration
  const navItems = useMemo(
    () => [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        isCenter: false,
      },
      {
        href: '/analyze',
        label: 'Analyze',
        icon: TrendingUp,
        isCenter: true,
      },
      {
        href: '/history',
        label: 'History',
        icon: History,
        isCenter: false,
      },
    ],
    []
  );

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {/* Glass morphism background with curved top - Optimized for performance */}
      <div className="relative">
        <div className="glass-card-elevated border-t-2 border-white/10 rounded-t-3xl">
          <div className="flex items-end justify-around px-6 py-4 relative">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href}
                isCenter={item.isCenter}
              />
            ))}
          </div>
        </div>

        {/* iOS Home Indicator Space */}
        <div className="h-safe-bottom bg-background/95 backdrop-blur-xl" />
      </div>
    </nav>
  );
});
