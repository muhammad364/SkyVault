import { ArrowRight, Database, PackageOpen, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import {
  StorageCapacityChart,
  SystemActivityChart,
} from '@/features/admin/components/AdminDashboardCharts'
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader'
import {
  AdminSectionError,
  AdminSectionSkeleton,
} from '@/features/admin/components/AdminSectionState'
import {
  useAdminAuditLogs,
  useAdminStatistics,
  useAdminStorageOverview,
} from '@/features/admin/hooks/useAdminQueries'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import { formatBytes, formatRelativeDate } from '@/lib/formatters'

const recentAuditFilters = {
  administratorId: null,
  action: null,
  performedFrom: null,
  performedTo: null,
  skip: 0,
  take: 5,
} as const

export default function AdminDashboardPage() {
  const statistics = useAdminStatistics()
  const storage = useAdminStorageOverview()
  const audit = useAdminAuditLogs(recentAuditFilters)

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <AdminPageHeader
        eyebrow="System overview"
        title="Operations, at a glance."
        description="Live account, plan, subscription, storage, and audit facts from the administration APIs."
      />

      {statistics.isPending ? (
        <AdminSectionSkeleton />
      ) : statistics.isError ? (
        <AdminSectionError
          title="System statistics are unavailable."
          description={adminErrorMessage(
            statistics.error,
            'Refresh to request the statistics again.',
          )}
          retry={() => statistics.refetch()}
          retrying={statistics.isFetching}
        />
      ) : (
        <section className="grid min-w-0 gap-3 sm:grid-cols-3" aria-label="System statistics">
          {[
            {
              label: 'Users',
              value: statistics.data.totalUsers,
              detail: `${statistics.data.activeUsers} active`,
              icon: Users,
            },
            {
              label: 'Storage plans',
              value: statistics.data.totalStoragePlans,
              detail: `${statistics.data.activeStoragePlans} active`,
              icon: PackageOpen,
            },
            {
              label: 'Subscriptions',
              value: statistics.data.totalSubscriptions,
              detail: `${statistics.data.activeSubscriptions} active`,
              icon: Database,
            },
          ].map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.label} className="min-w-0 overflow-hidden p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="mt-2 font-mono text-2xl font-bold text-foreground">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
                  </div>
                  <span className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-card-muted text-primary">
                    <Icon aria-hidden="true" size={18} />
                  </span>
                </div>
              </Card>
            )
          })}
        </section>
      )}

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <section className="min-w-0 overflow-hidden rounded-lg bg-card p-4 shadow-rest">
          <h2 className="font-display text-lg font-bold text-foreground">Platform records</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Active versus other returned records.
          </p>
          {statistics.data ? <SystemActivityChart statistics={statistics.data} /> : null}
        </section>

        {storage.isPending ? (
          <AdminSectionSkeleton />
        ) : storage.isError ? (
          <AdminSectionError
            title="Storage overview is unavailable."
            description={adminErrorMessage(
              storage.error,
              'Refresh to request storage totals again.',
            )}
            retry={() => storage.refetch()}
            retrying={storage.isFetching}
          />
        ) : (
          <section className="min-w-0 overflow-hidden rounded-lg bg-card p-4 shadow-rest">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-lg font-bold text-foreground">Storage posture</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Exact platform totals returned by the API.
                </p>
              </div>
              <p className="shrink-0 font-mono text-sm font-semibold text-foreground">
                <span className="sr-only">Total physical capacity </span>
                {formatBytes(storage.data.totalPhysicalCapacityBytes)}
              </p>
            </div>
            <StorageCapacityChart overview={storage.data} />
            <dl className="grid gap-2 text-xs sm:grid-cols-3">
              <div className="min-w-0 rounded-md bg-card-muted p-3">
                <dt className="truncate text-muted-foreground">Allocated</dt>
                <dd className="mt-1 truncate font-mono font-semibold text-foreground">
                  {formatBytes(storage.data.totalAllocatedBytes)}
                </dd>
              </div>
              <div className="min-w-0 rounded-md bg-card-muted p-3">
                <dt className="truncate text-muted-foreground">Used</dt>
                <dd className="mt-1 truncate font-mono font-semibold text-foreground">
                  {formatBytes(storage.data.totalUsedBytes)}
                </dd>
              </div>
              <div className="min-w-0 rounded-md bg-card-muted p-3">
                <dt className="truncate text-muted-foreground">Available</dt>
                <dd className="mt-1 truncate font-mono font-semibold text-foreground">
                  {formatBytes(storage.data.totalAvailableBytes)}
                </dd>
              </div>
            </dl>
          </section>
        )}
      </div>

      <section className="min-w-0 overflow-hidden rounded-lg bg-card p-4 shadow-rest">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-foreground">
              Recent administrative work
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              The five newest returned audit entries.
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-semibold text-primary hover:bg-card-muted"
            to="/admin/audit"
          >
            Audit log <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        {audit.isPending ? (
          <div className="mt-4">
            <AdminSectionSkeleton rows={2} />
          </div>
        ) : audit.isError ? (
          <div className="mt-4">
            <AdminSectionError
              title="Recent work is unavailable."
              description={adminErrorMessage(
                audit.error,
                'Refresh to request audit entries again.',
              )}
              retry={() => audit.refetch()}
              retrying={audit.isFetching}
            />
          </div>
        ) : audit.data.length === 0 ? (
          <p className="mt-4 rounded-md bg-card-muted p-4 text-sm text-muted-foreground">
            No audit entries were returned.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {audit.data.map((entry) => (
              <li
                key={entry.auditLogId}
                className="flex min-w-0 flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{entry.action}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {entry.administratorEmail} · {entry.entityType}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-muted-foreground" dateTime={entry.createdAt}>
                  {formatRelativeDate(entry.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
