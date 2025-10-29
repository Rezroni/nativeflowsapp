'use client';

import mixpanel from 'mixpanel-browser';

let isInitialized = false;

/**
 * Initialize Mixpanel
 */
export function initMixpanel() {
  if (typeof window === 'undefined') return;
  if (isInitialized) return;

  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '88069cff4ab270a6057723937aab503e';

  mixpanel.init(token, {
    autocapture: true,
    record_sessions_percent: 100,
    api_host: 'https://api-eu.mixpanel.com',
    debug: process.env.NODE_ENV === 'development',
  });

  isInitialized = true;
}

/**
 * Track an event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (!isInitialized) {
    console.warn('Mixpanel not initialized');
    return;
  }

  mixpanel.track(eventName, properties);
}

/**
 * Identify a user
 */
export function identifyUser(userId: string, userProperties?: Record<string, any>) {
  if (!isInitialized) {
    console.warn('Mixpanel not initialized');
    return;
  }

  mixpanel.identify(userId);

  if (userProperties) {
    mixpanel.people.set(userProperties);
  }
}

/**
 * Reset user identity (on logout)
 */
export function resetUser() {
  if (!isInitialized) {
    console.warn('Mixpanel not initialized');
    return;
  }

  mixpanel.reset();
}

/**
 * Track page view
 */
export function trackPageView(pageName: string, properties?: Record<string, any>) {
  trackEvent('Page View', {
    page: pageName,
    ...properties,
  });
}

/**
 * Pre-defined event trackers for common actions
 */
export const Analytics = {
  // Authentication events
  signUp: (method: 'email' | 'google') => {
    trackEvent('Sign Up', { method });
  },

  signIn: (method: 'email' | 'google') => {
    trackEvent('Sign In', { method });
  },

  signOut: () => {
    trackEvent('Sign Out');
    resetUser();
  },

  // Analysis events
  chartUploaded: (method: 'file' | 'url') => {
    trackEvent('Chart Uploaded', { method });
  },

  analysisStarted: (chartType?: string) => {
    trackEvent('Analysis Started', { chartType });
  },

  analysisCompleted: (duration: number, chartType?: string) => {
    trackEvent('Analysis Completed', { duration, chartType });
  },

  analysisFailed: (error: string) => {
    trackEvent('Analysis Failed', { error });
  },

  analysisViewed: (analysisId: string) => {
    trackEvent('Analysis Viewed', { analysisId });
  },

  // Subscription events
  pricingPageViewed: () => {
    trackEvent('Pricing Page Viewed');
  },

  checkoutStarted: (planId: string, currency: string) => {
    trackEvent('Checkout Started', { planId, currency });
  },

  paymentCompleted: (planId: string, amount: number, currency: string) => {
    trackEvent('Payment Completed', { planId, amount, currency });
  },

  subscriptionUpgraded: (fromPlan: string, toPlan: string) => {
    trackEvent('Subscription Upgraded', { fromPlan, toPlan });
  },

  subscriptionCancelled: (planId: string, reason?: string) => {
    trackEvent('Subscription Cancelled', { planId, reason });
  },

  // Engagement events
  historyViewed: (analysisCount: number) => {
    trackEvent('History Viewed', { analysisCount });
  },

  settingsViewed: () => {
    trackEvent('Settings Viewed');
  },

  dashboardViewed: (totalAnalyses: number, monthlyAnalyses: number) => {
    trackEvent('Dashboard Viewed', { totalAnalyses, monthlyAnalyses });
  },

  shareButtonClicked: (analysisId: string) => {
    trackEvent('Share Button Clicked', { analysisId });
  },

  // Feature usage
  featureUsed: (featureName: string, details?: Record<string, any>) => {
    trackEvent('Feature Used', { feature: featureName, ...details });
  },

  // Error events
  errorOccurred: (errorType: string, errorMessage: string, context?: Record<string, any>) => {
    trackEvent('Error Occurred', { errorType, errorMessage, ...context });
  },
};

export default mixpanel;
