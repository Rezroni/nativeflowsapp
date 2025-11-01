'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { assignUserRole, removeUserRole } from '@/actions/admin';
import { toast } from 'sonner';
import { Shield, Loader2 } from 'lucide-react';

interface AssignRoleDialogProps {
  userId: string;
  userEmail: string;
  currentRole?: string | null;
}

export function AssignRoleDialog({
  userId,
  userEmail,
  currentRole,
}: AssignRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    'super_admin' | 'admin' | 'editor' | 'none'
  >(currentRole ? (currentRole as any) : 'none');
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssignRole = async () => {
    setIsAssigning(true);

    try {
      if (selectedRole === 'none') {
        // Remove role
        const result = await removeUserRole(userId);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.message || 'Role removed successfully');
          setOpen(false);
        }
      } else {
        // Assign role
        const result = await assignUserRole(userId, selectedRole);

        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.message || 'Role assigned successfully');
          setOpen(false);
        }
      }
    } catch (error) {
      console.error('Error managing role:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Shield className="h-4 w-4 mr-2" />
          Manage Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage User Role</DialogTitle>
          <DialogDescription>
            Assign or remove admin role for {userEmail}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Role</label>
            <div className="p-3 rounded-lg bg-muted">
              <span className="font-medium capitalize">
                {currentRole || 'No admin role (Regular User)'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Role</label>
            <Select
              value={selectedRole}
              onValueChange={(value) =>
                setSelectedRole(value as typeof selectedRole)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">No Role</span>
                    <span className="text-xs text-muted-foreground">
                      Regular user with no admin access
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="editor">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Editor</span>
                    <span className="text-xs text-muted-foreground">
                      Can manage blog posts and view dashboard
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Admin</span>
                    <span className="text-xs text-muted-foreground">
                      Can manage users, subscriptions, and analytics
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="super_admin">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Super Admin</span>
                    <span className="text-xs text-muted-foreground">
                      Full access including role management
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole !== currentRole && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-600 dark:text-yellow-500">
                ⚠️{' '}
                {selectedRole === 'none'
                  ? 'This will remove all admin privileges from this user.'
                  : `This will grant ${selectedRole.replace('_', ' ')} privileges to this user.`}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignRole}
            disabled={isAssigning || selectedRole === currentRole}
          >
            {isAssigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Role'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
