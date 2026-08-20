import { Skeleton } from '@/components/ui/skeleton'

export function LandingPageSkeleton() {
  return (
    <main className="min-h-dvh bg-canvas p-3 md:p-5" aria-label="Loading SkyVault landing page">
      <section className="mx-auto min-h-dvh max-w-screen-xl rounded-2xl bg-surface p-4 md:p-8">
        <div className="flex flex-col gap-8">
          <div className="rounded-xl bg-card p-3 shadow-rest">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-14 w-48" />
              <Skeleton className="h-11 w-32" />
            </div>
          </div>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <Skeleton className="h-20 w-64" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-11 w-48" />
            </div>
            <Skeleton className="aspect-square w-full rounded-2xl" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </section>
    </main>
  )
}
