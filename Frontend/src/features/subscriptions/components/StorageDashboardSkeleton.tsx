import { Skeleton } from '@/components/ui/skeleton'

export function StorageDashboardSkeleton() {
  return (
    <section
      className="grid gap-6 rounded-xl bg-card p-6 shadow-float md:grid-cols-2 md:p-8"
      aria-label="Loading your storage allocation"
    >
      <div className="flex flex-col gap-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-3 w-full rounded-full" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
      <Skeleton className="aspect-square w-full" />
    </section>
  )
}
