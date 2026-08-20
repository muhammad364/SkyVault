import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUiStore, type ThemePreference } from '@/store/ui.store'
import { cn } from '@/lib/utils'

const options: Array<{ value: ThemePreference; label: string; icon: typeof Sun }> = [
  { value: 'light', label: 'Light theme', icon: Sun },
  { value: 'dark', label: 'Dark theme', icon: Moon },
  { value: 'system', label: 'Use system theme', icon: Monitor },
]

export function ThemeToggle({ className }: { className?: string }) {
  const preference = useUiStore((state) => state.themePreference)
  const setPreference = useUiStore((state) => state.setThemePreference)

  return (
    <div className={cn('inline-flex items-center gap-1 rounded-full bg-card-muted p-1', className)} aria-label="Theme">
      {options.map((option) => {
        const Icon = option.icon
        const isActive = preference === option.value

        return (
          <Button
            key={option.value}
            type="button"
            variant={isActive ? 'primary' : 'ghost'}
            size="icon"
            className="min-h-9 min-w-9"
            onClick={() => setPreference(option.value)}
            aria-pressed={isActive}
            title={option.label}
          >
            <Icon aria-hidden="true" size={16} />
            <span className="sr-only">{option.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
