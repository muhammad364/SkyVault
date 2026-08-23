import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AdminField } from '@/features/admin/components/AdminField'
import { useCreateAdminPlan, useUpdateAdminPlan } from '@/features/admin/hooks/useAdminMutations'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import { adminPlanSchema, type AdminPlanValues } from '@/features/admin/validators/admin.schemas'
import { FormNotice } from '@/features/auth/components/FormNotice'
import type { StoragePlanResponse } from '@/models/storagePlan/StoragePlanResponse'

interface AdminPlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan?: StoragePlanResponse
}

export function AdminPlanDialog({ open, onOpenChange, plan }: AdminPlanDialogProps) {
  const createPlan = useCreateAdminPlan()
  const updatePlan = useUpdateAdminPlan()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AdminPlanValues>({
    resolver: zodResolver(adminPlanSchema),
    defaultValues: { name: '', storageSizeGb: 1, price: 0, billingCycle: 1, isActive: true },
  })

  useEffect(() => {
    if (!open) return
    reset({
      name: plan?.name ?? '',
      storageSizeGb: plan?.storageSizeGb ?? 1,
      price: plan?.price ?? 0,
      billingCycle: plan?.billingCycle ?? 1,
      isActive: plan?.isActive ?? true,
    })
  }, [open, plan, reset])

  const submit = (request: AdminPlanValues) => {
    const options = {
      onSuccess: () => onOpenChange(false),
      onError: (reason: unknown) =>
        setError('root', {
          message: adminErrorMessage(reason, "We couldn't save this plan right now."),
        }),
    }
    if (plan) updatePlan.mutate({ storagePlanId: plan.storagePlanId, request }, options)
    else createPlan.mutate(request, options)
  }

  const pending = createPlan.isPending || updatePlan.isPending
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (!pending || nextOpen) && onOpenChange(nextOpen)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{plan ? 'Edit storage plan' : 'Create storage plan'}</DialogTitle>
          <DialogDescription>
            These values are sent directly through the storage-plan request contract.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit(submit)} noValidate>
          <AdminField
            id="plan-name"
            label="Plan name"
            maxLength={100}
            error={errors.name?.message}
            {...register('name')}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField
              id="plan-size"
              label="Storage size (GB)"
              type="number"
              min="1"
              step="1"
              error={errors.storageSizeGb?.message}
              {...register('storageSizeGb', { valueAsNumber: true })}
            />
            <AdminField
              id="plan-price"
              label="Price (PKR)"
              type="number"
              min="0"
              step="0.01"
              error={errors.price?.message}
              {...register('price', { valueAsNumber: true })}
            />
          </div>
          <AdminField
            id="plan-cycle"
            label="Billing cycle (months)"
            type="number"
            min="1"
            max="12"
            step="1"
            error={errors.billingCycle?.message}
            {...register('billingCycle', { valueAsNumber: true })}
          />
          <input
            type="checkbox"
            className="hidden"
            tabIndex={-1}
            aria-hidden="true"
            {...register('isActive')}
          />
          {errors.root?.message ? <FormNotice>{errors.root.message}</FormNotice> : null}
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={pending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving plan' : 'Save plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
