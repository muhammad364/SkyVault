import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { AuthFormField } from '@/features/auth/components/AuthFormField'
import { Button } from '@/components/ui/button'
import {
  additionalStorageAmountSchema,
  type AdditionalStorageAmountValues,
} from '@/features/subscriptions/validators/payment.schema'

interface AdditionalStorageAmountFormProps {
  onSubmit: (storageAmountGb: number) => void
  onAmountChange: () => void
}

export function AdditionalStorageAmountForm({
  onSubmit,
  onAmountChange,
}: AdditionalStorageAmountFormProps) {
  const form = useForm<AdditionalStorageAmountValues>({
    resolver: zodResolver(additionalStorageAmountSchema),
    defaultValues: { storageAmountGb: 1 },
  })

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit((values) => onSubmit(values.storageAmountGb))}
      noValidate
    >
      <AuthFormField
        id="storageAmountGb"
        label="Additional storage in GB"
        type="number"
        min={1}
        max={2_147_483_647}
        step={1}
        inputMode="numeric"
        hint="Enter a whole number. SkyVault calculates the current price from your plan and purchase history."
        error={form.formState.errors.storageAmountGb?.message}
        {...form.register('storageAmountGb', { onChange: onAmountChange })}
      />
      <Button type="submit">
        Get my quote <ArrowRight aria-hidden="true" size={20} />
      </Button>
    </form>
  )
}
