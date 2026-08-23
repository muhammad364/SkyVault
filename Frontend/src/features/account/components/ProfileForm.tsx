import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { AuthFormField } from '@/features/auth/components/AuthFormField'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { FormNotice } from '@/features/auth/components/FormNotice'
import { applyApiFieldErrors } from '@/features/auth/lib/applyApiFieldErrors'
import { authErrorMessage } from '@/features/auth/lib/authErrorMessage'
import { useUpdateProfile } from '@/features/account/hooks/useUpdateProfile'
import { profileSchema, type ProfileValues } from '@/features/account/validators/account.schemas'
import type { UserProfileResponse } from '@/models/auth/UserProfileResponse'

interface ProfileFormProps {
  profile: UserProfileResponse
  context?: 'vault' | 'admin'
}

export function ProfileForm({ profile, context = 'vault' }: ProfileFormProps) {
  const updateProfile = useUpdateProfile()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: profile.firstName, lastName: profile.lastName },
  })

  const submit = (values: ProfileValues) => {
    updateProfile.mutate(values, {
      onSuccess: (updatedProfile) =>
        reset({
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
        }),
      onError: (error) => {
        if (applyApiFieldErrors(error, setError, ['firstName', 'lastName'])) return
        setError('root', {
          message: authErrorMessage(error, "We couldn't update your profile right now."),
        })
      },
    })
  }

  return (
    <section className="rounded-xl bg-card p-6 shadow-rest" aria-labelledby="profile-heading">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-brand">Your identity</p>
            {profile.isEmailVerified ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-card-muted px-3 py-1 text-xs font-semibold text-foreground">
                <CircleCheck aria-hidden="true" className="text-success" size={16} /> Verified email
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <h2 id="profile-heading" className="font-display text-2xl font-bold text-foreground">
              Profile details
            </h2>
            <p className="text-sm text-muted-foreground">
              {context === 'admin'
                ? 'Keep the name attached to your administrator profile current.'
                : 'Keep the name attached to your private workspace current.'}
            </p>
          </div>
        </header>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthFormField
              id="profile-first-name"
              label="First name"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <AuthFormField
              id="profile-last-name"
              label="Last name"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
          <AuthFormField
            id="profile-email"
            type="email"
            label="Email address"
            value={profile.email}
            readOnly
            aria-readonly="true"
          />
          {errors.root?.message ? <FormNotice>{errors.root.message}</FormNotice> : null}
          {updateProfile.isSuccess && !isDirty ? (
            <FormNotice tone="success">Your profile has been updated.</FormNotice>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <AuthSubmitButton
              pending={updateProfile.isPending}
              idleLabel="Save changes"
              pendingLabel="Saving changes"
            />
            {isDirty ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                disabled={updateProfile.isPending}
              >
                Discard
              </Button>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  )
}
