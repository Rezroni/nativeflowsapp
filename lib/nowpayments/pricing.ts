/**
 * Pricing Configuration for NOWPayments
 */

export type PlanType = 'free' | 'pro'

export interface PricingPlan {
  id: PlanType
  name: string
  price: number // in USD
  currency: string
  interval: 'month'
  features: string[]
  limits: {
    analysesPerMonth: number
  }
  popular?: boolean
}

export const PRICING_PLANS: Record<PlanType, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      '5 chart analyses',
      'Basic Smart Money Concepts',
      'Email support',
      'Educational resources',
    ],
    limits: {
      analysesPerMonth: 5,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 39,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited chart analyses',
      'Advanced Smart Money Concepts',
      'Priority support',
      'Advanced indicators',
      'Trade journal',
      'Market alerts',
      'API access',
      'Custom training',
    ],
    limits: {
      analysesPerMonth: -1, // unlimited
    },
    popular: true,
  },
}

export const FREE_TRIAL_DURATION_DAYS = 3
export const FREE_TRIAL_ANALYSIS_LIMIT = 5

export function getPlanById(planId: PlanType): PricingPlan | undefined {
  return PRICING_PLANS[planId]
}

export function getPlanLimits(planId: PlanType): number {
  const plan = getPlanById(planId)
  return plan?.limits.analysesPerMonth ?? 0
}

export function isPlanUnlimited(planId: PlanType): boolean {
  return getPlanLimits(planId) === -1
}

export function getAvailablePlans(): PricingPlan[] {
  return Object.values(PRICING_PLANS)
}
