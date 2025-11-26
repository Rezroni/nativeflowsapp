'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChartCandlestick,
  LayoutDashboard,
  Upload,
  History,
  Settings,
  User,
  LogOut,
  CreditCard,
} from 'lucide-react';
import { signOut } from '@/actions/auth';

// Lazy load heavy components for better initial load
const NotificationCenter = dynamic(
  () => import('@/components/notifications/notification-center').then(m => ({ default: m.NotificationCenter })),
  { ssr: false }
);
const LanguageSwitcher = dynamic(
  () => import('@/components/i18n/language-switcher').then(m => ({ default: m.LanguageSwitcher })),
  { ssr: false }
);

export function AppNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/analyze',
      label: 'Analyze',
      icon: Upload,
    },
    {
      href: '/history',
      label: 'History',
      icon: History,
    },
    {
      href: '/pricing',
      label: 'Pricing',
      icon: CreditCard,
    },
  ];

  const isActive = (href: string) => pathname === href;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset-top">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <ChartCandlestick className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold gradient-text">Nativeflows</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          {/* Notification Center */}
          <NotificationCenter />

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex items-center justify-center relative h-10 w-10 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-primary/10 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ripple focus-ring-enhanced cursor-pointer"
                aria-label="User menu"
                type="button"
              >
                <User className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 glass-card-elevated animate-scale-in"
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center cursor-pointer w-full focus:bg-primary/10 transition-colors">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pricing" className="flex items-center cursor-pointer w-full focus:bg-primary/10 transition-colors">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Pricing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button - Only Settings & Notifications */}
        <div className="flex items-center gap-2 md:hidden">
          <NotificationCenter />

          {/* Mobile User/Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex items-center justify-center relative h-10 w-10 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-primary/10 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ripple focus-ring-enhanced cursor-pointer"
                aria-label="User menu"
                type="button"
              >
                <User className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 glass-card-elevated animate-scale-in"
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center cursor-pointer w-full focus:bg-primary/10 transition-colors">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pricing" className="flex items-center cursor-pointer w-full focus:bg-primary/10 transition-colors">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Pricing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
