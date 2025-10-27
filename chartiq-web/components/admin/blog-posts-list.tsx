'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatDistanceToNow } from 'date-fns'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  status: 'draft' | 'published' | 'archived'
  created_at: string
  published_at?: string
  view_count: number
  profiles?: { email: string }
}

interface BlogPostsListProps {
  posts: BlogPost[]
}

export function BlogPostsList({ posts }: BlogPostsListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!postToDelete) return

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postToDelete)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      })

      router.refresh()
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      })
    } finally {
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    }
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No blog posts yet</p>
        <Button asChild>
          <Link href="/admin/blog/new">Create your first post</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold truncate">{post.title}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.status === 'published'
                      ? 'bg-green-500/10 text-green-500'
                      : post.status === 'draft'
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : 'bg-gray-500/10 text-gray-500'
                  }`}
                >
                  {post.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  {post.published_at
                    ? `Published ${formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}`
                    : `Created ${formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}`}
                </span>
                <span>• {post.view_count} views</span>
                {post.profiles?.email && <span>• By {post.profiles.email}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {post.status === 'published' && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/blog/edit/${post.id}`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPostToDelete(post.id)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
