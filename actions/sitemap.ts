'use server'

import { createClient } from '@/lib/supabase/server'

const BASE_URL = 'https://www.nativeflows.com'

const STATIC_PAGES_COUNT = 15

export async function generateSitemap() {
  try {
    // Call the API route to generate the sitemap
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/api/sitemap/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to generate sitemap',
      }
    }

    return {
      success: true,
      message: data.message,
      count: data.count,
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate sitemap',
    }
  }
}

export async function getSitemapStats() {
  try {
    const supabase = await createClient()

    // Get counts
    const { count: blogCount, error: blogError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    const { count: firmsCount, error: firmsError } = await supabase
      .from('firms')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    if (blogError || firmsError) {
      console.error('Error fetching stats:', blogError || firmsError)
    }

    const staticCount = STATIC_PAGES_COUNT
    const totalCount = staticCount + (blogCount || 0) + (firmsCount || 0)

    return {
      success: true,
      stats: {
        static: staticCount,
        blogPosts: blogCount || 0,
        firms: firmsCount || 0,
        total: totalCount,
      },
    }
  } catch (error) {
    console.error('Error getting sitemap stats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get stats',
    }
  }
}
