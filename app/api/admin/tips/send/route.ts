import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendPushNotificationBulk } from '@/lib/push/server';
import { rateLimit, createRateLimitHeaders } from '@/lib/rate-limit';

// Check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: adminRole } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .in('role', ['super_admin', 'admin', 'editor'])
    .single();

  return !!adminRole;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 requests per minute for bulk notifications (strict to prevent spam)
    const rateLimitResult = await rateLimit(request, { limit: 3, window: 60 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: createRateLimitHeaders(rateLimitResult)
        }
      );
    }

    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    let { tip, title } = body;

    // Input validation
    if (!tip || typeof tip !== 'string') {
      return NextResponse.json(
        { error: 'Tip content is required and must be a string' },
        { status: 400 }
      );
    }

    if (title && typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title must be a string' },
        { status: 400 }
      );
    }

    // Sanitize and validate length
    tip = tip.trim();
    if (title) {
      title = title.trim();
    }

    if (tip.length === 0 || tip.length > 500) {
      return NextResponse.json(
        { error: 'Tip content must be between 1 and 500 characters' },
        { status: 400 }
      );
    }

    if (title && title.length > 100) {
      return NextResponse.json(
        { error: 'Title must be 100 characters or less' },
        { status: 400 }
      );
    }

    // Basic XSS prevention - strip HTML tags
    tip = tip.replace(/<[^>]*>/g, '');
    if (title) {
      title = title.replace(/<[^>]*>/g, '');
    }

    console.log('[Admin] Sending trading tip to all users...');
    console.log('[Admin] Tip:', tip.substring(0, 100));

    // Get all users with daily tips enabled
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, notification_preferences, email')
      .not('notification_preferences->>push_enabled', 'is', 'false')
      .eq('notification_preferences->>daily_tip', 'true');

    if (profilesError) {
      console.error('[Admin] Error fetching profiles:', profilesError);
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users have daily tips enabled',
        totalSuccess: 0,
        totalFailed: 0,
        usersTargeted: 0,
      });
    }

    console.log(`[Admin] Found ${profiles.length} users with daily tips enabled`);

    const userIds = profiles.map((p) => p.id);

    // Send push notification to all users
    const result = await sendPushNotificationBulk(userIds, 'daily_tip', {
      tip,
      title: title || 'Daily Trading Tip',
      url: '/',
    });

    console.log(`[Admin] Sent tips: ${result.totalSuccess} success, ${result.totalFailed} failed`);

    // Log the broadcast
    await supabase.from('notification_history').insert({
      user_id: user.id, // Admin who sent it
      type: 'daily_tip',
      title: title || 'Daily Trading Tip',
      body: tip,
      data: {
        broadcast: true,
        recipients: userIds.length,
        success: result.totalSuccess,
        failed: result.totalFailed,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Trading tip sent to ${profiles.length} users`,
      totalSuccess: result.totalSuccess,
      totalFailed: result.totalFailed,
      usersTargeted: profiles.length,
    });
  } catch (error: any) {
    console.error('[Admin] Error sending tip:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to send trading tip' },
      { status: 500 }
    );
  }
}
