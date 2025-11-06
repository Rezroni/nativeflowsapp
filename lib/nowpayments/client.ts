/**
 * NOWPayments API Client
 * Documentation: https://documenter.getpostman.com/view/7907941/2s93JusNJt
 */

import crypto from 'crypto'

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1'
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY!
const NOWPAYMENTS_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET!

export interface NOWPaymentsStatus {
  message: string
}

export interface AvailableCurrency {
  currencies: string[]
}

export interface EstimatePrice {
  currency_from: string
  amount_from: number
  currency_to: string
  estimated_amount: string
}

export interface PaymentParams {
  price_amount: number
  price_currency: string
  pay_currency?: string
  ipn_callback_url: string
  order_id: string
  order_description: string
  success_url?: string
  cancel_url?: string
  customer_email?: string
}

export interface Payment {
  payment_id: string
  payment_status: 'waiting' | 'confirming' | 'confirmed' | 'sending' | 'partially_paid' | 'finished' | 'failed' | 'refunded' | 'expired'
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  pay_currency: string
  order_id: string
  order_description: string
  ipn_callback_url: string
  created_at: string
  updated_at: string
  purchase_id: string
  smart_contract?: string
  network?: string
  network_precision?: string
  time_limit?: string
  burning_percent?: string
  expiration_estimate_date?: string
  invoice_url?: string
}

export interface PaymentStatus {
  payment_id: string
  payment_status: Payment['payment_status']
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  actually_paid: number
  pay_currency: string
  order_id: string
  order_description: string
  purchase_id: string
  created_at: string
  updated_at: string
  outcome_amount: number
  outcome_currency: string
}

export interface IPNCallbackData {
  payment_id: string
  invoice_id?: string
  payment_status: Payment['payment_status']
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  actually_paid: number
  pay_currency: string
  order_id: string
  order_description: string
  purchase_id: string
  outcome_amount: number
  outcome_currency: string
  created_at: string
  updated_at: string
}

/**
 * Check API status
 */
export async function getApiStatus(): Promise<NOWPaymentsStatus> {
  const response = await fetch(`${NOWPAYMENTS_API_URL}/status`, {
    headers: {
      'x-api-key': NOWPAYMENTS_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`NOWPayments API status check failed: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get list of available currencies
 */
export async function getAvailableCurrencies(): Promise<string[]> {
  const response = await fetch(`${NOWPAYMENTS_API_URL}/currencies`, {
    headers: {
      'x-api-key': NOWPAYMENTS_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get available currencies: ${response.statusText}`)
  }

  const data: AvailableCurrency = await response.json()
  return data.currencies
}

/**
 * Get estimate price for payment
 */
export async function getEstimatePrice(
  amount: number,
  currencyFrom: string,
  currencyTo: string
): Promise<EstimatePrice> {
  const response = await fetch(
    `${NOWPAYMENTS_API_URL}/estimate?amount=${amount}&currency_from=${currencyFrom}&currency_to=${currencyTo}`,
    {
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to get estimate price: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Create a payment
 */
export async function createPayment(params: PaymentParams): Promise<Payment> {
  const response = await fetch(`${NOWPAYMENTS_API_URL}/payment`, {
    method: 'POST',
    headers: {
      'x-api-key': NOWPAYMENTS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(`Failed to create payment: ${error.message || response.statusText}`)
  }

  return response.json()
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
  const response = await fetch(`${NOWPAYMENTS_API_URL}/payment/${paymentId}`, {
    headers: {
      'x-api-key': NOWPAYMENTS_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get payment status: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Verify IPN callback signature
 */
export function verifyIPNSignature(
  receivedSignature: string,
  payload: string
): boolean {
  // Use imported crypto module for signature verification
  const hmac = crypto.createHmac('sha512', NOWPAYMENTS_IPN_SECRET)
  hmac.update(payload)
  const calculatedSignature = hmac.digest('hex')

  return receivedSignature === calculatedSignature
}

/**
 * Get minimum payment amount for a currency
 */
export async function getMinimumPaymentAmount(currency: string): Promise<number> {
  const response = await fetch(`${NOWPAYMENTS_API_URL}/min-amount?currency_from=usd&currency_to=${currency}`, {
    headers: {
      'x-api-key': NOWPAYMENTS_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get minimum payment amount: ${response.statusText}`)
  }

  const data = await response.json()
  return parseFloat(data.min_amount)
}

export const nowPaymentsClient = {
  getApiStatus,
  getAvailableCurrencies,
  getEstimatePrice,
  createPayment,
  getPaymentStatus,
  verifyIPNSignature,
  getMinimumPaymentAmount,
}
