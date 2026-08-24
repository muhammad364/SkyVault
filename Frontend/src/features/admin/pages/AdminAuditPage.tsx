import { ListChecks, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { AdminAuditDetailDialog } from '@/features/admin/components/AdminAuditDetailDialog'
import { AdminField } from '@/features/admin/components/AdminField'
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader'
import {
  AdminSectionError,
  AdminSectionSkeleton,
} from '@/features/admin/components/AdminSectionState'
import { useAdminAuditLogs } from '@/features/admin/hooks/useAdminQueries'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import { formatDate } from '@/lib/formatters'
import type { AuditLogFilters } from '@/models/admin/AuditLog'

const initialFilters: AuditLogFilters = {
  administratorId: null,
  action: null,
  performedFrom: null,
  performedTo: null,
  skip: 0,
  take: 25,
}

function toIsoOrNull(value: string) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export default function AdminAuditPage() {
  const [filters, setFilters] = useState<AuditLogFilters>(initialFilters)
  const [administratorId, setAdministratorId] = useState('')
  const [action, setAction] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const logs = useAdminAuditLogs(filters)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    setFilters({
      administratorId: administratorId.trim() || null,
      action: action.trim() || null,
      performedFrom: toIsoOrNull(from),
      performedTo: toIsoOrNull(to),
      skip: 0,
      take: 25,
    })
  }
  const clear = () => {
    setAdministratorId('')
    setAction('')
    setFrom('')
    setTo('')
    setFilters(initialFilters)
  }
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <AdminPageHeader
        eyebrow="Platform monitoring"
        title="Administrative audit log."
        description="Filter the server-side audit feed by the exact administrator, action, and performed-date parameters exposed by the controller."
      />
      <form
        className="grid min-w-0 gap-3 rounded-lg bg-card p-4 shadow-rest md:grid-cols-2 xl:grid-cols-4"
        onSubmit={submit}
      >
        <AdminField
          id="audit-admin"
          label="Administrator ID"
          placeholder="Optional GUID"
          value={administratorId}
          onChange={(event) => setAdministratorId(event.target.value)}
        />
        <AdminField
          id="audit-action"
          label="Action"
          placeholder="Exact or partial action"
          value={action}
          onChange={(event) => setAction(event.target.value)}
        />
        <div className="grid min-w-0 gap-2 text-sm font-semibold text-foreground">
          <span id="audit-from-label">Performed from</span>
          <DatePicker
            id="audit-from"
            aria-labelledby="audit-from-label"
            kind="datetime-local"
            defaultTime="00:00"
            max={to || undefined}
            value={from}
            onChange={setFrom}
          />
        </div>
        <div className="grid min-w-0 gap-2 text-sm font-semibold text-foreground">
          <span id="audit-to-label">Performed to</span>
          <DatePicker
            id="audit-to"
            aria-labelledby="audit-to-label"
            kind="datetime-local"
            defaultTime="23:59"
            min={from || undefined}
            value={to}
            onChange={setTo}
          />
        </div>
        <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-4">
          <Button type="submit">
            <Search aria-hidden="true" size={17} /> Apply filters
          </Button>
          <Button type="button" variant="ghost" onClick={clear}>
            Clear
          </Button>
        </div>
      </form>
      {logs.isPending ? (
        <AdminSectionSkeleton rows={5} />
      ) : logs.isError ? (
        <AdminSectionError
          title="Audit logs are unavailable."
          description={adminErrorMessage(
            logs.error,
            'Check the filter values or refresh the audit request.',
          )}
          retry={() => logs.refetch()}
          retrying={logs.isFetching}
        />
      ) : logs.data.length === 0 ? (
        <EmptyState
          title="No audit entries were returned."
          description="Clear or adjust the server-side audit filters."
          illustration={
            <span className="flex min-h-16 min-w-16 items-center justify-center rounded-full bg-card-muted text-primary">
              <ListChecks aria-hidden="true" size={24} />
            </span>
          }
          actionLabel="Clear filters"
          onAction={clear}
        />
      ) : (
        <section
          className="min-w-0 overflow-hidden rounded-lg bg-card shadow-rest"
          aria-label="Audit entries"
        >
          <ul className="divide-y divide-border md:hidden">
            {logs.data.map((log) => (
              <li key={log.auditLogId} className="min-w-0 p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{log.action}</p>
                  <p className="break-all text-xs text-muted-foreground">
                    {log.administratorEmail}
                  </p>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {log.description || 'No description returned.'}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {log.entityType} · {formatDate(log.createdAt)}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setSelectedId(log.auditLogId)}
                  >
                    View
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-card-muted text-xs uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Administrator</th>
                  <th className="px-4 py-3 font-semibold">Entity</th>
                  <th className="px-4 py-3 font-semibold">Performed</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.data.map((log) => (
                  <tr key={log.auditLogId} className="hover:bg-card-muted">
                    <td className="max-w-56 px-4 py-3">
                      <p className="truncate font-semibold text-foreground">{log.action}</p>
                      <p className="truncate text-xs text-muted-foreground">{log.description}</p>
                    </td>
                    <td className="max-w-48 truncate px-4 py-3 text-muted-foreground">
                      {log.administratorEmail}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{log.entityType}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(log.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSelectedId(log.auditLogId)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={filters.skip === 0}
          onClick={() =>
            setFilters((current) => ({
              ...current,
              skip: Math.max(0, current.skip - current.take),
            }))
          }
        >
          Previous
        </Button>
        <p className="text-xs text-muted-foreground">
          Showing offset <span className="font-mono">{filters.skip}</span>
        </p>
        <Button
          type="button"
          variant="secondary"
          disabled={(logs.data?.length ?? 0) < filters.take}
          onClick={() =>
            setFilters((current) => ({ ...current, skip: current.skip + current.take }))
          }
        >
          Next
        </Button>
      </div>
      <AdminAuditDetailDialog
        auditLogId={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  )
}
