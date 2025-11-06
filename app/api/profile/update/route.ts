import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

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

    // Validate inputs
    if (!fullName || fullName.trim() === '') {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: any = {
      full_name: fullName.trim(),
      updated_at: new Date().toISOString(),
    };

    // Add username to update if provided
    // The database has a unique constraint, so we rely on that for validation
    if (username && username.trim() !== '') {
      updateData.username = username.trim();
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

      // Check if it's a unique constraint violation (username already taken)
      if (error.code === '23505' && error.message?.includes('username')) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        );
      }

      // Generic error message to avoid information leakage
      return NextResponse.json(
        { error: 'Failed to update profile' },
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
