/**
 * Pricing Configuration for NOWPayments
 */

export type PlanType = 'weekly' | 'monthly' | 'annual'

export interface PricingPlan {
  id: PlanType
  name: string
  price: number // in USD
  currency: string
  interval: 'week' | 'month' | 'year'
  features: string[]
  limits: {
    analysesPerMonth: number
  }
  popular?: boolean
  useOpenRouter?: boolean // Whether to use OpenRouter API (for weekly plan)
}

export const PRICING_PLANS: Record<PlanType, PricingPlan> = {
  weekly: {
    id: 'weekly',
    name: 'Weekly',
    price: 10,
    currency: 'USD',
    interval: 'week',
    features: [
      'Unlimited chart analyses',
      'Smart Money Concepts',
      'Email support',
      'Educational resources',
      'Valid for 7 days',
    ],
    limits: {
      analysesPerMonth: -1, // unlimited
    },
    useOpenRouter: true, // Uses OpenRouter API
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: 25,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited chart analyses',
      'Advanced Smart Money Concepts',
      'Priority support',
      'Advanced indicators',
      'Trade journal',
      'Market alerts',
      'Premium AI models',
    ],
    limits: {
      analysesPerMonth: -1, // unlimited
    },
    popular: true,
  },
  annual: {
    id: 'annual',
    name: 'Annual',
    price: 250,
    currency: 'USD',
    interval: 'year',
    features: [
      'Unlimited chart analyses',
      'Advanced Smart Money Concepts',
      'Priority support',
      'Advanced indicators',
      'Trade journal',
      'Market alerts',
      'Premium AI models',
      'Save $50 per year',
    ],
    limits: {
      analysesPerMonth: -1, // unlimited
    },
  },
}

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
