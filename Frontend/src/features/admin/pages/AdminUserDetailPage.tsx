import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader'
import {
  AdminSectionError,
  AdminSectionSkeleton,
} from '@/features/admin/components/AdminSectionState'
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge'
import { AdminUserStatusDialog } from '@/features/admin/components/AdminUserStatusDialog'
import {
  useAdminUser,
  useAdminUserStorage,
  useAdminUserSubscriptions,
} from '@/features/admin/hooks/useAdminQueries'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import { formatBillingCycle, formatBytes, formatDate, formatPkr } from '@/lib/formatters'
import { subscriptionStatusLabel } from '@/features/subscriptions/lib/subscriptionPresentation'

export default function AdminUserDetailPage() {
  const { userId } = useParams()
  const user = useAdminUser(userId)
  const storage = useAdminUserStorage(userId)
  const subscriptions = useAdminUserSubscriptions(userId)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <Button asChild variant="ghost" className="w-fit px-3">
        <Link to="/admin/users">
          <ArrowLeft aria-hidden="true" size={17} /> Back to users
        </Link>
      </Button>
      {user.isPending ? (
        <AdminSectionSkeleton />
      ) : user.isError ? (
        <AdminSectionError
          title="User details are unavailable."
          description={adminErrorMessage(user.error, 'Refresh to request this user again.')}
          retry={() => user.refetch()}
          retrying={user.isFetching}
        />
      ) : (
        <>
          <AdminPageHeader
            eyebrow="User detail"
            title={`${user.data.firstName} ${user.data.lastName}`}
            description={user.data.email}
            actions={
              <Button
                type="button"
                variant={user.data.isActive ? 'ghost' : 'secondary'}
                className={user.data.isActive ? 'text-danger' : undefined}
                onClick={() => setConfirmOpen(true)}
              >
                {user.data.isActive ? 'Deactivate account' : 'Activate account'}
              </Button>
            }
          />
          <section className="grid gap-3 sm:grid-cols-3" aria-label="User account facts">
            <div className="min-w-0 rounded-lg bg-card p-4 shadow-rest">
              <p className="text-xs text-muted-foreground">Account status</p>
              <div className="mt-2">
                <AdminStatusBadge active={user.data.isActive} />
              </div>
            </div>
            <div className="min-w-0 rounded-lg bg-card p-4 shadow-rest">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="mt-2 truncate font-semibold text-foreground">
                {user.data.isVerified ? 'Verified' : 'Not verified'}
              </p>
            </div>
            <div className="min-w-0 rounded-lg bg-card p-4 shadow-rest">
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="mt-2 font-semibold text-foreground">
                {formatDate(user.data.createdAt)}
              </p>
            </div>
          </section>
        </>
      )}

      {storage.isPending ? (
        <AdminSectionSkeleton rows={2} />
      ) : storage.isError ? (
        <AdminSectionError
          title="User storage is unavailable."
          description={adminErrorMessage(
            storage.error,
            'Refresh to request this allocation again.',
          )}
          retry={() => storage.refetch()}
          retrying={storage.isFetching}
        />
      ) : (
        <section className="min-w-0 rounded-lg bg-card p-4 shadow-rest">
          <h2 className="font-display text-lg font-bold text-foreground">Storage allocation</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ['Allocated', storage.data.allocatedBytes],
              ['Used', storage.data.usedBytes],
              ['Available', storage.data.availableBytes],
            ].map(([label, value]) => (
              <div key={String(label)} className="min-w-0 rounded-md bg-card-muted p-3">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-1 truncate font-mono font-semibold text-foreground">
                  {formatBytes(Number(value))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {subscriptions.isPending ? (
        <AdminSectionSkeleton rows={2} />
      ) : subscriptions.isError ? (
        <AdminSectionError
          title="Subscriptions are unavailable."
          description={adminErrorMessage(
            subscriptions.error,
            'Refresh to request this user’s subscriptions again.',
          )}
          retry={() => subscriptions.refetch()}
          retrying={subscriptions.isFetching}
        />
      ) : (
        <section className="min-w-0 overflow-hidden rounded-lg bg-card p-4 shadow-rest">
          <h2 className="font-display text-lg font-bold text-foreground">Subscription history</h2>
          {subscriptions.data.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No subscriptions were returned for this user.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {subscriptions.data.map((subscription) => (
                <li
                  key={subscription.subscriptionId}
                  className="grid min-w-0 gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {subscription.storagePlanName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(subscription.storageSizeGb * 1024 ** 3)} ·{' '}
                      {formatBillingCycle(subscription.billingCycle)} ·{' '}
                      {formatPkr(subscription.price)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {subscriptionStatusLabel(subscription.status)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ends {formatDate(subscription.endDate)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      {user.data ? (
        <AdminUserStatusDialog user={user.data} open={confirmOpen} onOpenChange={setConfirmOpen} />
      ) : null}
    </div>
  )
}
