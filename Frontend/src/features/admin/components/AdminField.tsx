import { forwardRef, type InputHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, type SelectOption } from '@/components/ui/select'
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

interface AdminSelectProps {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function AdminSelect({
  label,
  value,
  onValueChange,
  options,
  error,
  id,
  className,
  disabled,
  placeholder,
}: AdminSelectProps) {
  const messageId = error ? `${id}-message` : undefined
  return (
    <div className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-foreground">
      <span id={`${id}-label`}>{label}</span>
      <Select
        id={id}
        aria-labelledby={`${id}-label`}
        value={value}
        onValueChange={onValueChange}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(error && 'border-danger', className)}
      />
      {error ? (
        <span
          id={messageId}
          className="flex items-center gap-2 text-xs font-normal text-danger"
          role="alert"
        >
          <AlertCircle aria-hidden="true" size={14} /> {error}
        </span>
      ) : null}
    </div>
  )
}
