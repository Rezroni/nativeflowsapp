'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { memo, useMemo } from 'react';

// Pixel-perfect navigation item component
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
        className="flex flex-col items-center justify-center relative"
        prefetch={true}
        style={{ width: '80px' }}
      >
        {/* Elevated circular button - Pixel perfect */}
        <div
          className={cn(
            'flex items-center justify-center rounded-full transition-all duration-300 ease-out',
            'shadow-2xl relative',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'bg-gradient-to-br from-primary/95 to-primary/85 text-primary-foreground'
          )}
          style={{
            width: '64px',
            height: '64px',
            marginTop: '-32px',
            boxShadow: isActive
              ? '0 8px 32px rgba(234, 75, 113, 0.4), 0 4px 16px rgba(234, 75, 113, 0.3)'
              : '0 8px 24px rgba(234, 75, 113, 0.3), 0 4px 12px rgba(234, 75, 113, 0.2)',
          }}
        >
          <Icon
            className="w-7 h-7"
            strokeWidth={2.5}
            aria-hidden="true"
          />

          {/* Inner glow for active state */}
          {isActive && (
            <div
              className="absolute inset-0 rounded-full animate-pulse pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              }}
            />
          )}
        </div>

        {/* Label with better typography */}
        <span
          className={cn(
            'text-xs font-medium transition-colors duration-200 mt-2',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )}
          style={{
            fontSize: '11px',
            lineHeight: '16px',
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center relative transition-all duration-200"
      prefetch={true}
      style={{ width: '80px', padding: '12px 0' }}
    >
      {/* Icon container with perfect alignment */}
      <div className="relative flex items-center justify-center" style={{ height: '28px' }}>
        <Icon
          className={cn('transition-all duration-200')}
          style={{
            width: isActive ? '26px' : '24px',
            height: isActive ? '26px' : '24px',
          }}
          strokeWidth={isActive ? 2.5 : 2}
          aria-hidden="true"
        />

        {/* Active indicator - refined */}
        {isActive && (
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2"
            style={{
              width: '4px',
              height: '4px',
              backgroundColor: 'hsl(346 83% 61%)',
              borderRadius: '2px',
            }}
          />
        )}
      </div>

      {/* Label with perfect spacing */}
      <span
        className={cn(
          'font-medium transition-colors duration-200',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
        style={{
          fontSize: '11px',
          lineHeight: '16px',
          marginTop: '6px',
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </span>
    </Link>
  );
});

export const MobileBottomNav = memo(function MobileBottomNav() {
  const pathname = usePathname();

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
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="Mobile navigation"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Main navigation container - Pixel perfect */}
      <div
        className="relative backdrop-blur-xl border-t"
        style={{
          backgroundColor: 'rgba(10, 10, 26, 0.92)',
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          borderTopWidth: '1px',
        }}
      >
        {/* Glass effect overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)',
          }}
        />

        {/* Navigation items container */}
        <div
          className="relative flex items-end justify-around"
          style={{
            height: '72px',
            maxWidth: '480px',
            margin: '0 auto',
            padding: '0 16px',
          }}
        >
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

      {/* iOS Home Indicator - Proper spacing */}
      <div
        style={{
          height: 'env(safe-area-inset-bottom)',
          backgroundColor: 'rgba(10, 10, 26, 0.95)',
        }}
      />
    </nav>
  );
});
