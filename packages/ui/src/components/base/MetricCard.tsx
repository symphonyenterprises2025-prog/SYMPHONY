import { cn } from '../../lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  className?: string
}

export function MetricCard({ label, value, unit, className }: MetricCardProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">
        {value} {unit && <span className="text-sm font-normal text-muted-foreground">{unit}</span>}
      </p>
    </div>
  )
}
