import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LandingSectionSkeletonProps {
  tall?: boolean
}

export function LandingSectionSkeleton({ tall = false }: LandingSectionSkeletonProps) {
  return (
    <section
      className={cn('rounded-2xl bg-card p-6 shadow-rest', tall ? 'min-h-96' : 'min-h-64')}
      aria-label="Loading landing section"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-3/4" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    </section>
  )
}
