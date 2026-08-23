import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface AdminFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
}

export const AdminField = forwardRef<HTMLInputElement, AdminFieldProps>(function AdminField(
  { label, hint, error, id, className, ...props },
  ref,
) {
  const messageId = error || hint ? `${id}-message` : undefined
  return (
    <label
      className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-foreground"
      htmlFor={id}
    >
      {label}
      <Input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={messageId}
        className={cn(error && 'border-danger', className)}
        {...props}
      />
      {error ? (
        <span
          id={messageId}
          className="flex items-center gap-2 text-xs font-normal text-danger"
          role="alert"
        >
          <AlertCircle aria-hidden="true" size={14} /> {error}
        </span>
      ) : hint ? (
        <span id={messageId} className="text-xs font-normal text-muted-foreground">
          {hint}
        </span>
      ) : null}
    </label>
  )
})

interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
}

export function AdminSelect({ label, error, id, className, children, ...props }: AdminSelectProps) {
  const messageId = error ? `${id}-message` : undefined
  return (
    <label
      className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-foreground"
      htmlFor={id}
    >
      {label}
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={messageId}
        className={cn(
          'min-h-11 w-full min-w-0 rounded-md border border-border bg-card px-3 text-base text-foreground shadow-rest sm:text-sm',
          error && 'border-danger',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <span
          id={messageId}
          className="flex items-center gap-2 text-xs font-normal text-danger"
          role="alert"
        >
          <AlertCircle aria-hidden="true" size={14} /> {error}
        </span>
      ) : null}
    </label>
  )
}
