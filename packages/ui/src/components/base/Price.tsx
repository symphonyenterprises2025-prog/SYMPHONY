import { cn } from '../../lib/utils'

interface PriceProps {
  amount: number
  currency?: string
  compareAmount?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Price({ amount, currency = '₹', compareAmount, className, size = 'md' }: PriceProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-semibold', sizeClasses[size])}>
        {currency}{amount.toFixed(2)}
      </span>
      {compareAmount && compareAmount > amount && (
        <span className={cn('text-muted-foreground line-through', sizeClasses[size])}>
          {currency}{compareAmount.toFixed(2)}
        </span>
      )}
    </div>
  )
}
