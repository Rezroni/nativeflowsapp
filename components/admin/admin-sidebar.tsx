'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  ShieldCheck,
  PenTool
} from 'lucide-react'

interface AdminSidebarProps {
  role: 'super_admin' | 'admin' | 'editor'
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    allowedRoles: ['super_admin', 'admin', 'editor']
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    allowedRoles: ['super_admin', 'admin']
  },
  {
    name: 'Blog Posts',
    href: '/admin/blog',
    icon: PenTool,
    allowedRoles: ['super_admin', 'admin', 'editor']
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    allowedRoles: ['super_admin', 'admin']
  },
  {
    name: 'Subscriptions',
    href: '/admin/subscriptions',
    icon: FileText,
    allowedRoles: ['super_admin', 'admin']
  },
  {
    name: 'Admin Roles',
    href: '/admin/roles',
    icon: ShieldCheck,
    allowedRoles: ['super_admin']
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    allowedRoles: ['super_admin']
  }
]

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname()

  const allowedNavigation = navigation.filter((item) =>
    item.allowedRoles.includes(role)
  )

  return (
    <aside className="w-64 border-r border-border bg-card">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">N</span>
          </div>
          <div>
            <div className="font-bold">Nativeflows</div>
            <div className="text-xs text-muted-foreground">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="px-4 space-y-1">
        {allowedNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          ← Back to App
        </Link>
      </div>
    </aside>
  )
}
