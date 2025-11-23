'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlogEditor } from './blog-editor'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Save, Eye } from 'lucide-react'
import { sanitizeRichText, sanitizePlainText } from '@/lib/utils/sanitize'

interface BlogPostFormProps {
  initialData?: {
    id?: string
    title: string
    slug: string
    excerpt: string
    content: string
    status: 'draft' | 'published' | 'archived'
    featured_image_url?: string
    meta_title?: string
    meta_description?: string
    categories?: string[]
    tags?: string[]
  }
}

export function BlogPostForm({ initialData }: BlogPostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    status: initialData?.status || 'draft',
    featured_image_url: initialData?.featured_image_url || '',
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    categories: initialData?.categories?.join(', ') || '',
    tags: initialData?.tags?.join(', ') || ''
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
      meta_title: formData.meta_title || title
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size must be less than 5MB',
        variant: 'destructive',
      })
      return
    }

    setIsUploadingImage(true)

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `blog/${crypto.randomUUID()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('chart-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chart-images')
        .getPublicUrl(fileName)

      setFormData({ ...formData, featured_image_url: publicUrl })

      toast({
        title: 'Success!',
        description: 'Image uploaded successfully',
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSubmit = async (status: 'draft' | 'published') => {
    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      // Sanitize all user inputs to prevent XSS attacks
      const postData = {
        title: sanitizePlainText(formData.title),
        slug: sanitizePlainText(formData.slug),
        excerpt: sanitizePlainText(formData.excerpt),
        content: { html: sanitizeRichText(formData.content) }, // Allow rich text but sanitize
        status,
        featured_image_url: formData.featured_image_url || null,
        meta_title: sanitizePlainText(formData.meta_title || formData.title),
        meta_description: sanitizePlainText(formData.meta_description || formData.excerpt),
        categories: formData.categories ? formData.categories.split(',').map(c => sanitizePlainText(c.trim())) : [],
        tags: formData.tags ? formData.tags.split(',').map(t => sanitizePlainText(t.trim())) : [],
        author_id: user.id,
        published_at: status === 'published' ? new Date().toISOString() : null,
        reading_time_minutes: Math.ceil(formData.content.split(' ').length / 200)
      }

      let result

      if (initialData?.id) {
        // Update existing post
        result = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', initialData.id)
      } else {
        // Create new post
        result = await supabase
          .from('blog_posts')
          .insert(postData)
      }

      if (result.error) throw result.error

      toast({
        title: 'Success!',
        description: `Blog post ${status === 'published' ? 'published' : 'saved as draft'}`,
      })

      router.push('/admin/blog')
      router.refresh()
    } catch (error) {
      console.error('Error saving blog post:', error)
      toast({
        title: 'Error',
        description: 'Failed to save blog post. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Post Content</CardTitle>
          <CardDescription>The main content of your blog post</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title..."
              className="text-2xl font-bold"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="post-url-slug"
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be the URL: /blog/{formData.slug}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A brief summary of your post..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Content *</Label>
            <BlogEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO & Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>SEO & Metadata</CardTitle>
          <CardDescription>Optimize your post for search engines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              placeholder="SEO title (defaults to post title)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="SEO description (defaults to excerpt)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featured_image">Featured Image</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="featured_image"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg or upload below"
                />
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
            {formData.featured_image_url && (
              <div className="mt-2 relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                <Image
                  src={formData.featured_image_url}
                  alt="Featured image preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categories">Categories</Label>
              <Input
                id="categories"
                value={formData.categories}
                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                placeholder="Trading, Analysis, SMC"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="forex, crypto, technical"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push('/admin/blog')}>
          Cancel
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting || !formData.title || !formData.slug}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting || !formData.title || !formData.slug}
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  )
}
