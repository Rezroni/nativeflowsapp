// Base database type from Supabase firms table
export type Firm = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  description: string | null
  website_url: string | null
  overall_rating: number | null
  platform_rating: number | null
  execution_rating: number | null
  support_rating: number | null
  fees_rating: number | null
  minimum_deposit: number | null
  minimum_deposit_currency: string | null
  maximum_leverage: string | null
  spreads_from: number | null
  features: any | null // JSONB
  trading_platforms: string[] | null
  markets: string[] | null
  regulation: string[] | null
  account_types: string[] | null
  badges: any | null // JSONB
  is_featured: boolean
  is_top_rated: boolean
  country: string | null
  years_in_operation: number | null
  max_allocations: string | null
  promo: string | null
  pros: any | null // JSONB
  cons: any | null // JSONB
  review_count: number
  user_count: string | null
  status: 'draft' | 'published' | 'archived'
  display_order: number
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

export type FirmInsert = Omit<Firm, 'id' | 'created_at' | 'updated_at'>
export type FirmUpdate = Partial<FirmInsert>

// Feature structure
export interface FirmFeature {
  name: string
  available: boolean
  icon?: string
}

// Badge structure
export interface FirmBadge {
  text: string
  variant: 'default' | 'destructive' | 'outline' | 'secondary'
}

// Extended firm type with parsed JSONB fields
export interface FirmWithParsedData extends Omit<Firm, 'features' | 'badges' | 'pros' | 'cons'> {
  features: FirmFeature[]
  badges: FirmBadge[]
  pros: string[]
  cons: string[]
}

// Form data type for creating/editing firms
export interface FirmFormData {
  // Basic Information
  name: string
  slug: string
  logo_url?: string
  description?: string
  website_url?: string

  // Ratings
  overall_rating?: number
  platform_rating?: number
  execution_rating?: number
  support_rating?: number
  fees_rating?: number

  // Financial Details
  minimum_deposit?: number
  minimum_deposit_currency?: string
  maximum_leverage?: string
  spreads_from?: number

  // Company Information
  country?: string
  years_in_operation?: number
  max_allocations?: string
  promo?: string

  // Features
  features?: FirmFeature[]

  // Trading Information
  trading_platforms?: string[]
  markets?: string[]
  regulation?: string[]
  account_types?: string[]

  // Badges and Highlights
  badges?: FirmBadge[]
  is_featured?: boolean
  is_top_rated?: boolean

  // Additional Information
  pros?: string[]
  cons?: string[]

  // Social Proof
  review_count?: number
  user_count?: string

  // Status
  status?: 'draft' | 'published' | 'archived'
  display_order?: number
}

// Filter and sort options for firms list
export interface FirmsFilterOptions {
  status?: 'draft' | 'published' | 'archived' | 'all'
  is_featured?: boolean
  is_top_rated?: boolean
  min_rating?: number
  search?: string
  sort_by?: 'name' | 'rating' | 'created_at' | 'display_order'
  sort_direction?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

// API Response types
export interface FirmsListResponse {
  firms: FirmWithParsedData[]
  total: number
  page: number
  pageSize: number
}

export interface FirmResponse {
  firm: FirmWithParsedData | null
  error?: string
}

// Statistics type for admin dashboard
export interface FirmsStats {
  total: number
  published: number
  draft: number
  archived: number
  featured: number
  top_rated: number
  average_rating: number
}
