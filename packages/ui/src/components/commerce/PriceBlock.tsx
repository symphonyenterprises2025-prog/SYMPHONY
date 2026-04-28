import { Price } from '../base/Price'

interface PriceBlockProps {
  amount: number
  compareAmount?: number
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PriceBlock({ amount, compareAmount, currency, size, className }: PriceBlockProps) {
  return (
    <div className={className}>
      <Price amount={amount} compareAmount={compareAmount} currency={currency} size={size} />
    </div>
  )
}
