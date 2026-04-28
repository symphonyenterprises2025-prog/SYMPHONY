import { cn } from '../../lib/utils'

interface ProductBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'sale' | 'new' | 'featured'
  className?: string
}

export function ProductBadge({ children, variant = 'default', className }: ProductBadgeProps) {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    sale: 'bg-red-500 text-white',
    new: 'bg-green-500 text-white',
    featured: 'bg-amber-500 text-white',
  }

  return (
    <span
      className={cn(
        'absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
