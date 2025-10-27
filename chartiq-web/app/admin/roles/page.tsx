import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const metadata = {
  title: 'Admin Roles | Admin',
  description: 'Manage admin roles'
}

export default async function AdminRolesPage() {
  const supabase = await createClient()

  const { data: adminRoles } = await supabase
    .from('admin_roles')
    .select('*, profiles(email, full_name)')
    .order('created_at', { ascending: false })

  const superAdmins = adminRoles?.filter(r => r.role === 'super_admin')?.length || 0
  const admins = adminRoles?.filter(r => r.role === 'admin')?.length || 0
  const editors = adminRoles?.filter(r => r.role === 'editor')?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Admin Roles</h1>
        <p className="text-muted-foreground">
          Manage admin users and their permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{superAdmins}</div>
            <p className="text-xs text-muted-foreground mt-1">Full access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins}</div>
            <p className="text-xs text-muted-foreground mt-1">Limited access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Editors</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{editors}</div>
            <p className="text-xs text-muted-foreground mt-1">Content only</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Roles List */}
      <Card>
        <CardHeader>
          <CardTitle>All Admin Users</CardTitle>
          <CardDescription>Users with administrative access</CardDescription>
        </CardHeader>
        <CardContent>
          {!adminRoles || adminRoles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No admin roles configured yet</p>
              <p className="text-sm">
                Run the migration SQL to add admin roles to users
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {adminRoles.map((adminRole) => (
                <div
                  key={adminRole.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {adminRole.role === 'super_admin' && <ShieldCheck className="h-5 w-5 text-primary" />}
                      {adminRole.role === 'admin' && <Shield className="h-5 w-5 text-primary" />}
                      {adminRole.role === 'editor' && <ShieldAlert className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <div className="font-medium">
                        {adminRole.profiles?.email || 'Unknown user'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {adminRole.profiles?.full_name || 'No name set'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                          adminRole.role === 'super_admin'
                            ? 'bg-red-500/10 text-red-500'
                            : adminRole.role === 'admin'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-green-500/10 text-green-500'
                        }`}
                      >
                        {adminRole.role.replace('_', ' ')}
                      </span>
                      <div className="text-sm text-muted-foreground mt-1">
                        Added {formatDistanceToNow(new Date(adminRole.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Understanding admin role capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-red-500">Super Admin</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Full access to all features including user management, role management, system settings,
                content management, and analytics.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-blue-500">Admin</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Access to user management, content management, and analytics. Cannot modify admin roles
                or system settings.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold text-green-500">Editor</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Limited access to content management only. Can create, edit, and publish blog posts
                but cannot access user data or settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
