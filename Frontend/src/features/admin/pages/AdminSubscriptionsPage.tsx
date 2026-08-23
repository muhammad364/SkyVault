import { CreditCard, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader'
import {
  AdminSectionError,
  AdminSectionSkeleton,
} from '@/features/admin/components/AdminSectionState'
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge'
import { AdminSubscriptionDialog } from '@/features/admin/components/AdminSubscriptionDialog'
import { useAdminSubscriptions, useAdminUsers } from '@/features/admin/hooks/useAdminQueries'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import { subscriptionStatusLabel } from '@/features/subscriptions/lib/subscriptionPresentation'
import { formatDate, formatPkr } from '@/lib/formatters'
import { SubscriptionStatus } from '@/models/subscription/SubscriptionStatus'

export default function AdminSubscriptionsPage() {
  const subscriptions = useAdminSubscriptions()
  const users = useAdminUsers()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const userNames = useMemo(
    () =>
      new Map(
        (users.data ?? []).map((user) => [user.userId, `${user.firstName} ${user.lastName}`]),
      ),
    [users.data],
  )
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return (subscriptions.data ?? []).filter((subscription) => {
      const name = userNames.get(subscription.userId) ?? ''
      return (
        (!needle ||
          subscription.storagePlanName.toLocaleLowerCase().includes(needle) ||
          name.toLocaleLowerCase().includes(needle)) &&
        (status === 'all' || String(subscription.status) === status)
      )
    })
  }, [query, status, subscriptions.data, userNames])

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <AdminPageHeader
        eyebrow="Subscription monitoring"
        title="Plans in service."
        description="Read-only subscription records from the admin subscription endpoints. Lifecycle changes remain user-owned because no admin mutation exists."
      />
      <section
        className="grid gap-3 rounded-lg bg-card p-4 shadow-rest sm:grid-cols-[minmax(0,1fr)_11rem]"
        aria-label="Subscription filters"
      >
        <label className="relative min-w-0" htmlFor="subscription-text-filter">
          <span className="sr-only">Filter by user or plan</span>
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            id="subscription-text-filter"
            className="pl-10"
            placeholder="Filter user or plan"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label htmlFor="subscription-status-filter">
          <span className="sr-only">Filter subscription status</span>
          <select
            id="subscription-status-filter"
            className="min-h-11 w-full rounded-md border border-border bg-card px-3 text-base text-foreground sm:text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value={SubscriptionStatus.Active}>Active</option>
            <option value={SubscriptionStatus.Expired}>Expired</option>
            <option value={SubscriptionStatus.Cancelled}>Cancelled</option>
          </select>
        </label>
      </section>
      {subscriptions.isPending ? (
        <AdminSectionSkeleton rows={5} />
      ) : subscriptions.isError ? (
        <AdminSectionError
          title="Subscriptions are unavailable."
          description={adminErrorMessage(
            subscriptions.error,
            'Refresh to request subscription records again.',
          )}
          retry={() => subscriptions.refetch()}
          retrying={subscriptions.isFetching}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={
            subscriptions.data.length === 0
              ? 'No subscriptions were returned.'
              : 'No subscriptions match these filters.'
          }
          description="Adjust the local plan, user, or status filter."
          illustration={
            <span className="flex min-h-16 min-w-16 items-center justify-center rounded-full bg-card-muted text-primary">
              <CreditCard aria-hidden="true" size={24} />
            </span>
          }
          actionLabel={subscriptions.data.length === 0 ? 'Refresh subscriptions' : 'Clear filters'}
          onAction={() => {
            if (subscriptions.data.length === 0) void subscriptions.refetch()
            else {
              setQuery('')
              setStatus('all')
            }
          }}
        />
      ) : (
        <section
          className="min-w-0 overflow-hidden rounded-lg bg-card shadow-rest"
          aria-label="Subscriptions"
        >
          <ul className="divide-y divide-border md:hidden">
            {filtered.map((subscription) => (
              <li key={subscription.subscriptionId} className="min-w-0 p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {subscription.storagePlanName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {userNames.get(subscription.userId) ??
                        (users.isError ? 'User name unavailable' : 'Loading user name')}
                    </p>
                  </div>
                  <AdminStatusBadge
                    active={subscription.status === SubscriptionStatus.Active}
                    activeLabel={subscriptionStatusLabel(subscription.status)}
                    inactiveLabel={subscriptionStatusLabel(subscription.status)}
                  />
                </div>
                <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                  <span>{formatPkr(subscription.price)}</span>
                  <span>Ends {formatDate(subscription.endDate)}</span>
                </div>
                <Button
                  className="mt-3"
                  type="button"
                  variant="secondary"
                  onClick={() => setSelectedId(subscription.subscriptionId)}
                >
                  View record
                </Button>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-card-muted text-xs uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Plan</th>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Dates</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((subscription) => (
                  <tr key={subscription.subscriptionId} className="hover:bg-card-muted">
                    <td className="max-w-44 px-4 py-3">
                      <p className="truncate font-semibold text-foreground">
                        {subscription.storagePlanName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {subscription.storageSizeGb} GB
                      </p>
                    </td>
                    <td className="max-w-44 truncate px-4 py-3 text-muted-foreground">
                      {userNames.get(subscription.userId) ??
                        (users.isError ? 'Unavailable' : 'Loading')}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(subscription.startDate)} – {formatDate(subscription.endDate)}
                    </td>
                    <td className="px-4 py-3 font-mono text-foreground">
                      {formatPkr(subscription.price)}
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge
                        active={subscription.status === SubscriptionStatus.Active}
                        activeLabel={subscriptionStatusLabel(subscription.status)}
                        inactiveLabel={subscriptionStatusLabel(subscription.status)}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSelectedId(subscription.subscriptionId)}
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
      <AdminSubscriptionDialog
        subscriptionId={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  )
}
