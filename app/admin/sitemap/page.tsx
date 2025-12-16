import { Metadata } from 'next'
import { SitemapManager } from '@/components/admin/sitemap-manager'

export const metadata: Metadata = {
  title: 'Sitemap Management | Admin',
  description: 'Manage and regenerate sitemap',
}

export default function SitemapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sitemap Management</h1>
        <p className="text-muted-foreground mt-2">
          Generate and manage your sitemap.xml file with all pages, blog posts, and firms
        </p>
      </div>

      <SitemapManager />
    </div>
  )
}
