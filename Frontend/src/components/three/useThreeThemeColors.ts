import { useEffect, useState } from 'react'

interface ThreeThemeColors {
  primary: string
  primaryForeground: string
  brand: string
  warningStrong: string
  danger: string
  card: string
  cardMuted: string
  border: string
  foreground: string
  zinc900: string
  zinc700: string
  zinc600: string
  zinc400: string
  zinc300: string
  zincDoor: string
}

function readThemeColors(): ThreeThemeColors {
  const styles = getComputedStyle(document.documentElement)
  return {
    primary: styles.getPropertyValue('--primary').trim(),
    primaryForeground: styles.getPropertyValue('--primary-foreground').trim(),
    brand: styles.getPropertyValue('--brand').trim(),
    warningStrong: styles.getPropertyValue('--warning-strong').trim(),
    danger: styles.getPropertyValue('--danger').trim(),
    card: styles.getPropertyValue('--card').trim(),
    cardMuted: styles.getPropertyValue('--card-muted').trim(),
    border: styles.getPropertyValue('--border').trim(),
    foreground: styles.getPropertyValue('--foreground').trim(),
    zinc900: styles.getPropertyValue('--zinc-900').trim(),
    zinc700: styles.getPropertyValue('--zinc-700').trim(),
    zinc600: styles.getPropertyValue('--zinc-600').trim(),
    zinc400: styles.getPropertyValue('--zinc-400').trim(),
    zinc300: styles.getPropertyValue('--zinc-300').trim(),
    zincDoor: styles.getPropertyValue('--zinc-door').trim(),
  }
}

export function useThreeThemeColors() {
  const [colors, setColors] = useState<ThreeThemeColors>(() => readThemeColors())

  useEffect(() => {
    const update = () => setColors(readThemeColors())
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return colors
}
