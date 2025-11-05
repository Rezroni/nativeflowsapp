import Stripe from 'stripe'

// Lazy initialization - only create stripe instance when needed
// This prevents build errors when Stripe keys are not set
let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
      typescript: true,
    })
  }
  return stripeInstance
}

export interface StripeCheckoutParams {
  priceId: string
  userId: string
  planType: 'weekly' | 'monthly' | 'annual'
  successUrl: string
  cancelUrl: string
  customerEmail?: string
}

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession(params: StripeCheckoutParams) {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    customer_email: params.customerEmail,
    client_reference_id: params.userId,
    metadata: {
      userId: params.userId,
      planType: params.planType,
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: {
      metadata: {
        userId: params.userId,
        planType: params.planType,
      },
    },
  })

  return session
}

/**
 * Get subscription details by Stripe subscription ID
 */
export async function getSubscription(subscriptionId: string) {
  const stripe = getStripe()
  return await stripe.subscriptions.retrieve(subscriptionId)
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const stripe = getStripe()
  return await stripe.subscriptions.cancel(subscriptionId)
}

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateCustomer(email: string, userId: string) {
  const stripe = getStripe()
  // Check if customer exists
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer
  return await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })
}

/**
 * Construct Stripe webhook event
 */
export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  }

  const stripe = getStripe()
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  )
}
