// API route to send push notifications (admin/system use)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendPushNotification } from '@/lib/push/server';
import { NotificationType } from '@/lib/push/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'userId and type are required' },
        { status: 400 }
      );
    }

    // Validate notification type
    const validTypes: NotificationType[] = [
      'analysis_complete',
      'subscription_expiring',
      'new_feature',
      'daily_tip',
      'usage_warning',
    ];

    if (!validTypes.includes(type as NotificationType)) {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      );
    }

    // Only allow sending notifications to self (unless admin)
    // For now, users can only trigger their own notifications
    if (userId !== user.id) {
      // Check if user is admin (you can implement this check)
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      // For now, no one can send to others (can be expanded for admins)
      return NextResponse.json(
        { error: 'Cannot send notifications to other users' },
        { status: 403 }
      );
    }

    // Send push notification
    const result = await sendPushNotification(
      userId,
      type as NotificationType,
      data
    );

    return NextResponse.json({
      success: true,
      message: 'Push notification sent successfully',
      result,
    });
  } catch (error) {
    console.error('Error in /api/push/send:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
