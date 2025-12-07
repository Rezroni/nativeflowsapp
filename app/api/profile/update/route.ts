import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sanitizePlainText } from '@/lib/utils/sanitize';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, username } = body;

    console.log('Profile update request:', { fullName, username, userId: user.id });

    // Validate inputs
    if (!fullName || fullName.trim() === '') {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    // Build update object with sanitized inputs to prevent XSS
    const updateData: any = {
      full_name: sanitizePlainText(fullName.trim()),
      updated_at: new Date().toISOString(),
    };

    // Add username to update if provided (sanitize and validate)
    // The database has a unique constraint, so we rely on that for validation
    if (username && username.trim() !== '') {
      const sanitizedUsername = sanitizePlainText(username.trim());
      // Additional validation: username should only contain alphanumeric, dash, underscore
      if (!/^[a-zA-Z0-9_-]+$/.test(sanitizedUsername)) {
        return NextResponse.json(
          { error: 'Username can only contain letters, numbers, dashes, and underscores' },
          { status: 400 }
        );
      }
      updateData.username = sanitizedUsername;
    }

    // Update profile
    const { error, data } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);

      // Check if it's a unique constraint violation (username already taken)
      if (error.code === '23505' && error.message?.includes('username')) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }

      // Return more specific error message in development
      const errorMessage = process.env.NODE_ENV === 'development'
        ? `Failed to update profile: ${error.message}`
        : 'Failed to update profile';

      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    // Revalidate the settings page
    revalidatePath('/settings');

    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Log full error details server-side for debugging
    console.error('Error in profile update:', error);

    // Return generic error message to client to avoid information leakage
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
