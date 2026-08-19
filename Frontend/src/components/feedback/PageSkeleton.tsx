import { Skeleton } from '@/components/ui/skeleton'

export function PageSkeleton() {
  return (
    <main className="min-h-dvh bg-canvas p-3 md:p-5" aria-label="Loading page">
      <section className="mx-auto flex min-h-dvh max-w-screen-xl flex-col gap-8 rounded-2xl bg-surface p-6 md:p-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </section>
    </main>
  )
}
