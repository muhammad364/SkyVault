import { LogOut, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AccountPageSkeleton } from '@/features/account/components/AccountPageSkeleton'
import { ChangePasswordForm } from '@/features/account/components/ChangePasswordForm'
import { ProfileForm } from '@/features/account/components/ProfileForm'
import { useLogout } from '@/features/account/hooks/useLogout'
import { useProfile } from '@/features/account/hooks/useProfile'
import { authErrorMessage } from '@/features/auth/lib/authErrorMessage'

interface AccountPageProps {
  context?: 'vault' | 'admin'
}

export default function AccountPage({ context = 'vault' }: AccountPageProps) {
  const profile = useProfile()
  const logout = useLogout()
  const navigate = useNavigate()

  if (profile.isPending) return <AccountPageSkeleton />

  if (profile.isError) {
    return (
      <section
        className="rounded-xl bg-card p-6 shadow-rest"
        aria-labelledby="account-error-heading"
      >
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col gap-2">
            <h2
              id="account-error-heading"
              className="font-display text-2xl font-bold text-foreground"
            >
              Your settings stayed closed.
            </h2>
            <p className="text-sm text-muted-foreground">
              {authErrorMessage(
                profile.error,
                "We couldn't load your profile. Check your connection and try again.",
              )}
            </p>
          </div>
          <Button type="button" onClick={() => profile.refetch()} disabled={profile.isFetching}>
            <RotateCcw aria-hidden="true" size={18} />{' '}
            {profile.isFetching ? 'Trying again' : 'Try again'}
          </Button>
        </div>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm profile={profile.data} context={context} />
        <ChangePasswordForm context={context} />
      </div>
      <section className="rounded-xl bg-card-muted p-6" aria-labelledby="session-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h2 id="session-heading" className="font-display text-xl font-bold text-foreground">
              End this browser session
            </h2>
            <p className="text-sm text-muted-foreground">
              Signing out removes your local access token and cached account data.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            disabled={logout.isPending}
            onClick={() =>
              logout.mutate(undefined, {
                onSettled: () =>
                  navigate('/auth/login', {
                    replace: true,
                    state: { loginMode: context === 'admin' ? 'admin' : 'user' },
                  }),
              })
            }
          >
            <LogOut aria-hidden="true" size={18} /> {logout.isPending ? 'Signing out' : 'Sign out'}
          </Button>
        </div>
      </section>
    </div>
  )
}
