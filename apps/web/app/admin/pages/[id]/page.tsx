import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'
import Link from '@/components/ui/safe-link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { updateContentPage, deleteContentPage } from '@/features/content/actions'

export const dynamic = 'force-dynamic'

async function updatePage(formData: FormData) {
  'use server'
  
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content = formData.get('content') as string
  const metaTitle = formData.get('metaTitle') as string
  const metaDesc = formData.get('metaDesc') as string
  const isPublished = formData.get('isPublished') === 'on'

  const existing = await prisma.contentPage.findUnique({ where: { id } })
  await updateContentPage(id, {
    title,
    slug,
    content,
    metaTitle,
    metaDesc,
    isPublished,
    publishedAt: isPublished && !existing?.publishedAt ? new Date() : existing?.publishedAt,
  })
  redirect('/admin/pages')
}

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()

  const { id } = await params
  const page = await prisma.contentPage.findUnique({ where: { id } })

  if (!page) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/pages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Page</h2>
          <p className="text-muted-foreground mt-1">
            Update content page
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updatePage} className="space-y-4 max-w-2xl">
            <input type="hidden" name="id" value={page.id} />

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required defaultValue={page.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" name="slug" required defaultValue={page.slug} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input id="metaTitle" name="metaTitle" defaultValue={page.metaTitle || ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDesc">Meta Description</Label>
              <Textarea id="metaDesc" name="metaDesc" rows={2} defaultValue={page.metaDesc || ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea id="content" name="content" rows={12} required defaultValue={page.content} />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="isPublished" name="isPublished" defaultChecked={page.isPublished} />
              <Label htmlFor="isPublished" className="cursor-pointer">Published</Label>
            </div>

            <div className="pt-4 flex justify-between">
              <form action={async () => {
                'use server'
                await deleteContentPage(page.id)
                redirect('/admin/pages')
              }}>
                <Button type="submit" variant="destructive">Delete Page</Button>
              </form>
              <div className="space-x-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/pages">Cancel</Link>
                </Button>
                <Button type="submit">Update Page</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
