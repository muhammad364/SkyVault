import { Skeleton } from '@/components/ui/skeleton'

export function PlansSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading storage plans">
      {[0, 1, 2].map((item) => (
        <div key={item} className="rounded-lg bg-card p-6 shadow-rest">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
