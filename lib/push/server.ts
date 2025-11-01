// Server-side push notification utilities
import webpush from 'web-push';
import { createClient } from '@/lib/supabase/server';
import {
  NotificationType,
  NotificationPayload,
  NOTIFICATION_TEMPLATES,
} from './types';

// Configure web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:support@nativeflows.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

// Send push notification to a specific user
export async function sendPushNotification(
  userId: string,
  type: NotificationType,
  customData?: any
): Promise<{ success: number; failed: number }> {
  try {
    const supabase = await createClient();

    // Get user's push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (subError) {
      console.error('Error fetching subscriptions:', subError);
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`No push subscriptions found for user ${userId}`);
      return { success: 0, failed: 0 };
    }

    // Check user's notification preferences
    const { data: profile } = await supabase
      .from('profiles')
      .select('notification_preferences')
      .eq('id', userId)
      .single();

    const preferences = profile?.notification_preferences || {};

    // Check if push is enabled and this notification type is enabled
    if (!preferences.push_enabled || preferences[type] === false) {
      console.log(`Notifications disabled for user ${userId}, type ${type}`);
      return { success: 0, failed: 0 };
    }

    // Get notification template
    const template = NOTIFICATION_TEMPLATES[type];
    const title = template.getTitle(customData);
    const body = template.getBody(customData);

    // Create notification payload
    const payload: NotificationPayload = {
      type,
      title,
      body,
      data: {
        icon: template.icon,
        badge: '/icons/icon-96x96.png',
        requireInteraction: template.requireInteraction,
        url: customData?.url || '/',
        tag: type,
        data: customData,
      },
    };

    // Send to all user's subscriptions
    let successCount = 0;
    let failedCount = 0;

    await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          };

          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(payload)
          );

          successCount++;
        } catch (error: any) {
          console.error('Error sending push notification:', error);
          failedCount++;

          // Remove invalid subscriptions (410 = gone, 404 = not found)
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log('Removing invalid subscription:', subscription.id);
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('id', subscription.id);
          }
        }
      })
    );

    // Save to notification history
    await supabase.from('notification_history').insert({
      user_id: userId,
      type,
      title,
      body,
      data: customData,
    });

    return { success: successCount, failed: failedCount };
  } catch (error) {
    console.error('Error in sendPushNotification:', error);
    throw error;
  }
}

// Send push notification to multiple users
export async function sendPushNotificationBulk(
  userIds: string[],
  type: NotificationType,
  customData?: any
): Promise<{ totalSuccess: number; totalFailed: number }> {
  let totalSuccess = 0;
  let totalFailed = 0;

  await Promise.all(
    userIds.map(async (userId) => {
      try {
        const result = await sendPushNotification(userId, type, customData);
        totalSuccess += result.success;
        totalFailed += result.failed;
      } catch (error) {
        console.error(`Error sending notification to user ${userId}:`, error);
        totalFailed++;
      }
    })
  );

  return { totalSuccess, totalFailed };
}

// Helper: Send analysis complete notification
export async function notifyAnalysisComplete(
  userId: string,
  analysisId: string,
  chartName?: string
): Promise<void> {
  await sendPushNotification(userId, 'analysis_complete', {
    chartName,
    url: `/analysis/${analysisId}`,
  });
}

// Helper: Send subscription expiring notification
export async function notifySubscriptionExpiring(
  userId: string,
  daysLeft: number,
  planName: string
): Promise<void> {
  await sendPushNotification(userId, 'subscription_expiring', {
    daysLeft,
    planName,
    url: '/pricing',
  });
}

// Helper: Send usage warning notification
export async function notifyUsageWarning(
  userId: string,
  remaining: number
): Promise<void> {
  await sendPushNotification(userId, 'usage_warning', {
    remaining,
    url: '/pricing',
  });
}

// Helper: Send new feature notification
export async function notifyNewFeature(
  featureName: string,
  description: string,
  targetUrl?: string
): Promise<void> {
  const supabase = await createClient();

  // Get all users with push enabled
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, notification_preferences')
    .not('notification_preferences->>push_enabled', 'is', 'false')
    .not('notification_preferences->>new_feature', 'is', 'false');

  if (!profiles) return;

  const userIds = profiles.map((p) => p.id);

  await sendPushNotificationBulk(userIds, 'new_feature', {
    featureName,
    description,
    url: targetUrl || '/',
  });
}

// Helper: Send daily tip (cron job)
export async function sendDailyTips(tip: string): Promise<void> {
  const supabase = await createClient();

  // Get all users with daily tips enabled
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, notification_preferences')
    .not('notification_preferences->>push_enabled', 'is', 'false')
    .eq('notification_preferences->>daily_tip', 'true');

  if (!profiles) return;

  const userIds = profiles.map((p) => p.id);

  await sendPushNotificationBulk(userIds, 'daily_tip', {
    tip,
    url: '/',
  });
}
