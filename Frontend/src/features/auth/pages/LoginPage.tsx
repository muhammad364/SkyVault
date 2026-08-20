import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '@/api/errors'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { AuthFormField } from '@/features/auth/components/AuthFormField'
import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { FormNotice } from '@/features/auth/components/FormNotice'
import { PasswordField } from '@/features/auth/components/PasswordField'
import { applyApiFieldErrors } from '@/features/auth/lib/applyApiFieldErrors'
import { authErrorMessage } from '@/features/auth/lib/authErrorMessage'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { loginSchema, type LoginValues } from '@/features/auth/validators/auth.schemas'

interface LoginLocationState {
  from?: { pathname?: string }
  notice?: string
}

export default function LoginPage() {
  const login = useLogin()
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LoginLocationState | null
  const destination = state?.from?.pathname ?? '/vault'
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const submit = (values: LoginValues) => {
    login.mutate(values, {
      onSuccess: () => navigate(destination, { replace: true }),
      onError: (error) => {
        if (error instanceof ApiError && error.code === 'email_not_verified') {
          navigate('/auth/check-email', {
            state: {
              email: values.email,
              notice: 'Your email is not verified yet. Use the verification link or request another email.',
            },
          })
          return
        }
        if (applyApiFieldErrors(error, setError, ['email', 'password'])) return
        setError('root', { message: authErrorMessage(error, "We couldn't sign you in right now.") })
      },
    })
  }

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Open your vault."
      description="Sign in to return to your private workspace."
      footer={<p className="text-center text-sm text-muted-foreground">New to SkyVault? <Link className="font-semibold text-primary hover:underline" to="/auth/register">Create your account</Link></p>}
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(submit)} noValidate>
        {state?.notice ? <FormNotice tone="success">{state.notice}</FormNotice> : null}
        <AuthFormField id="login-email" type="email" label="Email address" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <PasswordField id="login-password" label="Password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        <div className="flex justify-end">
          <Link className="text-sm font-semibold text-primary hover:underline" to="/auth/forgot-password">Forgot your password?</Link>
        </div>
        {errors.root?.message ? <FormNotice>{errors.root.message}</FormNotice> : null}
        <AuthSubmitButton pending={login.isPending} idleLabel="Sign in" pendingLabel="Opening your vault" />
      </form>
    </AuthCard>
  )
}
