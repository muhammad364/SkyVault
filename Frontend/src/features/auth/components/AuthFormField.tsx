import { forwardRef, type InputHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface AuthFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const AuthFormField = forwardRef<HTMLInputElement, AuthFormFieldProps>(
  function AuthFormField({ label, error, hint, id, ...props }, ref) {
    const messageId = `${id}-message`

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor={id}>
          {label}
        </label>
        <Input
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? messageId : undefined}
          className={error ? 'border-danger' : undefined}
          {...props}
        />
        {error ? (
          <p id={messageId} className="flex items-center gap-2 text-sm text-danger" role="alert">
            <AlertCircle aria-hidden="true" size={16} /> {error}
          </p>
        ) : hint ? (
          <p id={messageId} className="text-sm text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)
