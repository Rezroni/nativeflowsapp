import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserX, Mail } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { UserSubscriptionManager } from '@/components/admin/user-subscription-manager'
import { ChangeUserPasswordDialog } from '@/components/admin/change-user-password-dialog'
import { AssignRoleDialog } from '@/components/admin/assign-role-dialog'
import { CreateUserDialog } from '@/components/admin/create-user-dialog'
import { getAdminRole } from '@/actions/admin'

export const metadata = {
  title: 'Users | Admin',
  description: 'Manage users'
}

export default async function UsersPage() {
  const supabase = await createClient()

  // Get admin role to check if super admin
  const adminRole = await getAdminRole()
  const isSuperAdmin = adminRole?.role === 'super_admin'

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*, subscriptions(*), admin_roles(*)')
    .order('created_at', { ascending: false })

  // Helper function to get user's active subscription plan
  const getUserPlan = (profile: any) => {
    const activeSubscription = profile.subscriptions?.find((s: any) => s.status === 'active')
    if (activeSubscription) {
      return activeSubscription.plan_type // Returns 'weekly', 'monthly', or 'annual'
    }
    return 'free'
  }

  const totalUsers = profiles?.length || 0
  const activeUsers = profiles?.filter(p => p.subscriptions?.some((s: any) => s.status === 'active'))?.length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Users</h1>
          <p className="text-muted-foreground">
            Manage and monitor all users on your platform
          </p>
        </div>
        {isSuperAdmin && <CreateUserDialog />}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers - activeUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {!profiles || profiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{profile.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {profile.full_name || 'No name set'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right mr-4">
                      <div className="font-medium capitalize">
                        {getUserPlan(profile)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {profile.admin_roles?.length > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mr-2">
                            {profile.admin_roles[0].role.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <UserSubscriptionManager
                        userId={profile.id}
                        userEmail={profile.email}
                        currentTier={getUserPlan(profile)}
                      />
                      {isSuperAdmin && (
                        <div className="flex gap-2">
                          <ChangeUserPasswordDialog
                            userId={profile.id}
                            userEmail={profile.email}
                          />
                          <AssignRoleDialog
                            userId={profile.id}
                            userEmail={profile.email}
                            currentRole={profile.admin_roles?.[0]?.role || null}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
