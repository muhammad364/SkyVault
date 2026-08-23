import { Mail, Plus } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { AdminConfirmDialog } from '@/features/admin/components/AdminConfirmDialog'
import { AdminEmailConfigurationDialog } from '@/features/admin/components/AdminEmailConfigurationDialog'
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader'
import {
  AdminSectionError,
  AdminSectionSkeleton,
} from '@/features/admin/components/AdminSectionState'
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge'
import {
  useDeleteEmailConfiguration,
  useSetEmailConfigurationActive,
} from '@/features/admin/hooks/useAdminMutations'
import { useAdminEmailConfigurations } from '@/features/admin/hooks/useAdminQueries'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import { formatDate } from '@/lib/formatters'
import type { EmailConfigurationResponse } from '@/models/emailConfiguration/EmailConfiguration'

type ConfirmTarget = { action: 'status' | 'delete'; configuration: EmailConfigurationResponse }

export default function AdminEmailPage() {
  const configurations = useAdminEmailConfigurations()
  const setActive = useSetEmailConfigurationActive()
  const remove = useDeleteEmailConfiguration()
  const [editing, setEditing] = useState<EmailConfigurationResponse | 'new' | null>(null)
  const [confirm, setConfirm] = useState<ConfirmTarget | null>(null)
  const [actionError, setActionError] = useState('')
  const submitConfirm = () => {
    if (!confirm) return
    const options = {
      onSuccess: () => setConfirm(null),
      onError: (error: unknown) =>
        setActionError(
          adminErrorMessage(error, "We couldn't update this email configuration right now."),
        ),
    }
    if (confirm.action === 'delete')
      remove.mutate(confirm.configuration.emailConfigurationId, options)
    else
      setActive.mutate(
        {
          emailConfigurationId: confirm.configuration.emailConfigurationId,
          active: !confirm.configuration.isActive,
        },
        options,
      )
  }
  const destructive = confirm?.action === 'delete' || confirm?.configuration.isActive === true
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <AdminPageHeader
        eyebrow="Operational settings"
        title="Email delivery."
        description="Manage SMTP configurations through the role-restricted controller. Activating one configuration deactivates the previously active configuration on the backend."
        actions={
          <Button type="button" onClick={() => setEditing('new')}>
            <Plus aria-hidden="true" size={18} /> Add configuration
          </Button>
        }
      />
      {configurations.isPending ? (
        <AdminSectionSkeleton rows={4} />
      ) : configurations.isError ? (
        <AdminSectionError
          title="Email configurations are unavailable."
          description={adminErrorMessage(
            configurations.error,
            'Refresh to request delivery settings again.',
          )}
          retry={() => configurations.refetch()}
          retrying={configurations.isFetching}
        />
      ) : configurations.data.length === 0 ? (
        <EmptyState
          title="No email configuration was returned."
          description="Add an SMTP configuration before email delivery can use this admin-managed source."
          illustration={
            <span className="flex min-h-16 min-w-16 items-center justify-center rounded-full bg-card-muted text-primary">
              <Mail aria-hidden="true" size={24} />
            </span>
          }
          actionLabel="Add configuration"
          onAction={() => setEditing('new')}
        />
      ) : (
        <section className="grid min-w-0 gap-3 lg:grid-cols-2" aria-label="Email configurations">
          {configurations.data.map((configuration) => (
            <article
              key={configuration.emailConfigurationId}
              className="min-w-0 overflow-hidden rounded-lg bg-card p-4 shadow-rest"
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-foreground">
                    {configuration.senderDisplayName || configuration.senderEmail}
                  </h2>
                  <p className="break-all text-xs text-muted-foreground">
                    {configuration.senderEmail}
                  </p>
                </div>
                <AdminStatusBadge active={configuration.isActive} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="min-w-0 rounded-md bg-card-muted p-3">
                  <dt className="text-muted-foreground">SMTP host</dt>
                  <dd className="mt-1 truncate font-semibold text-foreground">
                    {configuration.smtpHost}:{configuration.smtpPort}
                  </dd>
                </div>
                <div className="min-w-0 rounded-md bg-card-muted p-3">
                  <dt className="text-muted-foreground">Security</dt>
                  <dd className="mt-1 truncate font-semibold text-foreground">
                    {configuration.useSsl ? 'SSL' : 'No SSL'} ·{' '}
                    {configuration.requiresAuthentication ? 'Authenticated' : 'No authentication'}
                  </dd>
                </div>
                <div className="min-w-0 rounded-md bg-card-muted p-3">
                  <dt className="text-muted-foreground">Username</dt>
                  <dd className="mt-1 truncate font-semibold text-foreground">
                    {configuration.username || 'Not provided'}
                  </dd>
                </div>
                <div className="min-w-0 rounded-md bg-card-muted p-3">
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd className="mt-1 truncate font-semibold text-foreground">
                    {formatDate(configuration.updatedAt)}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={() => setEditing(configuration)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={configuration.isActive ? 'text-danger' : undefined}
                  onClick={() => {
                    setActionError('')
                    setConfirm({ action: 'status', configuration })
                  }}
                >
                  {configuration.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-danger"
                  onClick={() => {
                    setActionError('')
                    setConfirm({ action: 'delete', configuration })
                  }}
                >
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </section>
      )}
      <AdminEmailConfigurationDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        configuration={editing && editing !== 'new' ? editing : undefined}
      />
      {confirm ? (
        <AdminConfirmDialog
          open
          onOpenChange={(open) => !open && setConfirm(null)}
          title={
            confirm.action === 'delete'
              ? 'Delete email configuration?'
              : `${confirm.configuration.isActive ? 'Deactivate' : 'Activate'} email configuration?`
          }
          description={
            confirm.action === 'delete'
              ? 'This permanently removes the selected SMTP configuration. The controller exposes no restore action.'
              : confirm.configuration.isActive
                ? 'Email delivery will no longer use this configuration as active.'
                : 'The backend will make this configuration active and deactivate the previously active configuration.'
          }
          confirmLabel={
            confirm.action === 'delete'
              ? 'Delete configuration'
              : confirm.configuration.isActive
                ? 'Deactivate'
                : 'Activate'
          }
          pendingLabel="Updating configuration"
          pending={setActive.isPending || remove.isPending}
          destructive={destructive}
          error={actionError}
          onConfirm={submitConfirm}
        />
      ) : null}
    </div>
  )
}
