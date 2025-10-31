// Client-side push notification utilities
'use client';

import { NotificationPayload } from './types';

// Check if push notifications are supported
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

// Get current permission status
export function getPermissionStatus(): NotificationPermission {
  if (!isPushSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

// Check if notifications are enabled
export function areNotificationsEnabled(): boolean {
  return getPermissionStatus() === 'granted';
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
}

// Subscribe to push notifications
export async function subscribeToPush(): Promise<PushSubscription> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported');
  }

  try {
    // Register service worker if not already registered
    const registration = await navigator.serviceWorker.ready;

    // Get VAPID public key from environment
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      throw new Error('VAPID public key is not configured');
    }

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
    });

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const unsubscribed = await subscription.unsubscribe();
      return unsubscribed;
    }

    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    throw error;
  }
}

// Get current push subscription
export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error('Error getting push subscription:', error);
    return null;
  }
}

// Save subscription to database
export async function savePushSubscription(
  subscription: PushSubscription
): Promise<void> {
  try {
    const subJSON = subscription.toJSON();

    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: subJSON.endpoint,
        keys: subJSON.keys,
        userAgent: navigator.userAgent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save push subscription');
    }
  } catch (error) {
    console.error('Error saving push subscription:', error);
    throw error;
  }
}

// Delete subscription from database
export async function deletePushSubscription(): Promise<void> {
  try {
    const subscription = await getPushSubscription();
    if (!subscription) {
      return;
    }

    const response = await fetch('/api/push/subscribe', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete push subscription');
    }
  } catch (error) {
    console.error('Error deleting push subscription:', error);
    throw error;
  }
}

// Complete flow: Request permission, subscribe, and save
export async function enablePushNotifications(): Promise<boolean> {
  try {
    // Check if already enabled
    if (areNotificationsEnabled()) {
      const existingSubscription = await getPushSubscription();
      if (existingSubscription) {
        return true;
      }
    }

    // Request permission
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      return false;
    }

    // Subscribe to push
    const subscription = await subscribeToPush();

    // Save subscription to database
    await savePushSubscription(subscription);

    return true;
  } catch (error) {
    console.error('Error enabling push notifications:', error);
    return false;
  }
}

// Complete flow: Unsubscribe and delete from database
export async function disablePushNotifications(): Promise<boolean> {
  try {
    // Delete from database
    await deletePushSubscription();

    // Unsubscribe from push
    await unsubscribeFromPush();

    return true;
  } catch (error) {
    console.error('Error disabling push notifications:', error);
    return false;
  }
}

// Show a local notification (for testing)
export async function showLocalNotification(
  payload: NotificationPayload
): Promise<void> {
  if (!isPushSupported()) {
    throw new Error('Notifications are not supported');
  }

  if (!areNotificationsEnabled()) {
    throw new Error('Notification permission not granted');
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.data?.icon || '/icons/icon-192x192.png',
      badge: payload.data?.badge || '/icons/icon-96x96.png',
      tag: payload.data?.tag || payload.type,
      requireInteraction: payload.data?.requireInteraction || false,
      data: {
        ...payload.data?.data,
        url: payload.data?.url || '/',
        notificationType: payload.type,
      },
    } as NotificationOptions);
  } catch (error) {
    console.error('Error showing notification:', error);
    throw error;
  }
}

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
