'use client'

import { CategoryImageUpload } from '@/components/admin/category-image-upload'

export function CategoryImageUploadWrapper({ initialImage }: { initialImage?: string | null }) {
  function handleChange(url: string | null) {
    const input = document.getElementById('category-image-input') as HTMLInputElement
    if (input) input.value = url || ''
  }

  return <CategoryImageUpload initialImage={initialImage} onImageChange={handleChange} />
}

export function NewCategoryForm() {
  return <CategoryImageUploadWrapper initialImage={null} />
}
