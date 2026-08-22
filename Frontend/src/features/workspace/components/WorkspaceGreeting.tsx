import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProfile } from '@/features/account/hooks/useProfile'

export function WorkspaceGreeting() {
  const profile = useProfile()

  if (profile.isPending) {
    return (
      <header
        className="flex max-w-3xl flex-col gap-3"
        role="status"
        aria-label="Loading your greeting"
      >
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-6 w-full max-w-2xl" />
      </header>
    )
  }

  if (profile.isError) {
    return (
      <header className="flex max-w-3xl flex-col items-start gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-brand">Your workspace</p>
          <h2 className="text-balance font-display text-4xl font-bold text-foreground">
            Welcome back.
          </h2>
          <p className="text-pretty text-secondary-foreground">
            We couldn&apos;t personalize your welcome, but the rest of your vault is still here.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={profile.isFetching}
          onClick={() => void profile.refetch()}
        >
          <RotateCcw aria-hidden="true" size={18} />
          {profile.isFetching ? 'Trying again' : 'Try greeting again'}
        </Button>
      </header>
    )
  }

  const firstName = profile.data.firstName.trim()

  return (
    <header className="flex max-w-3xl flex-col gap-3">
      <p className="text-sm font-semibold text-brand">Your workspace</p>
      <h2 className="text-balance font-display text-4xl font-bold text-foreground md:text-5xl">
        {firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}
      </h2>
      <p className="text-pretty text-secondary-foreground">
        Your space, plan, recent files, and the things you may want to revisit—all in one calm view.
      </p>
    </header>
  )
}
