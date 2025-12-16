'use client'

import { useState, useEffect } from 'react'
import { generateSitemap, getSitemapStats } from '@/actions/sitemap'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, FileText, Globe, Newspaper, Building2, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export function SitemapManager() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [stats, setStats] = useState<{
    static: number
    blogPosts: number
    firms: number
    total: number
  } | null>(null)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const result = await getSitemapStats()
    if (result.success && result.stats) {
      setStats(result.stats)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    const result = await generateSitemap()

    if (result.success) {
      toast.success(result.message || 'Sitemap generated successfully')
      setLastGenerated(new Date().toLocaleString())
      await loadStats()
    } else {
      toast.error(result.error || 'Failed to generate sitemap')
    }

    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Static Pages</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.static || 0}</div>
            <p className="text-xs text-muted-foreground">Core website pages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.blogPosts || 0}</div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Firms</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.firms || 0}</div>
            <p className="text-xs text-muted-foreground">Published firms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">In sitemap.xml</p>
          </CardContent>
        </Card>
      </div>

      {/* Generation Card */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Sitemap</CardTitle>
          <CardDescription>
            Automatically generate sitemap.xml with all your pages, blog posts, and firms.
            This helps search engines discover and index your content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {lastGenerated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Last generated: {lastGenerated}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 sm:flex-initial"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Sitemap
                </>
              )}
            </Button>

            <Button
              variant="outline"
              asChild
            >
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                View Current Sitemap
              </a>
            </Button>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm space-y-1">
                <p className="font-medium">What gets included:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>All static pages (Home, About, Contact, etc.)</li>
                  <li>All published blog posts with their last update date</li>
                  <li>All published firms with their last update date</li>
                  <li>Proper priority and change frequency for SEO</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Info */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Information</CardTitle>
          <CardDescription>
            Best practices for sitemap management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <Badge variant="secondary" className="flex-shrink-0">Tip</Badge>
              <p className="text-muted-foreground">
                Regenerate your sitemap whenever you publish new content (blog posts or firms)
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="flex-shrink-0">Tip</Badge>
              <p className="text-muted-foreground">
                Submit your sitemap to Google Search Console and Bing Webmaster Tools
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="flex-shrink-0">Tip</Badge>
              <p className="text-muted-foreground">
                The sitemap is publicly accessible at: https://www.nativeflows.com/sitemap.xml
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
