'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // Check admin_roles table instead of profiles.role
  const { data: adminRole, error } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  // Log for debugging
  if (error) {
    console.error('Error checking admin role:', error);
  }

  // Return true if user has any admin role (super_admin, admin, or editor)
  return adminRole !== null && ['super_admin', 'admin', 'editor'].includes(adminRole.role);
}

/**
 * Get current user's admin role details
 */
export async function getAdminRole() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: adminRole } = await supabase
    .from('admin_roles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return adminRole;
}

/**
 * Update user subscription tier (admin only)
 */
export async function updateUserSubscriptionTier(
  userId: string,
  newTier: 'weekly' | 'monthly' | 'annual'
) {
  const supabase = await createClient();

  // Check if current user is admin
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return { error: 'Unauthorized. Admin access required.' };
  }

  try {
    // Calculate subscription period based on plan type
    const periodDays = newTier === 'weekly' ? 7 : newTier === 'monthly' ? 30 : 365;
    const currentPeriodEnd = new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000).toISOString();

    // Update or create subscription record
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingSubscription) {
      // Update existing subscription - all paid plans are active
      const { error: subError } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          plan_type: newTier,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSubscription.id);

      if (subError) {
        throw subError;
      }
    } else {
      // Create new subscription record - all paid plans are active
      const { error: createError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          status: 'active',
          plan_type: newTier,
          current_period_start: new Date().toISOString(),
          current_period_end: currentPeriodEnd,
        });

      if (createError) {
        throw createError;
      }
    }

    revalidatePath('/admin/users');
    revalidatePath('/admin/subscriptions');

    return {
      success: true,
      message: `User subscription updated to ${newTier} tier successfully`,
    };
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update user subscription',
    };
  }
}

/**
 * Get user details with subscription info (admin only)
 */
export async function getUserDetails(userId: string) {
  const supabase = await createClient();

  // Check if current user is admin
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return { error: 'Unauthorized. Admin access required.' };
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Get analysis count
    const { count: analysisCount } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    return {
      success: true,
      user: {
        ...profile,
        subscription: subscription || null,
        analysisCount: analysisCount || 0,
      },
    };
  } catch (error) {
    console.error('Error getting user details:', error);
    return {
      error:
        error instanceof Error ? error.message : 'Failed to get user details',
    };
  }
}

/**
 * Change user password (super admin only)
 */
export async function changeUserPassword(
  userId: string,
  newPassword: string
) {
  const supabase = await createClient();

  // Check if current user is super admin
  const adminRole = await getAdminRole();
  if (!adminRole || adminRole.role !== 'super_admin') {
    return { error: 'Unauthorized. Super admin access required.' };
  }

  // Validate password
  if (!newPassword || newPassword.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  try {
    // Get service role client for admin operations
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) throw error;

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User password updated successfully',
    };
  } catch (error) {
    console.error('Error changing user password:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to change user password',
    };
  }
}

/**
 * Create new user (super admin only)
 */
export async function createUser(
  email: string,
  password: string,
  fullName?: string
) {
  const supabase = await createClient();

  // Check if current user is super admin
  const adminRole = await getAdminRole();
  if (!adminRole || adminRole.role !== 'super_admin') {
    return { error: 'Unauthorized. Super admin access required.' };
  }

  // Validate input
  if (!email || !email.includes('@')) {
    return { error: 'Valid email is required.' };
  }
  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  try {
    // Create user using admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName || '',
      },
    });

    if (error) throw error;

    revalidatePath('/admin/users');

    return {
      success: true,
      message: `User ${email} created successfully`,
      user: data.user,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to create user',
    };
  }
}

/**
 * Assign role to user (super admin only)
 */
export async function assignUserRole(
  userId: string,
  role: 'super_admin' | 'admin' | 'editor'
) {
  const supabase = await createClient();

  // Check if current user is super admin
  const adminRole = await getAdminRole();
  if (!adminRole || adminRole.role !== 'super_admin') {
    return { error: 'Unauthorized. Super admin access required.' };
  }

  try {
    // Check if user already has a role
    const { data: existingRole } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingRole) {
      // Update existing role
      const { error: updateError } = await supabase
        .from('admin_roles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    } else {
      // Create new role
      const { error: insertError } = await supabase
        .from('admin_roles')
        .insert({ user_id: userId, role });

      if (insertError) throw insertError;
    }

    revalidatePath('/admin/users');
    revalidatePath('/admin/roles');

    return {
      success: true,
      message: `User role updated to ${role} successfully`,
    };
  } catch (error) {
    console.error('Error assigning user role:', error);
    return {
      error:
        error instanceof Error ? error.message : 'Failed to assign user role',
    };
  }
}

/**
 * Remove role from user (super admin only)
 */
export async function removeUserRole(userId: string) {
  const supabase = await createClient();

  // Check if current user is super admin
  const adminRole = await getAdminRole();
  if (!adminRole || adminRole.role !== 'super_admin') {
    return { error: 'Unauthorized. Super admin access required.' };
  }

  try {
    const { error } = await supabase
      .from('admin_roles')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    revalidatePath('/admin/users');
    revalidatePath('/admin/roles');

    return {
      success: true,
      message: 'User role removed successfully',
    };
  } catch (error) {
    console.error('Error removing user role:', error);
    return {
      error:
        error instanceof Error ? error.message : 'Failed to remove user role',
    };
  }
}

/**
 * Get all users with their roles (admin only)
 */
export async function getAllUsersWithRoles() {
  const supabase = await createClient();

  // Check if current user is admin
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return { error: 'Unauthorized. Admin access required.' };
  }

  try {
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*, admin_roles(*)')
      .order('created_at', { ascending: false });

    if (profileError) throw profileError;

    return {
      success: true,
      users: profiles,
    };
  } catch (error) {
    console.error('Error getting users with roles:', error);
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get users with roles',
    };
  }
}
