import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'
import Link from '@/components/ui/safe-link'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { createContentPage } from '@/features/content/actions'

async function createPage(formData: FormData) {
  'use server'
  
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content = formData.get('content') as string
  const metaTitle = formData.get('metaTitle') as string
  const metaDesc = formData.get('metaDesc') as string
  const isPublished = formData.get('isPublished') === 'on'

  await createContentPage({ title, slug, content, metaTitle, metaDesc, isPublished })
  redirect('/admin/pages')
}

export default async function NewPagePage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/pages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Page</h2>
          <p className="text-muted-foreground mt-1">
            Create a new content page
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPage} className="space-y-4 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="e.g., About Us" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" name="slug" required placeholder="e.g., about" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input id="metaTitle" name="metaTitle" placeholder="SEO title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDesc">Meta Description</Label>
              <Textarea id="metaDesc" name="metaDesc" rows={2} placeholder="SEO description" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea id="content" name="content" rows={12} required placeholder="Page content (supports HTML)" />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="isPublished" name="isPublished" />
              <Label htmlFor="isPublished" className="cursor-pointer">Published</Label>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/pages">Cancel</Link>
              </Button>
              <Button type="submit">Create Page</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
