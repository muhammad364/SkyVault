import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { AuthBackLink } from '@/features/auth/components/AuthBackLink'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { FormNotice } from '@/features/auth/components/FormNotice'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { applyApiFieldErrors } from '@/features/auth/lib/applyApiFieldErrors'
import { authErrorMessage } from '@/features/auth/lib/authErrorMessage'
import { useUrlToken } from '@/features/auth/lib/useUrlToken'
import { useResetPassword } from '@/features/auth/hooks/useResetPassword'
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from '@/features/auth/validators/auth.schemas'

export default function ResetPasswordPage() {
  const token = useUrlToken()
  const resetPassword = useResetPassword()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const submit = (values: ResetPasswordValues) => {
    if (!token) return
    resetPassword.mutate(
      { token, newPassword: values.newPassword },
      {
        onSuccess: () =>
          navigate('/auth/login', {
            replace: true,
            state: { notice: 'Your password has been updated. Sign in with your new password.' },
          }),
        onError: (error) => {
          if (!applyApiFieldErrors(error, setError, ['newPassword'])) {
            setError('root', {
              message: authErrorMessage(error, "We couldn't update your password."),
            })
          }
        },
      },
    )
  }

  return (
    <AuthCard
      eyebrow="Password reset"
      title="Choose a new key."
      description="Create a new password for your SkyVault account."
      footer={
        <div className="flex flex-col items-center gap-3 text-sm">
          <AuthBackLink />
          <Link className="font-semibold text-primary hover:underline" to="/auth/forgot-password">
            Request another reset email
          </Link>
        </div>
      }
    >
      {!token ? (
        <FormNotice>
          This reset link does not contain a token. Request a new reset email.
        </FormNotice>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <PasswordField
            id="new-password"
            label="New password"
            autoComplete="new-password"
            hint="Use 8 to 100 characters."
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <PasswordField
            id="confirm-new-password"
            label="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          {errors.root?.message ? <FormNotice>{errors.root.message}</FormNotice> : null}
          <AuthSubmitButton
            pending={resetPassword.isPending}
            idleLabel="Update password"
            pendingLabel="Updating password"
          />
        </form>
      )}
    </AuthCard>
  )
}
