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
  useCreateEmailConfiguration,
  useUpdateEmailConfiguration,
} from '@/features/admin/hooks/useAdminMutations'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import {
  adminEmailConfigurationSchema,
  type AdminEmailConfigurationValues,
} from '@/features/admin/validators/admin.schemas'
import { FormNotice } from '@/features/auth/components/FormNotice'
import type { EmailConfigurationResponse } from '@/models/emailConfiguration/EmailConfiguration'

interface AdminEmailConfigurationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  configuration?: EmailConfigurationResponse
}

export function AdminEmailConfigurationDialog({
  open,
  onOpenChange,
  configuration,
}: AdminEmailConfigurationDialogProps) {
  const createConfiguration = useCreateEmailConfiguration()
  const updateConfiguration = useUpdateEmailConfiguration()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AdminEmailConfigurationValues>({
    resolver: zodResolver(adminEmailConfigurationSchema),
    defaultValues: {
      smtpHost: '',
      smtpPort: 587,
      useSsl: true,
      requiresAuthentication: true,
      senderEmail: '',
      senderDisplayName: '',
      username: '',
      password: '',
      isActive: true,
    },
  })
  useEffect(() => {
    if (!open) return
    reset({
      smtpHost: configuration?.smtpHost ?? '',
      smtpPort: configuration?.smtpPort ?? 587,
      useSsl: configuration?.useSsl ?? true,
      requiresAuthentication: configuration?.requiresAuthentication ?? true,
      senderEmail: configuration?.senderEmail ?? '',
      senderDisplayName: configuration?.senderDisplayName ?? '',
      username: configuration?.username ?? '',
      password: '',
      isActive: configuration?.isActive ?? true,
    })
  }, [configuration, open, reset])
  const submit = (values: AdminEmailConfigurationValues) => {
    const common = {
      smtpHost: values.smtpHost,
      smtpPort: values.smtpPort,
      useSsl: values.useSsl,
      requiresAuthentication: values.requiresAuthentication,
      senderEmail: values.senderEmail,
      senderDisplayName: values.senderDisplayName.trim() || null,
      username: values.username.trim() || null,
      password: values.password || null,
    }
    const options = {
      onSuccess: () => onOpenChange(false),
      onError: (reason: unknown) =>
        setError('root', {
          message: adminErrorMessage(
            reason,
            "We couldn't save this email configuration right now.",
          ),
        }),
    }
    if (configuration)
      updateConfiguration.mutate(
        { emailConfigurationId: configuration.emailConfigurationId, request: common },
        options,
      )
    else createConfiguration.mutate({ ...common, isActive: values.isActive }, options)
  }
  const pending = createConfiguration.isPending || updateConfiguration.isPending
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (!pending || nextOpen) && onOpenChange(nextOpen)}
    >
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {configuration ? 'Edit email configuration' : 'Add email configuration'}
          </DialogTitle>
          <DialogDescription>
            Passwords are write-only: SkyVault sends them to the API and never receives, displays,
            or persists them.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
            <AdminField
              id="smtp-host"
              label="SMTP host"
              error={errors.smtpHost?.message}
              {...register('smtpHost')}
            />
            <AdminField
              id="smtp-port"
              label="SMTP port"
              type="number"
              min="1"
              max="65535"
              step="1"
              error={errors.smtpPort?.message}
              {...register('smtpPort', { valueAsNumber: true })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField
              id="sender-email"
              label="Sender email"
              type="email"
              error={errors.senderEmail?.message}
              {...register('senderEmail')}
            />
            <AdminField
              id="sender-name"
              label="Sender display name"
              error={errors.senderDisplayName?.message}
              {...register('senderDisplayName')}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField
              id="smtp-username"
              label="SMTP username"
              error={errors.username?.message}
              {...register('username')}
            />
            <AdminField
              id="smtp-password"
              label={configuration ? 'SMTP password (enter again)' : 'SMTP password'}
              type="password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex min-h-11 items-center gap-3 rounded-md bg-card-muted px-3 text-sm font-semibold text-foreground">
              <input type="checkbox" {...register('useSsl')} /> Use SSL
            </label>
            <label className="flex min-h-11 items-center gap-3 rounded-md bg-card-muted px-3 text-sm font-semibold text-foreground">
              <input type="checkbox" {...register('requiresAuthentication')} /> Requires
              authentication
            </label>
            {!configuration ? (
              <label className="flex min-h-11 items-center gap-3 rounded-md bg-card-muted px-3 text-sm font-semibold text-foreground">
                <input type="checkbox" {...register('isActive')} /> Active on creation
              </label>
            ) : null}
          </div>
          {errors.root?.message ? <FormNotice>{errors.root.message}</FormNotice> : null}
          <DialogFooter className="sticky bottom-0 border-t border-border bg-card py-3">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={pending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving configuration' : 'Save configuration'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
