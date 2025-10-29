import { z } from 'zod';

/**
 * Validation schemas for payment API routes
 */

export const createPaymentSchema = z.object({
  planId: z.enum(['free', 'pro'], {
    message: 'Invalid plan ID',
  }),
  payCurrency: z.string().min(1, 'Payment currency is required').optional().default('usdttrc20'),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export const paymentIdSchema = z.string().min(1, 'Payment ID is required');

/**
 * Helper function to validate request body
 */
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const validated = await schema.parseAsync(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError.message || 'Validation failed',
      };
    }
    return { success: false, error: 'Invalid request data' };
  }
}
