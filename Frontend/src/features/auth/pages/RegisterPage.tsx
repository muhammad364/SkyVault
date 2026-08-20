import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/errors'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { AuthFormField } from '@/features/auth/components/AuthFormField'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { FormNotice } from '@/features/auth/components/FormNotice'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { applyApiFieldErrors } from '@/features/auth/lib/applyApiFieldErrors'
import { useRegister } from '@/features/auth/hooks/useRegister'
import { registerSchema, type RegisterValues } from '@/features/auth/validators/auth.schemas'

export default function RegisterPage() {
  const registerUser = useRegister()
  const navigate = useNavigate()
  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  })

  const submit = (values: RegisterValues) => {
    const request = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    }

    registerUser.mutate(request, {
      onSuccess: () => navigate('/auth/check-email', { state: { email: request.email } }),
      onError: (error) => {
        if (error instanceof ApiError && error.code === 'email_already_registered') {
          setError('email', { type: 'server', message: 'An account already uses this email address.' })
          return
        }
        if (!applyApiFieldErrors(error, setError, ['firstName', 'lastName', 'email', 'password'])) {
          setError('root', { message: "We couldn't create your account right now. Please try again." })
        }
      },
    })
  }

  return (
    <AuthCard
      eyebrow="Create your space"
      title="A vault of your own."
      description="Create an account, then verify your email to begin."
      footer={<p className="text-center text-sm text-muted-foreground">Already have a vault? <Link className="font-semibold text-primary hover:underline" to="/auth/login">Sign in</Link></p>}
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthFormField id="first-name" label="First name" autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
          <AuthFormField id="last-name" label="Last name" autoComplete="family-name" error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <AuthFormField id="register-email" type="email" label="Email address" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <PasswordField id="register-password" label="Password" autoComplete="new-password" hint="Use 8 to 100 characters." error={errors.password?.message} {...register('password')} />
        <PasswordField id="register-confirm-password" label="Confirm password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        {errors.root?.message ? <FormNotice>{errors.root.message}</FormNotice> : null}
        <AuthSubmitButton pending={registerUser.isPending} idleLabel="Create your account" pendingLabel="Creating your vault" />
      </form>
    </AuthCard>
  )
}
