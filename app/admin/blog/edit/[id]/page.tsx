import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BlogPostForm } from '@/components/admin/blog-post-form'

export const metadata = {
  title: 'Edit Blog Post | Admin',
  description: 'Edit an existing blog post'
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) {
    notFound()
  }

  // Transform the post data for the form
  const initialData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content?.html || '',
    status: post.status as 'draft' | 'published' | 'archived',
    featured_image_url: post.featured_image_url || '',
    meta_title: post.meta_title || '',
    meta_description: post.meta_description || '',
    categories: post.categories || [],
    tags: post.tags || []
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Edit Post</h1>
        <p className="text-muted-foreground">
          Update your blog post
        </p>
      </div>

      <BlogPostForm initialData={initialData} />
    </div>
  )
}
