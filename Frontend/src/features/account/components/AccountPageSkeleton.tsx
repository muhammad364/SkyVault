import { Skeleton } from '@/components/ui/skeleton'

export function AccountPageSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2" aria-label="Loading account settings" role="status">
      {[0, 1].map((item) => (
        <div key={item} className="rounded-xl bg-card p-6 shadow-rest">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-36" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading account settings.</span>
    </div>
  )
}
