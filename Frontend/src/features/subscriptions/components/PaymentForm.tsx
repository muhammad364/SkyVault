import { zodResolver } from '@hookform/resolvers/zod'
import { CreditCard, LoaderCircle, LockKeyhole } from 'lucide-react'
import { type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { AuthFormField } from '@/features/auth/components/AuthFormField'
import {
  paymentSchema,
  type PaymentFormValues,
} from '@/features/subscriptions/validators/payment.schema'

interface PaymentFormProps {
  amountLabel: string
  amountValue: string
  submitLabel: string
  submitDisabled?: boolean
  acknowledgement?: ReactNode
  onSubmit: (payment: PaymentFormValues) => Promise<void>
}

export function PaymentForm({
  amountLabel,
  amountValue,
  submitLabel,
  submitDisabled,
  acknowledgement,
  onSubmit,
}: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardHolderName: '',
      cardNumber: '',
      expiryMonth: new Date().getMonth() + 1,
      expiryYear: new Date().getFullYear(),
      cvv: '',
    },
  })

  return (
    <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {acknowledgement}
      <output
        className="flex items-center justify-between gap-4 rounded-lg bg-card-muted p-5"
        aria-live="polite"
      >
        <span className="text-sm font-semibold text-muted-foreground">{amountLabel}</span>
        <strong className="font-mono text-xl tabular-nums text-foreground">{amountValue}</strong>
      </output>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <LockKeyhole aria-hidden="true" className="text-primary" size={20} />
        <span>
          Your payment details are used only for this request and are never stored in this browser.
        </span>
      </div>
      <AuthFormField
        id="cardHolderName"
        label="Name on card"
        autoComplete="cc-name"
        maxLength={100}
        error={form.formState.errors.cardHolderName?.message}
        {...form.register('cardHolderName')}
      />
      <AuthFormField
        id="cardNumber"
        label="Card number"
        autoComplete="cc-number"
        inputMode="numeric"
        placeholder="0000 0000 0000 0000"
        error={form.formState.errors.cardNumber?.message}
        {...form.register('cardNumber')}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <AuthFormField
          id="expiryMonth"
          label="Expiry month"
          type="number"
          min={1}
          max={12}
          autoComplete="cc-exp-month"
          inputMode="numeric"
          error={form.formState.errors.expiryMonth?.message}
          {...form.register('expiryMonth')}
        />
        <AuthFormField
          id="expiryYear"
          label="Expiry year"
          type="number"
          min={2000}
          max={2100}
          autoComplete="cc-exp-year"
          inputMode="numeric"
          error={form.formState.errors.expiryYear?.message}
          {...form.register('expiryYear')}
        />
        <AuthFormField
          id="cvv"
          label="CVV"
          type="password"
          autoComplete="cc-csc"
          inputMode="numeric"
          maxLength={4}
          error={form.formState.errors.cvv?.message}
          {...form.register('cvv')}
        />
      </div>
      <Button type="submit" className="w-full" disabled={submitDisabled}>
        <CreditCard aria-hidden="true" size={20} /> {submitLabel}
      </Button>
      {form.formState.isSubmitting ? (
        <span className="sr-only" role="status">
          <LoaderCircle aria-hidden="true" /> Preparing payment
        </span>
      ) : null}
    </form>
  )
}
