'use server';

export async function createCustomerPortalSession() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'}/api/customer-portal`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create portal session');
    }

    return { url: data.url };
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create customer portal session',
    };
  }
}
