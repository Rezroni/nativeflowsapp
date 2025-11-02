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

    // Only update username if it's provided and the column exists
    if (username && username.trim() !== '') {
      // Check if username column exists by trying to query it
      const { data: columnCheck, error: columnError } = await supabase
        .from('profiles')
        .select('username')
        .limit(1);

      if (!columnError) {
        // Column exists, check if username is already taken
        if (username !== body.currentUsername) {
          const { data: existingUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .neq('id', user.id)
            .single();

          if (existingUser) {
            return NextResponse.json(
              { error: 'Username is already taken' },
              { status: 400 }
            );
          }
        }
        updateData.username = username.trim();
      }
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
      return NextResponse.json(
        { error: error.message || 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Revalidate the settings page
    revalidatePath('/settings');

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in profile update:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
