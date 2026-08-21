import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/errors'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { FormNotice } from '@/features/auth/components/FormNotice'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { applyApiFieldErrors } from '@/features/auth/lib/applyApiFieldErrors'
import { authErrorMessage } from '@/features/auth/lib/authErrorMessage'
import { clearClientSession } from '@/features/auth/lib/clearClientSession'
import { useChangePassword } from '@/features/account/hooks/useChangePassword'
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '@/features/account/validators/account.schemas'

export function ChangePasswordForm() {
  const changePassword = useChangePassword()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const submit = (values: ChangePasswordValues) => {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: async () => {
          await clearClientSession()
          navigate('/auth/login', {
            replace: true,
            state: { notice: 'Your password has changed. Sign in again with your new password.' },
          })
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === 'current_password_incorrect') {
            setError('currentPassword', {
              type: 'server',
              message: 'Your current password is incorrect.',
            })
            return
          }
          if (applyApiFieldErrors(error, setError, ['currentPassword', 'newPassword'])) return
          setError('root', {
            message: authErrorMessage(error, "We couldn't change your password right now."),
          })
        },
      },
    )
  }

  return (
    <section className="rounded-xl bg-card p-6 shadow-rest" aria-labelledby="password-heading">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-brand">Vault access</p>
          <div className="flex flex-col gap-2">
            <h2 id="password-heading" className="font-display text-2xl font-bold text-foreground">
              Change password
            </h2>
            <p className="text-sm text-muted-foreground">
              You will be signed out on every successful password change.
            </p>
          </div>
        </header>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <PasswordField
            id="current-password"
            label="Current password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <PasswordField
            id="new-password"
            label="New password"
            autoComplete="new-password"
            hint="Use 8–100 characters."
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          {errors.root?.message ? <FormNotice>{errors.root.message}</FormNotice> : null}
          <AuthSubmitButton
            pending={changePassword.isPending}
            idleLabel="Change password"
            pendingLabel="Changing password"
          />
        </form>
      </div>
    </section>
  )
}
