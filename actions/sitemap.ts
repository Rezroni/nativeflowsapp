'use server'

import { createClient } from '@/lib/supabase/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

const BASE_URL = 'https://www.nativeflows.com'

// Static pages with their configuration
const STATIC_PAGES: SitemapUrl[] = [
  {
    loc: `${BASE_URL}/`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    loc: `${BASE_URL}/about`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    loc: `${BASE_URL}/privacy`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    loc: `${BASE_URL}/terms`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    loc: `${BASE_URL}/contact`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: `${BASE_URL}/support`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: `${BASE_URL}/disclaimer`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    loc: `${BASE_URL}/docs`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${BASE_URL}/blog`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    loc: `${BASE_URL}/pricing`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: `${BASE_URL}/firms`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    loc: `${BASE_URL}/dashboard`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.7,
  },
]

function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`
}

export async function generateSitemap() {
  try {
    const supabase = await createClient()

    // Get all published blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })

    if (blogError) {
      console.error('Error fetching blog posts:', blogError)
    }

    // Get all published firms
    const { data: firms, error: firmsError } = await supabase
      .from('firms')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })

    if (firmsError) {
      console.error('Error fetching firms:', firmsError)
    }

    // Build sitemap URLs
    const urls: SitemapUrl[] = [...STATIC_PAGES]

    // Add blog posts
    if (blogPosts && blogPosts.length > 0) {
      blogPosts.forEach((post) => {
        urls.push({
          loc: `${BASE_URL}/blog/${post.slug}`,
          lastmod: new Date(post.updated_at).toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: 0.8,
        })
      })
    }

    // Add firms
    if (firms && firms.length > 0) {
      firms.forEach((firm) => {
        urls.push({
          loc: `${BASE_URL}/firms/${firm.slug}`,
          lastmod: new Date(firm.updated_at).toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: 0.8,
        })
      })
    }

    // Generate XML
    const sitemapXML = generateSitemapXML(urls)

    // Write to file
    const publicPath = join(process.cwd(), 'public', 'sitemap.xml')
    await writeFile(publicPath, sitemapXML, 'utf-8')

    return {
      success: true,
      message: `Sitemap generated successfully with ${urls.length} URLs`,
      count: urls.length,
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

    const staticCount = STATIC_PAGES.length
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
