'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { updateBlogPost, deleteBlogPost } from '@/features/content/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function EditBlogForm({ blog }: { blog: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const author = formData.get('author') as string
    const isPublished = formData.get('isPublished') === 'on'

    try {
      await updateBlogPost(blog.id, {
        title,
        slug,
        excerpt,
        content,
        author,
        isPublished,
        publishedAt: isPublished && !blog.publishedAt ? new Date() : blog.publishedAt,
      })
      router.push('/admin/blogs')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to update blog post')
    } finally {
      setLoading(false)
    }
  }

  async function onDelete() {
    if (!confirm('Are you sure you want to delete this post?')) return
    setDeleting(true)
    try {
      await deleteBlogPost(blog.id)
      router.push('/admin/blogs')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to delete blog post')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
      
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={blog.title} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={blog.slug} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input id="author" name="author" defaultValue={blog.author || ''} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" defaultValue={blog.excerpt || ''} rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" defaultValue={blog.content} rows={10} required />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox id="isPublished" name="isPublished" defaultChecked={blog.isPublished} />
        <Label htmlFor="isPublished">Published</Label>
      </div>

      <div className="pt-4 flex justify-between">
        <Button type="button" variant="destructive" onClick={onDelete} disabled={deleting || loading}>
          {deleting ? 'Deleting...' : 'Delete Post'}
        </Button>
        <div className="space-x-2">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/blogs')} disabled={loading || deleting}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || deleting}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  )
}
