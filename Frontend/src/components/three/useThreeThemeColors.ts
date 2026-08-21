import { useEffect, useState } from 'react'

interface ThreeThemeColors {
  primary: string
  primaryForeground: string
  accentAmber: string
  accentCoral: string
  card: string
  cardMuted: string
  border: string
  foreground: string
}

function readThemeColors(): ThreeThemeColors {
  const styles = getComputedStyle(document.documentElement)
  return {
    primary: styles.getPropertyValue('--primary').trim(),
    primaryForeground: styles.getPropertyValue('--primary-foreground').trim(),
    accentAmber: styles.getPropertyValue('--accent-amber').trim(),
    accentCoral: styles.getPropertyValue('--accent-coral').trim(),
    card: styles.getPropertyValue('--card').trim(),
    cardMuted: styles.getPropertyValue('--card-muted').trim(),
    border: styles.getPropertyValue('--border').trim(),
    foreground: styles.getPropertyValue('--foreground').trim(),
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
