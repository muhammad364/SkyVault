import { useLocation } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { AuthBackLink } from '@/features/auth/components/AuthBackLink'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { FormNotice } from '@/features/auth/components/FormNotice'
import { ResendVerificationForm } from '@/features/auth/components/ResendVerificationForm'

export default function CheckEmailPage() {
  const location = useLocation()
  const state = location.state as { email?: string; notice?: string } | null

  return (
    <AuthCard
      eyebrow="One calm step left"
      title="Check your inbox."
      description="Use the verification link we sent before signing in."
      footer={
        <div className="flex justify-center text-sm">
          <AuthBackLink label="Return to sign in" />
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {state?.notice ? <FormNotice>{state.notice}</FormNotice> : null}
        <div className="rounded-lg bg-card-muted p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <MailCheck aria-hidden="true" className="text-success" size={24} />
            <p className="text-sm text-muted-foreground">
              Email delivery may take a moment. Check Spam or Junk, then request another message
              below if needed.
            </p>
          </div>
        </div>
        <ResendVerificationForm defaultEmail={state?.email} />
      </div>
    </AuthCard>
  )
}
