'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  FirmFormData,
  FirmsFilterOptions,
  FirmWithParsedData,
  FirmsListResponse,
  FirmResponse,
  FirmsStats,
} from '@/types/firms'

/**
 * Check if the current user is an admin
 */
export async function isAdminForFirms(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: adminRole } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return !!adminRole
}

/**
 * Get all firms with filtering and pagination
 */
export async function getAllFirms(
  options: FirmsFilterOptions = {}
): Promise<FirmsListResponse> {
  const supabase = await createClient()
  const {
    status = 'all',
    is_featured,
    is_top_rated,
    min_rating,
    search,
    sort_by = 'display_order',
    sort_direction = 'asc',
    limit = 50,
    offset = 0,
  } = options

  let query = supabase.from('firms').select('*', { count: 'exact' })

  // Apply filters
  if (status !== 'all') {
    query = query.eq('status', status)
  }

  if (is_featured !== undefined) {
    query = query.eq('is_featured', is_featured)
  }

  if (is_top_rated !== undefined) {
    query = query.eq('is_top_rated', is_top_rated)
  }

  if (min_rating !== undefined) {
    query = query.gte('overall_rating', min_rating)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // Apply sorting
  const ascending = sort_direction === 'asc'
  switch (sort_by) {
    case 'name':
      query = query.order('name', { ascending })
      break
    case 'rating':
      query = query.order('overall_rating', { ascending: !ascending, nullsFirst: false })
      break
    case 'created_at':
      query = query.order('created_at', { ascending })
      break
    case 'display_order':
    default:
      query = query.order('display_order', { ascending })
      query = query.order('name', { ascending: true })
      break
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data: firms, error, count } = await query

  if (error) {
    console.error('Error fetching firms:', error)
    return {
      firms: [],
      total: 0,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    }
  }

  // Parse JSONB fields
  const parsedFirms: FirmWithParsedData[] = (firms || []).map((firm) => ({
    ...firm,
    features: (firm.features as any) || [],
    badges: (firm.badges as any) || [],
    pros: (firm.pros as any) || [],
    cons: (firm.cons as any) || [],
  }))

  return {
    firms: parsedFirms,
    total: count || 0,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
  }
}

/**
 * Get a single firm by ID
 */
export async function getFirmById(id: string): Promise<FirmResponse> {
  const supabase = await createClient()

  const { data: firm, error } = await supabase
    .from('firms')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !firm) {
    return { firm: null, error: error?.message || 'Firm not found' }
  }

  // Parse JSONB fields
  const parsedFirm: FirmWithParsedData = {
    ...firm,
    features: (firm.features as any) || [],
    badges: (firm.badges as any) || [],
    pros: (firm.pros as any) || [],
    cons: (firm.cons as any) || [],
  }

  return { firm: parsedFirm }
}

/**
 * Get a single firm by slug
 */
export async function getFirmBySlug(slug: string): Promise<FirmResponse> {
  const supabase = await createClient()

  const { data: firm, error } = await supabase
    .from('firms')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !firm) {
    return { firm: null, error: error?.message || 'Firm not found' }
  }

  // Parse JSONB fields
  const parsedFirm: FirmWithParsedData = {
    ...firm,
    features: (firm.features as any) || [],
    badges: (firm.badges as any) || [],
    pros: (firm.pros as any) || [],
    cons: (firm.cons as any) || [],
  }

  return { firm: parsedFirm }
}

/**
 * Create a new firm
 */
export async function createFirm(
  formData: FirmFormData
): Promise<{ success: boolean; firm?: FirmWithParsedData; error?: string }> {
  const supabase = await createClient()

  // Check admin permission
  const isAdmin = await isAdminForFirms()
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required' }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  // Insert firm
  const { data: firm, error } = await supabase
    .from('firms')
    .insert({
      ...formData,
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating firm:', error)
    return { success: false, error: error.message }
  }

  // Parse JSONB fields
  const parsedFirm: FirmWithParsedData = {
    ...firm,
    features: (firm.features as any) || [],
    badges: (firm.badges as any) || [],
    pros: (firm.pros as any) || [],
    cons: (firm.cons as any) || [],
  }

  revalidatePath('/admin/firms')
  revalidatePath('/firms')

  return { success: true, firm: parsedFirm }
}

/**
 * Update an existing firm
 */
export async function updateFirm(
  id: string,
  formData: FirmFormData
): Promise<{ success: boolean; firm?: FirmWithParsedData; error?: string }> {
  const supabase = await createClient()

  // Check admin permission
  const isAdmin = await isAdminForFirms()
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required' }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  // Update firm
  const { data: firm, error } = await supabase
    .from('firms')
    .update({
      ...formData,
      updated_by: user.id,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating firm:', error)
    return { success: false, error: error.message }
  }

  // Parse JSONB fields
  const parsedFirm: FirmWithParsedData = {
    ...firm,
    features: (firm.features as any) || [],
    badges: (firm.badges as any) || [],
    pros: (firm.pros as any) || [],
    cons: (firm.cons as any) || [],
  }

  revalidatePath('/admin/firms')
  revalidatePath(`/admin/firms/edit/${id}`)
  revalidatePath('/firms')
  revalidatePath(`/firms/${firm.slug}`)

  return { success: true, firm: parsedFirm }
}

/**
 * Delete a firm
 */
export async function deleteFirm(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Check admin permission
  const isAdmin = await isAdminForFirms()
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required' }
  }

  const { error } = await supabase.from('firms').delete().eq('id', id)

  if (error) {
    console.error('Error deleting firm:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/firms')
  revalidatePath('/firms')

  return { success: true }
}

/**
 * Get firms statistics for admin dashboard
 */
export async function getFirmsStats(): Promise<FirmsStats> {
  const supabase = await createClient()

  // Check admin permission
  const isAdmin = await isAdminForFirms()
  if (!isAdmin) {
    return {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0,
      featured: 0,
      top_rated: 0,
      average_rating: 0,
    }
  }

  const { data: firms } = await supabase.from('firms').select('*')

  if (!firms || firms.length === 0) {
    return {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0,
      featured: 0,
      top_rated: 0,
      average_rating: 0,
    }
  }

  const published = firms.filter((f) => f.status === 'published').length
  const draft = firms.filter((f) => f.status === 'draft').length
  const archived = firms.filter((f) => f.status === 'archived').length
  const featured = firms.filter((f) => f.is_featured).length
  const topRated = firms.filter((f) => f.is_top_rated).length

  const ratingsSum = firms.reduce(
    (sum, f) => sum + (f.overall_rating || 0),
    0
  )
  const averageRating =
    firms.length > 0 ? Number((ratingsSum / firms.length).toFixed(2)) : 0

  return {
    total: firms.length,
    published,
    draft,
    archived,
    featured,
    top_rated: topRated,
    average_rating: averageRating,
  }
}

/**
 * Duplicate a firm (useful for creating similar firms)
 */
export async function duplicateFirm(
  id: string
): Promise<{ success: boolean; firm?: FirmWithParsedData; error?: string }> {
  const supabase = await createClient()

  // Check admin permission
  const isAdmin = await isAdminForFirms()
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required' }
  }

  // Get the original firm
  const { data: originalFirm, error: fetchError } = await supabase
    .from('firms')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !originalFirm) {
    return { success: false, error: 'Firm not found' }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  // Create a copy with modified name and slug
  const timestamp = Date.now()
  const { data: newFirm, error: createError } = await supabase
    .from('firms')
    .insert({
      ...originalFirm,
      id: undefined, // Let DB generate new ID
      name: `${originalFirm.name} (Copy)`,
      slug: `${originalFirm.slug}-copy-${timestamp}`,
      status: 'draft',
      created_by: user.id,
      updated_by: user.id,
      created_at: undefined,
      updated_at: undefined,
    })
    .select()
    .single()

  if (createError) {
    console.error('Error duplicating firm:', createError)
    return { success: false, error: createError.message }
  }

  // Parse JSONB fields
  const parsedFirm: FirmWithParsedData = {
    ...newFirm,
    features: (newFirm.features as any) || [],
    badges: (newFirm.badges as any) || [],
    pros: (newFirm.pros as any) || [],
    cons: (newFirm.cons as any) || [],
  }

  revalidatePath('/admin/firms')

  return { success: true, firm: parsedFirm }
}
