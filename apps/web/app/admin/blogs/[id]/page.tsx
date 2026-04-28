import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { EditBlogForm } from './edit-form'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()

  const { id } = await params
  
  const blog = await prisma.blogPost.findUnique({
    where: { id }
  })

  if (!blog) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Blog Post</h2>
        <p className="text-muted-foreground mt-2">
          Update the details of your blog post.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <EditBlogForm blog={blog} />
        </CardContent>
      </Card>
    </div>
  )
}
