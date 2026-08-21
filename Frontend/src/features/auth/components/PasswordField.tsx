import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  hint?: string
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ label, error, hint, id, ...props }, ref) {
    const [visible, setVisible] = useState(false)
    const messageId = `${id}-message`

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-foreground" htmlFor={id}>
          {label}
        </label>
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type={visible ? 'text' : 'password'}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? messageId : undefined}
            className={error ? 'border-danger pr-14' : 'pr-14'}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible((value) => !value)}
          >
            {visible ? (
              <EyeOff aria-hidden="true" size={20} />
            ) : (
              <Eye aria-hidden="true" size={20} />
            )}
          </Button>
        </div>
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
