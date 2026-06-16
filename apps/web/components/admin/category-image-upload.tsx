'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'

export function CategoryImageUploadWrapper({ initialImage }: { initialImage?: string | null }) {
  function handleChange(url: string | null) {
    const input = document.getElementById('category-image-input') as HTMLInputElement
    if (input) input.value = url || ''
  }

  return <CategoryImageUpload initialImage={initialImage} onImageChange={handleChange} />
}

export function CategoryImageUpload({
  initialImage,
  onImageChange,
}: {
  initialImage?: string | null
  onImageChange: (url: string | null) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'categories')

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }
      const data = await res.json()
      setPreview(data.url)
      onImageChange(data.url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleRemove() {
    setPreview(null)
    onImageChange(null)
  }

  return (
    <div className="space-y-2">
      <Label>Category Image</Label>
      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
            <Image src={preview} alt="Category" fill className="object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white hover:bg-black/70"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : null}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            className="hidden"
            id="category-image-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  )
}
