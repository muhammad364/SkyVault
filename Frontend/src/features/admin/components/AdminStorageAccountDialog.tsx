import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
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
import { AdminField, AdminSelect } from '@/features/admin/components/AdminField'
import {
  useCreateAdminAccount,
  useUpdateAdminAccount,
} from '@/features/admin/hooks/useAdminMutations'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import {
  adminStorageAccountSchema,
  type AdminStorageAccountValues,
} from '@/features/admin/validators/admin.schemas'
import { FormNotice } from '@/features/auth/components/FormNotice'
import { formatBytes } from '@/lib/formatters'
import type { StorageAccountResponse } from '@/models/storageAccount/StorageAccount'
import type { StorageProviderResponse } from '@/models/storageProvider/StorageProvider'

interface AdminStorageAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: StorageAccountResponse
  providers: StorageProviderResponse[]
}

export function AdminStorageAccountDialog({
  open,
  onOpenChange,
  account,
  providers,
}: AdminStorageAccountDialogProps) {
  const createAccount = useCreateAdminAccount()
  const updateAccount = useUpdateAdminAccount()
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AdminStorageAccountValues>({
    resolver: zodResolver(adminStorageAccountSchema),
    defaultValues: { providerId: '', accountName: '', totalCapacityBytes: 1, priority: 1 },
  })
  const capacity = useWatch({ control, name: 'totalCapacityBytes' })
  useEffect(() => {
    if (!open) return
    reset({
      providerId:
        account?.providerId ?? providers.find((provider) => provider.isActive)?.providerId ?? '',
      accountName: account?.accountName ?? '',
      totalCapacityBytes: account?.totalCapacityBytes ?? 1,
      priority: account?.priority ?? 1,
    })
  }, [account, open, providers, reset])
  const submit = (values: AdminStorageAccountValues) => {
    const request = {
      accountName: values.accountName,
      totalCapacityBytes: values.totalCapacityBytes,
      priority: values.priority,
    }
    const options = {
      onSuccess: () => onOpenChange(false),
      onError: (reason: unknown) =>
        setError('root', {
          message: adminErrorMessage(reason, "We couldn't save this storage account right now."),
        }),
    }
    if (account)
      updateAccount.mutate({ storageAccountId: account.storageAccountId, request }, options)
    else createAccount.mutate({ providerId: values.providerId, ...request }, options)
  }
  const pending = createAccount.isPending || updateAccount.isPending
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (!pending || nextOpen) && onOpenChange(nextOpen)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{account ? 'Edit storage account' : 'Add storage account'}</DialogTitle>
          <DialogDescription>
            {account
              ? 'Provider assignment cannot be changed by the update contract.'
              : 'Only active providers can accept a new storage account.'}
          </DialogDescription>
        </DialogHeader>
        <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit(submit)} noValidate>
          <Controller
            control={control}
            name="providerId"
            render={({ field }) => (
              <AdminSelect
                id="account-provider"
                label="Provider"
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Choose provider"
                disabled={Boolean(account)}
                error={errors.providerId?.message}
                options={providers
                  .filter(
                    (provider) => provider.isActive || provider.providerId === account?.providerId,
                  )
                  .map((provider) => ({
                    value: provider.providerId,
                    label: `${provider.name} · ${provider.providerType}`,
                  }))}
              />
            )}
          />
          <AdminField
            id="account-name"
            label="Account name"
            maxLength={150}
            error={errors.accountName?.message}
            {...register('accountName')}
          />
          <AdminField
            id="account-capacity"
            label="Total capacity (bytes)"
            type="number"
            min="1"
            step="1"
            hint={
              Number.isFinite(capacity)
                ? `Formatted: ${formatBytes(capacity)}`
                : 'The backend request contract accepts bytes.'
            }
            error={errors.totalCapacityBytes?.message}
            {...register('totalCapacityBytes', { valueAsNumber: true })}
          />
          <AdminField
            id="account-priority"
            label="Priority"
            type="number"
            min="1"
            step="1"
            error={errors.priority?.message}
            {...register('priority', { valueAsNumber: true })}
          />
          {errors.root?.message ? <FormNotice>{errors.root.message}</FormNotice> : null}
          <DialogFooter className="sticky bottom-0 border-t border-border bg-card py-3">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={pending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving account' : 'Save account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
