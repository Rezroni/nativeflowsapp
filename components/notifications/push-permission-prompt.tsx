'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  isPushSupported,
  areNotificationsEnabled,
  enablePushNotifications,
  getPermissionStatus,
} from '@/lib/push/client';

interface PushPermissionPromptProps {
  onDismiss?: () => void;
  autoShow?: boolean;
  delay?: number; // Delay before showing (ms)
}

export function PushPermissionPrompt({
  onDismiss,
  autoShow = true,
  delay = 5000,
}: PushPermissionPromptProps) {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if push is supported
    const supported = isPushSupported();
    setIsSupported(supported);

    if (!supported) return;

    // Check current permission status
    const status = getPermissionStatus();
    setPermissionStatus(status);

    // Only show if permission is default and notifications are not enabled
    if (status === 'default' && !areNotificationsEnabled() && autoShow) {
      // Show after delay
      const timer = setTimeout(() => {
        setShow(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, delay]);

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      const success = await enablePushNotifications();
      if (success) {
        setShow(false);
        onDismiss?.();
      } else {
        setShow(false);
        onDismiss?.();
        alert('Push notifications require configuration. Please contact support or try again later.');
      }
    } catch (error: any) {
      console.error('Error enabling push notifications:', error);
      setShow(false);
      onDismiss?.();
      const errorMessage = error?.message || 'An error occurred';
      alert(`Push notifications are not available: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    onDismiss?.();
    // Remember that user dismissed (can be stored in localStorage)
    localStorage.setItem('push_notification_prompt_dismissed', 'true');
  };

  // Don't render if not supported or not showing
  if (!isSupported || !show || permissionStatus !== 'default') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <Card className="shadow-lg border-2">
        <CardHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Enable Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <CardDescription className="text-sm">
            Get notified when your analysis completes, subscription updates, and important alerts.
          </CardDescription>
          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>Analysis completion alerts</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>Subscription & usage reminders</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>Important updates & new features</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2 pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="flex-1"
          >
            Maybe Later
          </Button>
          <Button
            size="sm"
            onClick={handleEnable}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>Enabling...</>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Enable
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Compact version for settings/dashboard
export function PushNotificationToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isPushSupported());
    setIsEnabled(areNotificationsEnabled());
  }, []);

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isEnabled) {
        // Disable notifications
        const { disablePushNotifications } = await import('@/lib/push/client');
        await disablePushNotifications();
        setIsEnabled(false);
      } else {
        // Enable notifications
        const success = await enablePushNotifications();
        if (success) {
          setIsEnabled(true);
        }
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BellOff className="h-4 w-4" />
        <span>Push notifications not supported in this browser</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isEnabled ? (
          <Bell className="h-4 w-4 text-primary" />
        ) : (
          <BellOff className="h-4 w-4 text-muted-foreground" />
        )}
        <div>
          <p className="text-sm font-medium">
            Push Notifications
          </p>
          <p className="text-xs text-muted-foreground">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </p>
        </div>
      </div>
      <Button
        variant={isEnabled ? 'outline' : 'default'}
        size="sm"
        onClick={handleToggle}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : isEnabled ? 'Disable' : 'Enable'}
      </Button>
    </div>
  );
}
