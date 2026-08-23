import { useState } from 'react'
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
import { FormNotice } from '@/features/auth/components/FormNotice'
import { useSetAdminUserActive } from '@/features/admin/hooks/useAdminMutations'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import type { AdminUser } from '@/models/admin/AdminUser'

interface AdminUserStatusDialogProps {
  user: AdminUser
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminUserStatusDialog({ user, open, onOpenChange }: AdminUserStatusDialogProps) {
  const mutation = useSetAdminUserActive()
  const [error, setError] = useState('')
  const nextActive = !user.isActive

  const submit = () => {
    setError('')
    mutation.mutate(
      { userId: user.userId, active: nextActive },
      {
        onSuccess: () => onOpenChange(false),
        onError: (reason) =>
          setError(adminErrorMessage(reason, "We couldn't update this account right now.")),
      },
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (!mutation.isPending || nextOpen) && onOpenChange(nextOpen)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{nextActive ? 'Activate account?' : 'Deactivate account?'}</DialogTitle>
          <DialogDescription>
            {nextActive
              ? `${user.firstName} ${user.lastName} will be able to authenticate again.`
              : `${user.firstName} ${user.lastName} will no longer be able to authenticate. Existing tokens remain governed by the backend.`}
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <div className="mt-4">
            <FormNotice>{error}</FormNotice>
          </div>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={mutation.isPending}>
              Keep current status
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={nextActive ? 'primary' : 'destructive'}
            disabled={mutation.isPending}
            onClick={submit}
          >
            {mutation.isPending
              ? 'Updating account'
              : nextActive
                ? 'Activate account'
                : 'Deactivate account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
