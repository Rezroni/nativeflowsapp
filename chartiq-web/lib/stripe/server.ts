import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Product and Price IDs
export const STRIPE_PRODUCTS = {
  PRO_MONTHLY: {
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
    name: 'Pro Monthly',
    price: 29,
  },
  PRO_ANNUAL: {
    priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || '',
    name: 'Pro Annual',
    price: 290,
  },
  ENTERPRISE: {
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    name: 'Enterprise',
    price: 999,
  },
} as const;

export const PLAN_LIMITS = {
  free: 5,
  pro_monthly: 100,
  pro_annual: 100,
  enterprise: 999999,
} as const;

export type PlanId = keyof typeof PLAN_LIMITS;
