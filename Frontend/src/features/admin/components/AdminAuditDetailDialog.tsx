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
import {
  AdminSectionError,
  AdminSectionSkeleton,
} from '@/features/admin/components/AdminSectionState'
import { useAdminAuditLog } from '@/features/admin/hooks/useAdminQueries'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import { formatDate } from '@/lib/formatters'

export function AdminAuditDetailDialog({
  auditLogId,
  onOpenChange,
}: {
  auditLogId: string | null
  onOpenChange: (open: boolean) => void
}) {
  const auditLog = useAdminAuditLog(auditLogId)
  return (
    <Dialog open={Boolean(auditLogId)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Audit entry</DialogTitle>
          <DialogDescription>
            The immutable administrative action details returned by the audit endpoint.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-5">
          {auditLog.isPending ? (
            <AdminSectionSkeleton rows={3} />
          ) : auditLog.isError ? (
            <AdminSectionError
              title="Audit entry is unavailable."
              description={adminErrorMessage(
                auditLog.error,
                'Refresh to request this entry again.',
              )}
              retry={() => auditLog.refetch()}
              retrying={auditLog.isFetching}
            />
          ) : (
            <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
              {[
                ['Action', auditLog.data.action],
                ['Administrator', auditLog.data.administratorEmail],
                ['Entity type', auditLog.data.entityType],
                ['Performed', formatDate(auditLog.data.createdAt)],
                ['Description', auditLog.data.description || 'No description was returned.'],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className={`min-w-0 rounded-md bg-card-muted p-3 ${index === 4 ? 'sm:col-span-2' : ''}`}
                >
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-foreground">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
