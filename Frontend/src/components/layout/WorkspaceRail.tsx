import {
  Archive,
  CircleUserRound,
  Folder,
  HardDrive,
  Home,
  LogOut,
  Search,
  Settings,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { BrandMark } from '@/components/brand/BrandMark'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/features/account/hooks/useLogout'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/vault', label: 'Vault', icon: Home, end: true },
  { to: '/vault/storage', label: 'Storage', icon: HardDrive },
  { to: '/vault/files', label: 'Files', icon: Folder },
  { to: '/vault/search', label: 'Search', icon: Search },
  { to: '/vault/trash', label: 'Trash', icon: Archive },
]

export function WorkspaceRail() {
  const logout = useLogout()
  const navigate = useNavigate()

  return (
    <nav
      aria-label="Vault navigation"
      className="fixed inset-x-3 bottom-3 z-40 rounded-full bg-card p-2 shadow-float md:sticky md:left-auto md:top-5 md:flex md:h-[calc(100dvh-2.5rem)] md:w-20 md:self-start md:flex-col md:overflow-hidden md:rounded-2xl md:p-3 lg:w-56"
    >
      <div className="hidden items-center gap-3 px-2 py-3 lg:flex">
        <BrandMark className="h-8 w-8" />
        <span className="font-display text-lg font-bold text-foreground">
          Sky<span className="text-brand">Vault</span>
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1 md:flex md:flex-1 md:flex-col md:gap-2 md:pt-4">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'relative flex min-h-11 items-center justify-center gap-3 rounded-full px-3 text-sm font-semibold text-muted-foreground transition duration-default ease-vault hover:bg-card-muted hover:text-foreground md:rounded-lg lg:justify-start',
                  isActive && 'bg-card-muted text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'hidden h-6 w-1 rounded-full bg-brand md:absolute md:left-0 md:block',
                      !isActive && 'opacity-0',
                    )}
                    aria-hidden="true"
                  />
                  <Icon aria-hidden="true" size={20} />
                  <span className="sr-only lg:not-sr-only">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
        <NavLink
          to="/vault/settings"
          className={({ isActive }) =>
            cn(
              'relative flex min-h-11 items-center justify-center gap-3 rounded-full px-3 text-sm font-semibold text-muted-foreground transition duration-default ease-vault hover:bg-card-muted hover:text-foreground md:hidden',
              isActive && 'bg-card-muted text-foreground',
            )
          }
        >
          <Settings aria-hidden="true" size={20} />
          <span className="sr-only">Account settings</span>
        </NavLink>
      </div>
      <div className="hidden border-t border-border pt-3 md:flex md:flex-col md:gap-2">
        <NavLink
          to="/vault/settings"
          className={({ isActive }) =>
            cn(
              'relative flex min-h-11 items-center justify-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition duration-default ease-vault hover:bg-card-muted hover:text-foreground lg:justify-start',
              isActive && 'bg-card-muted text-foreground',
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  'absolute left-0 h-6 w-1 rounded-full bg-brand',
                  !isActive && 'opacity-0',
                )}
                aria-hidden="true"
              />
              <CircleUserRound aria-hidden="true" size={20} />
              <span className="sr-only lg:not-sr-only">Account settings</span>
            </>
          )}
        </NavLink>
        <Button
          type="button"
          variant="destructive"
          className="px-3 lg:justify-start"
          disabled={logout.isPending}
          onClick={() =>
            logout.mutate(undefined, {
              onSettled: () => navigate('/auth/login', { replace: true }),
            })
          }
        >
          <LogOut aria-hidden="true" size={20} />
          <span className="sr-only lg:not-sr-only">
            {logout.isPending ? 'Signing out' : 'Sign out'}
          </span>
        </Button>
      </div>
    </nav>
  )
}
