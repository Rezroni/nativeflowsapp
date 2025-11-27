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
        className="flex flex-col items-center justify-center relative z-10"
        prefetch={true}
        style={{ width: '88px', marginTop: '-8px' }}
      >
        {/* Professional elevated button with seamless notch cutout */}
        <div className="relative">
          {/* Extended background cutout shape - Seamless integration */}
          <div
            className="absolute left-1/2 -translate-x-1/2 backdrop-blur-xl"
            style={{
              width: '96px',
              height: '52px',
              top: '-40px',
              backgroundColor: 'rgba(10, 10, 26, 0.92)',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          />

          {/* Main elevated button */}
          <div
            className={cn(
              'relative flex items-center justify-center rounded-2xl transition-all duration-300 ease-out z-[2]',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-primary/90 text-primary-foreground hover:bg-primary'
            )}
            style={{
              width: '72px',
              height: '72px',
              marginTop: '-36px',
              boxShadow: isActive
                ? '0 12px 40px rgba(234, 75, 113, 0.35), 0 6px 20px rgba(234, 75, 113, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 8px 32px rgba(234, 75, 113, 0.3), 0 4px 16px rgba(234, 75, 113, 0.2)',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <Icon
              className="w-8 h-8"
              strokeWidth={2.5}
              aria-hidden="true"
            />

            {/* Subtle gradient overlay */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
              }}
            />

            {/* Inner glow for active state */}
            {isActive && (
              <div
                className="absolute inset-0 rounded-2xl animate-pulse pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)',
                }}
              />
            )}
          </div>
        </div>

        {/* Label with perfect spacing */}
        <span
          className={cn(
            'font-semibold transition-colors duration-200',
            isActive ? 'text-primary' : 'text-foreground/80'
          )}
          style={{
            fontSize: '11px',
            lineHeight: '16px',
            marginTop: '8px',
            letterSpacing: '0.02em',
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
      style={{ width: '80px', padding: '16px 0 12px' }}
    >
      {/* Icon container with perfect alignment */}
      <div className="relative flex items-center justify-center" style={{ height: '32px' }}>
        <Icon
          className={cn('transition-all duration-200')}
          style={{
            width: isActive ? '28px' : '26px',
            height: isActive ? '28px' : '26px',
          }}
          strokeWidth={isActive ? 2.5 : 2}
          aria-hidden="true"
        />

        {/* Active indicator - refined dot above icon */}
        {isActive && (
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2"
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
          isActive ? 'text-primary' : 'text-foreground/60'
        )}
        style={{
          fontSize: '11px',
          lineHeight: '16px',
          marginTop: '4px',
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
        paddingTop: '40px', // Critical: Space for elevated button
      }}
    >
      {/* Main navigation container - Professional design with overflow support */}
      <div className="relative" style={{ overflow: 'visible' }}>
        {/* Backdrop with proper blur - Extended to include safe area */}
        <div
          className="absolute backdrop-blur-xl"
          style={{
            backgroundColor: 'rgba(10, 10, 26, 0.92)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            top: '0',
            left: '0',
            right: '0',
            bottom: 'calc(-1 * env(safe-area-inset-bottom))',
          }}
        />

        {/* Subtle top border glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(234, 75, 113, 0.15) 50%, transparent)',
          }}
        />

        {/* Navigation items container with overflow visible */}
        <div
          className="relative flex items-end justify-around"
          style={{
            height: '76px',
            maxWidth: '480px',
            margin: '0 auto',
            padding: '0 16px',
            paddingBottom: 'env(safe-area-inset-bottom)',
            overflow: 'visible', // Allow elevated button to extend beyond bounds
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
    </nav>
  );
});
