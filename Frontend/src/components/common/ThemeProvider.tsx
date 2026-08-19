import { useEffect, type PropsWithChildren } from 'react'
import { useUiStore, type ThemePreference } from '@/store/ui.store'

function resolveTheme(preference: ThemePreference) {
  if (preference !== 'system') return preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(preference: ThemePreference) {
  const root = document.documentElement
  root.classList.toggle('dark', resolveTheme(preference) === 'dark')
  root.classList.add('bg-canvas')
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const preference = useUiStore((state) => state.themePreference)

  useEffect(() => {
    applyTheme(preference)
    if (preference !== 'system') return undefined

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [preference])

  return children
}
