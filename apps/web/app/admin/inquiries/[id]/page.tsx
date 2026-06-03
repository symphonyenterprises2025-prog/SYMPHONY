import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

async function updateInquiryStatus(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const status = formData.get('status') as string

  await prisma.corporateInquiry.update({
    where: { id },
    data: { status },
  })

  redirect('/admin/inquiries')
}

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()

  const { id } = await params
  const inquiry = await prisma.corporateInquiry.findUnique({ where: { id } })

  if (!inquiry) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/inquiries">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inquiry Details</h2>
          <p className="text-muted-foreground mt-1">
            From {inquiry.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">Name</Label>
              <p className="font-medium">{inquiry.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Email</Label>
              <p className="font-medium">{inquiry.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Phone</Label>
              <p className="font-medium">{inquiry.phone || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Company</Label>
              <p className="font-medium">{inquiry.company || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Budget</Label>
              <p className="font-medium">{inquiry.budget || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Timeline</Label>
              <p className="font-medium">{inquiry.timeline || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Submitted At</Label>
              <p className="font-medium">{new Date(inquiry.createdAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{inquiry.requirements}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateInquiryStatus} className="flex items-end gap-4">
            <input type="hidden" name="id" value={inquiry.id} />
            <div className="space-y-2 flex-1">
              <Label htmlFor="status">Status</Label>
              <select id="status" name="status" defaultValue={inquiry.status} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <Button type="submit">Update Status</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
