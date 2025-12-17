import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Settings, Mail, Bell, Shield, Database } from 'lucide-react'
import { DatabaseManagement } from '@/components/admin/database-management'

export const metadata = {
  title: 'Settings | Admin',
  description: 'Admin settings and configuration'
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your platform settings and configuration
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>General Settings</CardTitle>
          </div>
          <CardDescription>Basic platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input id="site-name" defaultValue="Nativeflows" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea
              id="site-description"
              defaultValue="AI-powered trading chart analysis with Smart Money Concepts"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-email">Support Email</Label>
            <Input id="support-email" type="email" defaultValue="support@nativeflows.com" />
          </div>

          <Button>Save General Settings</Button>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Email Settings</CardTitle>
          </div>
          <CardDescription>Configure email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="smtp-host">SMTP Host</Label>
            <Input id="smtp-host" placeholder="smtp.example.com" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" type="number" defaultValue="587" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp-username">SMTP Username</Label>
              <Input id="smtp-username" type="email" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp-password">SMTP Password</Label>
            <Input id="smtp-password" type="password" />
          </div>

          <Button>Save Email Settings</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
          <CardDescription>Configure system notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">New User Registration</div>
              <div className="text-sm text-muted-foreground">
                Receive email when new users sign up
              </div>
            </div>
            <input type="checkbox" className="h-4 w-4" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">New Subscription</div>
              <div className="text-sm text-muted-foreground">
                Receive email when users subscribe
              </div>
            </div>
            <input type="checkbox" className="h-4 w-4" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Subscription Cancellation</div>
              <div className="text-sm text-muted-foreground">
                Receive email when subscriptions are canceled
              </div>
            </div>
            <input type="checkbox" className="h-4 w-4" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">System Errors</div>
              <div className="text-sm text-muted-foreground">
                Receive email for critical system errors
              </div>
            </div>
            <input type="checkbox" className="h-4 w-4" defaultChecked />
          </div>

          <Button>Save Notification Settings</Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security Settings</CardTitle>
          </div>
          <CardDescription>Manage security and access control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Require Email Verification</div>
              <div className="text-sm text-muted-foreground">
                Users must verify email before accessing features
              </div>
            </div>
            <input type="checkbox" className="h-4 w-4" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">
                Enable 2FA for admin accounts
              </div>
            </div>
            <input type="checkbox" className="h-4 w-4" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Input id="session-timeout" type="number" defaultValue="60" />
          </div>

          <Button>Save Security Settings</Button>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>Database Management</CardTitle>
          </div>
          <CardDescription>Database maintenance and backups</CardDescription>
        </CardHeader>
        <CardContent>
          <DatabaseManagement />
        </CardContent>
      </Card>
    </div>
  )
}
