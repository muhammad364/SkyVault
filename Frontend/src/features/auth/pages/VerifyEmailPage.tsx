import { useEffect, useRef } from 'react'
import { CircleCheck, MailWarning } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { AuthBackLink } from '@/features/auth/components/AuthBackLink'
import { FormNotice } from '@/features/auth/components/FormNotice'
import { ResendVerificationForm } from '@/features/auth/components/ResendVerificationForm'
import { useVerifyEmail } from '@/features/auth/hooks/useVerifyEmail'
import { authErrorMessage } from '@/features/auth/lib/authErrorMessage'
import { useUrlToken } from '@/features/auth/lib/useUrlToken'

export default function VerifyEmailPage() {
  const token = useUrlToken()
  const verify = useVerifyEmail()
  const navigate = useNavigate()
  const started = useRef(false)
  const verifyEmail = verify.mutateAsync

  useEffect(() => {
    if (!token || started.current) return
    started.current = true
    void verifyEmail({ token })
      .then(() =>
        navigate('/auth/login', {
          replace: true,
          state: { notice: 'Your email is verified. You can sign in now.' },
        }),
      )
      .catch(() => undefined)
  }, [navigate, token, verifyEmail])

  return (
    <AuthCard
      eyebrow="Email verification"
      title="Confirm your vault."
      description="We are checking the secure link from your email."
      footer={
        <div className="flex justify-center text-sm">
          <AuthBackLink />
        </div>
      }
    >
      {!token ? (
        <div className="flex flex-col gap-6">
          <FormNotice>
            This verification link does not contain a token. Request a new email below.
          </FormNotice>
          <ResendVerificationForm />
        </div>
      ) : verify.isPending ? (
        <div className="rounded-lg bg-card-muted p-6 text-center" role="status">
          <div className="flex flex-col items-center gap-3">
            <MailWarning aria-hidden="true" className="text-primary" size={24} />
            <p className="text-sm text-muted-foreground">Verifying your email securely…</p>
          </div>
        </div>
      ) : verify.isSuccess ? (
        <div className="rounded-lg bg-card-muted p-6 text-center" role="status">
          <div className="flex flex-col items-center gap-3">
            <CircleCheck aria-hidden="true" className="text-success" size={24} />
            <p className="font-semibold text-foreground">
              Your email is verified. Taking you to sign in…
            </p>
            <Link className="text-sm font-semibold text-primary hover:underline" to="/auth/login">
              Continue now
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <FormNotice>
            {authErrorMessage(verify.error, 'This verification link could not be used.')}
          </FormNotice>
          <ResendVerificationForm />
        </div>
      )}
    </AuthCard>
  )
}
