import { Search, UserRoundCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader'
import {
  AdminSectionError,
  AdminSectionSkeleton,
} from '@/features/admin/components/AdminSectionState'
import { AdminStatusBadge } from '@/features/admin/components/AdminStatusBadge'
import { AdminUserStatusDialog } from '@/features/admin/components/AdminUserStatusDialog'
import { useAdminUsers } from '@/features/admin/hooks/useAdminQueries'
import { adminErrorMessage } from '@/features/admin/lib/adminErrorMessage'
import { formatDate } from '@/lib/formatters'
import type { AdminUser } from '@/models/admin/AdminUser'

export default function AdminUsersPage() {
  const users = useAdminUsers()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [selected, setSelected] = useState<AdminUser | null>(null)
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return (users.data ?? []).filter((user) => {
      const matchesText =
        !needle ||
        `${user.firstName} ${user.lastName}`.toLocaleLowerCase().includes(needle) ||
        user.email.toLocaleLowerCase().includes(needle)
      const matchesStatus =
        status === 'all' || (status === 'active' ? user.isActive : !user.isActive)
      return matchesText && matchesStatus
    })
  }, [query, status, users.data])

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <AdminPageHeader
        eyebrow="User management"
        title="Accounts and access."
        description="Review returned user records and change only the active account flag exposed by the admin controller."
      />
      <section
        className="grid gap-3 rounded-lg bg-card p-4 shadow-rest sm:grid-cols-[minmax(0,1fr)_11rem]"
        aria-label="User filters"
      >
        <label className="relative min-w-0" htmlFor="user-text-filter">
          <span className="sr-only">Filter users by name or email</span>
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            id="user-text-filter"
            className="pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter name or email"
          />
        </label>
        <Select
          id="user-status-filter"
          aria-label="Filter users by account status"
          value={status}
          onValueChange={(value) => setStatus(value as typeof status)}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      </section>

      {users.isPending ? (
        <AdminSectionSkeleton rows={5} />
      ) : users.isError ? (
        <AdminSectionError
          title="Users are unavailable."
          description={adminErrorMessage(users.error, 'Refresh to request user accounts again.')}
          retry={() => users.refetch()}
          retrying={users.isFetching}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={
            users.data.length === 0 ? 'No users were returned.' : 'No users match these filters.'
          }
          description={
            users.data.length === 0
              ? 'The admin users endpoint returned an empty collection.'
              : 'Adjust the local name, email, or status filter.'
          }
          illustration={
            <span className="flex min-h-16 min-w-16 items-center justify-center rounded-full bg-card-muted text-primary">
              <UserRoundCheck aria-hidden="true" size={24} />
            </span>
          }
          actionLabel={users.data.length === 0 ? 'Refresh users' : 'Clear filters'}
          onAction={() => {
            if (users.data.length === 0) void users.refetch()
            else {
              setQuery('')
              setStatus('all')
            }
          }}
        />
      ) : (
        <section
          className="min-w-0 overflow-hidden rounded-lg bg-card shadow-rest"
          aria-label="User accounts"
        >
          <ul className="divide-y divide-border md:hidden">
            {filtered.map((user) => (
              <li key={user.userId} className="min-w-0 p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="break-all text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <AdminStatusBadge active={user.isActive} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{user.isVerified ? 'Verified email' : 'Unverified email'}</span>
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild variant="secondary">
                    <Link to={`/admin/users/${user.userId}`}>View details</Link>
                  </Button>
                  <Button
                    type="button"
                    variant={user.isActive ? 'ghost' : 'secondary'}
                    className={user.isActive ? 'text-danger' : undefined}
                    onClick={() => setSelected(user)}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-card-muted text-xs uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Email verification</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((user) => (
                  <tr key={user.userId} className="hover:bg-card-muted">
                    <td className="max-w-52 px-4 py-3">
                      <p className="truncate font-semibold text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.isVerified ? 'Verified' : 'Not verified'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge active={user.isActive} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost">
                          <Link to={`/admin/users/${user.userId}`}>View</Link>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className={user.isActive ? 'text-danger' : undefined}
                          onClick={() => setSelected(user)}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {selected ? (
        <AdminUserStatusDialog
          user={selected}
          open
          onOpenChange={(open) => !open && setSelected(null)}
        />
      ) : null}
    </div>
  )
}
