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
import { updateUserSubscriptionTier } from '@/actions/admin';
import { toast } from 'sonner';
import { Settings, Loader2 } from 'lucide-react';

interface UserSubscriptionManagerProps {
  userId: string;
  userEmail: string;
  currentTier: 'free' | 'pro';
}

export function UserSubscriptionManager({
  userId,
  userEmail,
  currentTier,
}: UserSubscriptionManagerProps) {
  const [open, setOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'free' | 'pro'>(currentTier);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (selectedTier === currentTier) {
      toast.info('No changes made');
      setOpen(false);
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateUserSubscriptionTier(userId, selectedTier);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.message || 'Subscription updated successfully');
        setOpen(false);
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage User Subscription</DialogTitle>
          <DialogDescription>
            Update subscription tier for {userEmail}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Tier</label>
            <div className="p-3 rounded-lg bg-muted">
              <span className="font-medium capitalize">{currentTier}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Tier</label>
            <Select
              value={selectedTier}
              onValueChange={(value) => setSelectedTier(value as 'free' | 'pro')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Free</span>
                    <span className="text-xs text-muted-foreground">
                      5 analyses/month
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="pro">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Pro</span>
                    <span className="text-xs text-muted-foreground">
                      Unlimited analyses
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedTier !== currentTier && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-600 dark:text-yellow-500">
                {selectedTier === 'pro'
                  ? '⚠️ This will grant the user unlimited analyses and premium AI models.'
                  : '⚠️ This will limit the user to 5 analyses per month with free AI models.'}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating || selectedTier === currentTier}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Subscription'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
