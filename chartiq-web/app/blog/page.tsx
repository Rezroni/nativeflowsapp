import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { Clock, Eye } from 'lucide-react'

export const metadata = {
  title: 'Blog | Nativeflows',
  description: 'Latest insights, tips, and news about trading and AI analysis'
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*, profiles(email)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div className="flex min-h-screen flex-col gradient-bg">
      <Header />

      <main className="flex-1 py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <h1 className="text-5xl font-bold mb-6 md:text-6xl">
              <span className="gradient-text">Blog & Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Learn trading strategies, AI analysis tips, and market insights from our team
            </p>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No blog posts published yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full glass-card hover-glow transition-all hover:-translate-y-2 cursor-pointer">
                    {post.featured_image_url && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg relative">
                        <Image
                          src={post.featured_image_url}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.reading_time_minutes} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.view_count} views</span>
                        </div>
                      </div>
                      <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                      <CardDescription className="text-base">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(post.published_at!), { addSuffix: true })}
                        </span>
                        {post.categories && post.categories.length > 0 && (
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                            {post.categories[0]}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
