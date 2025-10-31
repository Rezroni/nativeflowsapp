// Push notification types and interfaces

export type NotificationType =
  | 'analysis_complete'
  | 'subscription_expiring'
  | 'new_feature'
  | 'daily_tip'
  | 'usage_warning';

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  device_name?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationData {
  url?: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
  data?: Record<string, any>;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: NotificationData;
}

export interface NotificationHistory {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  sent_at: string;
  read_at?: string;
  clicked_at?: string;
}

export interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  analysis_complete: boolean;
  subscription_expiring: boolean;
  new_feature: boolean;
  daily_tip: boolean;
  usage_warning: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  push_enabled: true,
  email_enabled: true,
  analysis_complete: true,
  subscription_expiring: true,
  new_feature: true,
  daily_tip: false,
  usage_warning: true,
};

// Predefined notification templates
export const NOTIFICATION_TEMPLATES: Record<
  NotificationType,
  {
    getTitle: (data?: any) => string;
    getBody: (data?: any) => string;
    icon: string;
    requireInteraction?: boolean;
  }
> = {
  analysis_complete: {
    getTitle: () => '🎉 Analysis Complete!',
    getBody: (data) =>
      data?.chartName
        ? `Your analysis for "${data.chartName}" is ready to view.`
        : 'Your chart analysis is complete and ready to view.',
    icon: '/icons/icon-192x192.png',
    requireInteraction: false,
  },
  subscription_expiring: {
    getTitle: (data) =>
      data?.daysLeft
        ? `⏰ ${data.daysLeft} Days Until Subscription Expires`
        : '⏰ Subscription Expiring Soon',
    getBody: (data) =>
      data?.planName
        ? `Your ${data.planName} subscription expires soon. Renew to continue unlimited analysis.`
        : 'Your subscription is expiring soon. Renew to keep access to all features.',
    icon: '/icons/icon-192x192.png',
    requireInteraction: true,
  },
  new_feature: {
    getTitle: () => '✨ New Feature Available!',
    getBody: (data) =>
      data?.featureName
        ? `Check out our new feature: ${data.featureName}`
        : 'We just released a new feature. Come check it out!',
    icon: '/icons/icon-192x192.png',
    requireInteraction: false,
  },
  daily_tip: {
    getTitle: () => '💡 Daily Trading Tip',
    getBody: (data) =>
      data?.tip ||
      'Learn something new about Smart Money Concepts today.',
    icon: '/icons/icon-192x192.png',
    requireInteraction: false,
  },
  usage_warning: {
    getTitle: (data) =>
      data?.remaining
        ? `⚠️ ${data.remaining} Analyses Remaining`
        : '⚠️ Usage Limit Warning',
    getBody: (data) =>
      data?.remaining
        ? `You have ${data.remaining} analyses left this month. Upgrade for unlimited access.`
        : 'You are approaching your monthly usage limit. Consider upgrading your plan.',
    icon: '/icons/icon-192x192.png',
    requireInteraction: true,
  },
};
