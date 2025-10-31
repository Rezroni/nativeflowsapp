'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { NotificationPreferences, DEFAULT_NOTIFICATION_PREFERENCES } from '@/lib/push/types';
import { PushNotificationToggle } from './push-permission-prompt';

export function NotificationPreferencesCard() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data?.notification_preferences) {
        setPreferences({
          ...DEFAULT_NOTIFICATION_PREFERENCES,
          ...data.notification_preferences,
        });
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      toast.error('Failed to load notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error('You must be logged in to save preferences');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: preferences })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Notification preferences saved successfully');
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error('Failed to save notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose which notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Push Notifications Toggle */}
        <div className="space-y-4">
          <PushNotificationToggle />
        </div>

        {/* Global Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Global Settings</h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push_enabled">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications in your browser
              </p>
            </div>
            <Switch
              id="push_enabled"
              checked={preferences.push_enabled}
              onCheckedChange={(checked) => updatePreference('push_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_enabled">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications
              </p>
            </div>
            <Switch
              id="email_enabled"
              checked={preferences.email_enabled}
              onCheckedChange={(checked) => updatePreference('email_enabled', checked)}
            />
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Notification Types</h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analysis_complete">Analysis Complete</Label>
              <p className="text-sm text-muted-foreground">
                When your chart analysis is ready
              </p>
            </div>
            <Switch
              id="analysis_complete"
              checked={preferences.analysis_complete}
              onCheckedChange={(checked) => updatePreference('analysis_complete', checked)}
              disabled={!preferences.push_enabled && !preferences.email_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="subscription_expiring">Subscription Expiring</Label>
              <p className="text-sm text-muted-foreground">
                Reminders before your subscription expires
              </p>
            </div>
            <Switch
              id="subscription_expiring"
              checked={preferences.subscription_expiring}
              onCheckedChange={(checked) => updatePreference('subscription_expiring', checked)}
              disabled={!preferences.push_enabled && !preferences.email_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new_feature">New Features</Label>
              <p className="text-sm text-muted-foreground">
                Announcements about new features and updates
              </p>
            </div>
            <Switch
              id="new_feature"
              checked={preferences.new_feature}
              onCheckedChange={(checked) => updatePreference('new_feature', checked)}
              disabled={!preferences.push_enabled && !preferences.email_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="usage_warning">Usage Warnings</Label>
              <p className="text-sm text-muted-foreground">
                Alerts when approaching usage limits
              </p>
            </div>
            <Switch
              id="usage_warning"
              checked={preferences.usage_warning}
              onCheckedChange={(checked) => updatePreference('usage_warning', checked)}
              disabled={!preferences.push_enabled && !preferences.email_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="daily_tip">Daily Trading Tips</Label>
              <p className="text-sm text-muted-foreground">
                Educational tips about Smart Money Concepts
              </p>
            </div>
            <Switch
              id="daily_tip"
              checked={preferences.daily_tip}
              onCheckedChange={(checked) => updatePreference('daily_tip', checked)}
              disabled={!preferences.push_enabled && !preferences.email_enabled}
            />
          </div>
        </div>

        <Button onClick={savePreferences} disabled={isSaving} className="w-full">
          {isSaving ? (
            'Saving...'
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
