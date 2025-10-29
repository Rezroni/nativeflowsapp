import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow, format } from 'date-fns'
import { Clock, Eye, ArrowLeft, Tag } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : [],
      type: 'article',
      publishedTime: post.published_at,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, profiles(email, full_name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    notFound()
  }

  // Increment view count
  await supabase
    .from('blog_posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', post.id)

  return (
    <div className="flex min-h-screen flex-col gradient-bg">
      <Header />

      <main className="flex-1 py-20">
        <article className="container max-w-4xl">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          {post.featured_image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-2xl mb-8 relative">
              <Image
                src={post.featured_image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.reading_time_minutes} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{post.view_count + 1} views</span>
              </div>
              <span>•</span>
              <span>
                {format(new Date(post.published_at!), 'MMMM d, yyyy')}
              </span>
              {post.profiles && (
                <>
                  <span>•</span>
                  <span>By {post.profiles.full_name || post.profiles.email}</span>
                </>
              )}
            </div>

            {post.categories && post.categories.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.categories.map((category: string) => (
                  <span
                    key={category}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div
            className="prose prose-lg prose-invert max-w-none prose-headings:gradient-text prose-a:text-primary prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content.html }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-muted text-sm hover:bg-muted/70 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-border text-center">
            <Button size="lg" asChild>
              <Link href="/signup">
                Try Nativeflows AI Free
              </Link>
            </Button>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
