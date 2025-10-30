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
    .maybeSingle()

  // If no admin role found, redirect to dashboard
  if (!adminRole) {
    console.log('Admin access denied for user:', user.email, 'Error:', error?.message)
    redirect('/dashboard')
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
