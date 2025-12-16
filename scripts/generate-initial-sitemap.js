const fs = require('fs')
const path = require('path')

const BASE_URL = 'https://www.nativeflows.com'
const today = new Date().toISOString().split('T')[0]

const staticPages = [
  { loc: '/', priority: 1.0, changefreq: 'daily' },
  { loc: '/about', priority: 0.8, changefreq: 'monthly' },
  { loc: '/privacy', priority: 0.5, changefreq: 'monthly' },
  { loc: '/terms', priority: 0.5, changefreq: 'monthly' },
  { loc: '/contact', priority: 0.7, changefreq: 'monthly' },
  { loc: '/support', priority: 0.7, changefreq: 'monthly' },
  { loc: '/disclaimer', priority: 0.5, changefreq: 'monthly' },
  { loc: '/docs', priority: 0.8, changefreq: 'weekly' },
  { loc: '/blog', priority: 0.9, changefreq: 'daily' },
  { loc: '/pricing', priority: 0.8, changefreq: 'weekly' },
  { loc: '/firms', priority: 0.9, changefreq: 'daily' },
  { loc: '/dashboard', priority: 0.7, changefreq: 'daily' },
  { loc: '/dashboard/analyze', priority: 0.7, changefreq: 'weekly' },
  { loc: '/dashboard/tradingview', priority: 0.7, changefreq: 'weekly' },
  { loc: '/dashboard/profile', priority: 0.6, changefreq: 'weekly' },
]

function generateSitemapXML(urls) {
  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <lastmod>${today}</lastmod>
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

const sitemapXML = generateSitemapXML(staticPages)
const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml')

fs.writeFileSync(outputPath, sitemapXML, 'utf-8')
console.log(`✅ Sitemap generated successfully at: ${outputPath}`)
console.log(`📊 Total URLs: ${staticPages.length}`)
