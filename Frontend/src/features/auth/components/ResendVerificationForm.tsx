import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AuthFormField } from '@/features/auth/components/AuthFormField'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { FormNotice } from '@/features/auth/components/FormNotice'
import { applyApiFieldErrors } from '@/features/auth/lib/applyApiFieldErrors'
import { useResendVerification } from '@/features/auth/hooks/useResendVerification'
import { emailSchema, type EmailValues } from '@/features/auth/validators/auth.schemas'

interface ResendVerificationFormProps {
  defaultEmail?: string
}

export function ResendVerificationForm({ defaultEmail = '' }: ResendVerificationFormProps) {
  const resend = useResendVerification()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: defaultEmail },
  })

  const submit = (values: EmailValues) => {
    resend.mutate(values, {
      onError: (error) => {
        if (!applyApiFieldErrors(error, setError, ['email'])) {
          setError('root', {
            message: "We couldn't request another email right now. Please try again.",
          })
        }
      },
    })
  }

  if (resend.isSuccess) {
    return (
      <FormNotice tone="success">
        If that account can receive verification email, a message is on its way.
      </FormNotice>
    )
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)} noValidate>
      <AuthFormField
        id="resend-email"
        type="email"
        label="Email address"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      {errors.root?.message ? <FormNotice>{errors.root.message}</FormNotice> : null}
      <AuthSubmitButton
        pending={resend.isPending}
        idleLabel="Send another email"
        pendingLabel="Sending email"
      />
    </form>
  )
}
