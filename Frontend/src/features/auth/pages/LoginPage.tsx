import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
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
import { createAuthSession } from '@/features/auth/lib/session'
import { LoginRoleMismatchError, useLogin } from '@/features/auth/hooks/useLogin'
import { loginSchema, type LoginValues } from '@/features/auth/validators/auth.schemas'

interface LoginLocationState {
  from?: { pathname?: string }
  notice?: string
  loginMode?: LoginMode
}

type LoginMode = 'user' | 'admin'

export default function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LoginLocationState | null
  const [mode, setMode] = useState<LoginMode>(state?.loginMode ?? 'user')
  const login = useLogin(mode)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const submit = (values: LoginValues) => {
    login.mutate(values, {
      onSuccess: async (response) => {
        const role = createAuthSession(response).role
        const requestedPath = state?.from?.pathname
        const destination =
          role === 'admin'
            ? requestedPath?.startsWith('/admin')
              ? requestedPath
              : '/admin'
            : requestedPath?.startsWith('/vault')
              ? requestedPath
              : '/vault'
        navigate(destination, { replace: true })
      },
      onError: (error) => {
        if (error instanceof LoginRoleMismatchError) {
          setError('root', {
            message:
              error.expectedRole === 'admin'
                ? 'These credentials do not belong to an administrator account.'
                : 'Use Admin sign in for an administrator account.',
          })
          return
        }
        if (error instanceof ApiError && error.code === 'email_not_verified') {
          navigate('/auth/check-email', {
            state: {
              email: values.email,
              notice:
                'Your email is not verified yet. Use the verification link or request another email.',
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
      eyebrow={mode === 'admin' ? 'Administration' : 'Welcome back'}
      title={mode === 'admin' ? 'Enter operations.' : 'Open your vault.'}
      description={
        mode === 'admin'
          ? 'Use your verified administrator email and password.'
          : 'Sign in to return to your private workspace.'
      }
      footer={
        mode === 'user' ? (
          <p className="text-center text-sm text-muted-foreground">
            New to SkyVault?{' '}
            <Link className="font-semibold text-primary hover:underline" to="/auth/register">
              Create your account
            </Link>
          </p>
        ) : undefined
      }
    >
      <div
        className="grid grid-cols-2 rounded-full bg-card-muted p-1"
        role="tablist"
        aria-label="Sign-in type"
      >
        {(['user', 'admin'] as const).map((loginMode) => (
          <button
            key={loginMode}
            id={`login-${loginMode}-tab`}
            type="button"
            disabled={login.isPending}
            role="tab"
            aria-selected={mode === loginMode}
            aria-controls="login-panel"
            tabIndex={mode === loginMode ? 0 : -1}
            className={`min-h-11 rounded-full px-4 text-sm font-semibold transition duration-default ease-vault ${
              mode === loginMode
                ? 'bg-card text-foreground shadow-rest'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => {
              clearErrors()
              setMode(loginMode)
            }}
            onKeyDown={(event) => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
              event.preventDefault()
              const nextMode = event.key === 'Home' || event.key === 'ArrowLeft' ? 'user' : 'admin'
              clearErrors()
              setMode(nextMode)
              document.getElementById(`login-${nextMode}-tab`)?.focus()
            }}
          >
            {loginMode === 'user' ? 'User' : 'Admin'}
          </button>
        ))}
      </div>
      <form
        id="login-panel"
        role="tabpanel"
        aria-labelledby={`login-${mode}-tab`}
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(submit)}
        noValidate
      >
        {state?.notice ? <FormNotice tone="success">{state.notice}</FormNotice> : null}
        <AuthFormField
          id="login-email"
          type="email"
          label={mode === 'admin' ? 'Administrator email' : 'Email address'}
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <PasswordField
          id="login-password"
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {mode === 'user' ? (
          <div className="flex justify-end">
            <Link
              className="text-sm font-semibold text-primary hover:underline"
              to="/auth/forgot-password"
            >
              Forgot your password?
            </Link>
          </div>
        ) : null}
        {errors.root?.message ? <FormNotice>{errors.root.message}</FormNotice> : null}
        <AuthSubmitButton
          pending={login.isPending}
          idleLabel={mode === 'admin' ? 'Sign in as admin' : 'Sign in'}
          pendingLabel={mode === 'admin' ? 'Opening operations' : 'Opening your vault'}
        />
      </form>
    </AuthCard>
  )
}
