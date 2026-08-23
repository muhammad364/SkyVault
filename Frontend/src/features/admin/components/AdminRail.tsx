import {
  Boxes,
  CircleUserRound,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Mail,
  MoreHorizontal,
  PackageOpen,
  Users,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { BrandMark } from '@/components/brand/BrandMark'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogout } from '@/features/account/hooks/useLogout'
import { cn } from '@/lib/utils'

const primaryItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/plans', label: 'Plans', icon: PackageOpen },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/admin/infrastructure', label: 'Infrastructure', icon: Boxes },
]

const secondaryItems = [
  { to: '/admin/email', label: 'Email delivery', icon: Mail },
  { to: '/admin/audit', label: 'Audit log', icon: ListChecks },
  { to: '/admin/settings', label: 'Account settings', icon: CircleUserRound },
]

function railLinkClass(isActive: boolean) {
  return cn(
    'relative flex min-h-11 min-w-0 items-center justify-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition duration-default ease-vault hover:bg-card-muted hover:text-foreground lg:justify-start',
    isActive && 'bg-card-muted text-foreground',
  )
}

export function AdminRail() {
  const logout = useLogout()
  const navigate = useNavigate()

  const signOut = () =>
    logout.mutate(undefined, {
      onSettled: () =>
        navigate('/auth/login', { replace: true, state: { loginMode: 'admin' as const } }),
    })

  return (
    <nav
      aria-label="Administration navigation"
      className="fixed inset-x-3 bottom-3 z-40 rounded-full bg-card p-2 shadow-float md:sticky md:left-auto md:top-5 md:flex md:h-[calc(100dvh-2.5rem)] md:w-20 md:self-start md:flex-col md:overflow-hidden md:rounded-2xl md:p-3 lg:w-60"
    >
      <div className="hidden items-center gap-3 px-2 py-3 lg:flex">
        <BrandMark className="h-8 w-8 shrink-0" />
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold text-foreground">
            Sky<span className="text-brand">Vault</span>
          </p>
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Operations
          </p>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-1 md:flex md:flex-1 md:flex-col md:gap-1 md:pt-4">
        {primaryItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => railLinkClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'hidden h-6 w-1 rounded-full bg-brand md:absolute md:left-0 md:block',
                      !isActive && 'opacity-0',
                    )}
                  />
                  <Icon aria-hidden="true" className="shrink-0" size={19} />
                  <span className="sr-only lg:not-sr-only lg:truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="More admin options"
            >
              <MoreHorizontal aria-hidden="true" size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end">
            {secondaryItems.map((item) => {
              const Icon = item.icon
              return (
                <DropdownMenuItem key={item.to} asChild>
                  <NavLink to={item.to}>
                    <Icon aria-hidden="true" size={18} /> {item.label}
                  </NavLink>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive disabled={logout.isPending} onSelect={signOut}>
              <LogOut aria-hidden="true" size={18} />
              {logout.isPending ? 'Signing out' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="hidden border-t border-border pt-3 md:flex md:flex-col md:gap-1">
        {secondaryItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => railLinkClass(isActive)}
            >
              <Icon aria-hidden="true" className="shrink-0" size={19} />
              <span className="sr-only lg:not-sr-only lg:truncate">{item.label}</span>
            </NavLink>
          )
        })}
        <Button
          type="button"
          variant="secondary"
          className="px-3 text-danger hover:bg-border hover:text-danger lg:justify-start"
          disabled={logout.isPending}
          onClick={signOut}
        >
          <LogOut aria-hidden="true" size={19} />
          <span className="sr-only lg:not-sr-only">
            {logout.isPending ? 'Signing out' : 'Sign out'}
          </span>
        </Button>
      </div>
    </nav>
  )
}
