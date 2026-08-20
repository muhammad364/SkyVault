import { AlertCircle, CircleCheck } from 'lucide-react'

interface FormNoticeProps {
  children: string
  tone?: 'error' | 'success'
}

export function FormNotice({ children, tone = 'error' }: FormNoticeProps) {
  const Icon = tone === 'success' ? CircleCheck : AlertCircle
  return (
    <div
      className={tone === 'success'
        ? 'rounded-md bg-card-muted p-4 text-sm text-foreground'
        : 'rounded-md bg-accent-coral-soft p-4 text-sm text-foreground'}
      role={tone === 'success' ? 'status' : 'alert'}
    >
      <div className="flex items-start gap-3">
        <Icon aria-hidden="true" className={tone === 'success' ? 'shrink-0 text-primary' : 'shrink-0 text-accent-coral'} size={20} />
        <p>{children}</p>
      </div>
    </div>
  )
}
