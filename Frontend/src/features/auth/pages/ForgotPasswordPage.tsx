import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { AuthBackLink } from '@/features/auth/components/AuthBackLink'
import { AuthFormField } from '@/features/auth/components/AuthFormField'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { FormNotice } from '@/features/auth/components/FormNotice'
import { applyApiFieldErrors } from '@/features/auth/lib/applyApiFieldErrors'
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword'
import { emailSchema, type EmailValues } from '@/features/auth/validators/auth.schemas'

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword()
  const { register, handleSubmit, setError, formState: { errors } } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })

  const submit = (values: EmailValues) => {
    forgotPassword.mutate(values, {
      onError: (error) => {
        if (!applyApiFieldErrors(error, setError, ['email'])) {
          setError('root', { message: "We couldn't request a reset email right now. Please try again." })
        }
      },
    })
  }

  return (
    <AuthCard
      eyebrow="Password recovery"
      title="Find your way back."
      description="Enter your email and we will send instructions when the account can receive them."
      footer={<div className="flex justify-center text-sm"><AuthBackLink /></div>}
    >
      {forgotPassword.isSuccess ? (
        <FormNotice tone="success">If that account can receive password email, a message is on its way.</FormNotice>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
          <AuthFormField id="recovery-email" type="email" label="Email address" autoComplete="email" error={errors.email?.message} {...register('email')} />
          {errors.root?.message ? <FormNotice>{errors.root.message}</FormNotice> : null}
          <AuthSubmitButton pending={forgotPassword.isPending} idleLabel="Send reset instructions" pendingLabel="Sending instructions" />
        </form>
      )}
    </AuthCard>
  )
}
