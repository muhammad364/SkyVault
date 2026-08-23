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
import {
  useCreateAdminProvider,
  useUpdateAdminProvider,
} from '@/features/admin/hooks/useAdminMutations'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import {
  adminProviderSchema,
  type AdminProviderValues,
} from '@/features/admin/validators/admin.schemas'
import { FormNotice } from '@/features/auth/components/FormNotice'
import type { StorageProviderResponse } from '@/models/storageProvider/StorageProvider'

interface AdminProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider?: StorageProviderResponse
}

export function AdminProviderDialog({ open, onOpenChange, provider }: AdminProviderDialogProps) {
  const createProvider = useCreateAdminProvider()
  const updateProvider = useUpdateAdminProvider()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AdminProviderValues>({
    resolver: zodResolver(adminProviderSchema),
    defaultValues: { name: '', providerType: '' },
  })
  useEffect(() => {
    if (open) reset({ name: provider?.name ?? '', providerType: provider?.providerType ?? '' })
  }, [open, provider, reset])
  const submit = (values: AdminProviderValues) => {
    const options = {
      onSuccess: () => onOpenChange(false),
      onError: (reason: unknown) =>
        setError('root', {
          message: adminErrorMessage(reason, "We couldn't save this provider right now."),
        }),
    }
    if (provider)
      updateProvider.mutate(
        { providerId: provider.providerId, request: { name: values.name } },
        options,
      )
    else createProvider.mutate(values, options)
  }
  const pending = createProvider.isPending || updateProvider.isPending
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (!pending || nextOpen) && onOpenChange(nextOpen)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{provider ? 'Edit provider' : 'Add provider'}</DialogTitle>
          <DialogDescription>
            {provider
              ? 'The backend update contract permits changing only the provider name.'
              : 'Add the exact provider name and provider type accepted by the API.'}
          </DialogDescription>
        </DialogHeader>
        <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit(submit)} noValidate>
          <AdminField
            id="provider-name"
            label="Provider name"
            maxLength={100}
            error={errors.name?.message}
            {...register('name')}
          />
          <AdminField
            id="provider-type"
            label="Provider type"
            maxLength={50}
            readOnly={Boolean(provider)}
            error={errors.providerType?.message}
            {...register('providerType')}
          />
          {errors.root?.message ? <FormNotice>{errors.root.message}</FormNotice> : null}
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={pending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving provider' : 'Save provider'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
