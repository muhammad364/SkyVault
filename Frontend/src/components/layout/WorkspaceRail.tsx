import { Archive, Folder, Home, Search, Settings, ShieldCheck } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/vault', label: 'Vault', icon: Home },
  { to: '/vault/files', label: 'Files', icon: Folder },
  { to: '/vault/search', label: 'Search', icon: Search },
  { to: '/vault/trash', label: 'Trash', icon: Archive },
  { to: '/vault/settings', label: 'Settings', icon: Settings },
]

export function WorkspaceRail() {
  return (
    <nav
      aria-label="Vault navigation"
      className="fixed inset-x-3 bottom-3 z-40 rounded-full bg-card p-2 shadow-float md:sticky md:left-auto md:top-5 md:flex md:min-h-dvh md:w-20 md:flex-col md:rounded-2xl md:p-3 lg:w-56"
    >
      <div className="hidden items-center gap-3 px-2 py-3 lg:flex">
        <img src="/brand/skyvault-mark.svg" className="h-8 w-8" alt="" />
        <span className="font-display text-lg font-bold text-foreground">SkyVault</span>
      </div>
      <div className="grid grid-cols-5 gap-1 md:flex md:flex-1 md:flex-col md:gap-2 md:pt-4">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
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
                      'hidden h-6 w-1 rounded-full bg-primary md:absolute md:left-0 md:block',
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
      </div>
      <NavLink
        to="/admin"
        className={({ isActive }) =>
          cn(
            'hidden min-h-11 items-center justify-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition duration-default ease-vault hover:bg-card-muted hover:text-foreground md:flex lg:justify-start',
            isActive && 'bg-card-muted text-foreground',
          )
        }
      >
        <ShieldCheck aria-hidden="true" size={20} />
        <span className="sr-only lg:not-sr-only">Admin</span>
      </NavLink>
    </nav>
  )
}
