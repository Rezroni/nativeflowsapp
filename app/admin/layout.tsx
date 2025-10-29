import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: adminRole, error } = await supabase
    .from('admin_roles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // If no admin role found, redirect to dashboard
  // Note: In development, you may want to temporarily bypass this check
  // or add your user to admin_roles table using the migration SQL
  if (!adminRole || error) {
    // For development: Check if in dev mode and allow specific email
    const isDev = process.env.NODE_ENV === 'development'
    const isDevAdmin = isDev && user.email === 'mido304@mail.ru'

    if (!isDevAdmin) {
      redirect('/dashboard')
    }

    // If dev admin, use a default role
    const devRole = {
      id: 'dev-temp',
      user_id: user.id,
      role: 'super_admin' as const,
      permissions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar role={devRole.role} />
        <div className="flex-1 flex flex-col">
          <AdminHeader user={user} role={devRole.role} />
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                <strong>Development Mode:</strong> You're accessing the admin panel in development mode.
                To enable full admin access, run the migration SQL to add your user to the admin_roles table.
              </p>
            </div>
            {children}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar role={adminRole.role} />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={user} role={adminRole.role} />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
