/**
 * Stripe Price IDs for subscription plans
 * These need to be created in your Stripe Dashboard
 * and the IDs should be added here
 */

export const STRIPE_PLANS = {
  weekly: {
    priceId: process.env.STRIPE_WEEKLY_PRICE_ID || 'price_weekly_placeholder',
    amount: 10,
    currency: 'usd',
    interval: 'week' as const,
  },
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
    amount: 25,
    currency: 'usd',
    interval: 'month' as const,
  },
  annual: {
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID || 'price_annual_placeholder',
    amount: 250,
    currency: 'usd',
    interval: 'year' as const,
  },
} as const

export type StripePlanType = keyof typeof STRIPE_PLANS

/**
 * Get Stripe price ID for a plan
 */
export function getStripePriceId(planType: StripePlanType): string {
  const priceId = STRIPE_PLANS[planType].priceId

  // Check if using placeholder - means env var is not set
  if (priceId.includes('placeholder')) {
    throw new Error(
      `Stripe Price ID for ${planType} plan is not configured. ` +
      `Please set STRIPE_${planType.toUpperCase()}_PRICE_ID environment variable.`
    )
  }

  return priceId
}

/**
 * Get plan details by type
 */
export function getStripePlanDetails(planType: StripePlanType) {
  return STRIPE_PLANS[planType]
}
