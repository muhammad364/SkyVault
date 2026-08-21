import { describe, expect, it } from 'vitest'
import themeCss from '@/styles/theme.css?raw'

type ThemeTokens = Record<string, string>

const lightBlock = themeCss.match(/:root\s*\{([\s\S]*?)\}/)?.[1] ?? ''
const darkBlock = themeCss.match(/\.dark\s*\{([\s\S]*?)\}/)?.[1] ?? ''

function tokensFrom(block: string): ThemeTokens {
  return Object.fromEntries(
    Array.from(block.matchAll(/--([\w-]+):\s*([^;]+);/g), ([, name, value]) => [
      name,
      value.trim().toLowerCase(),
    ]),
  )
}

const light = tokensFrom(lightBlock)
const dark = tokensFrom(darkBlock)

function rgb(hex: string) {
  const value = hex.replace('#', '')
  return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16))
}

function relativeLuminance(hex: string) {
  const channels = rgb(hex).map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.04045 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrast(first: string, second: string) {
  const firstLuminance = relativeLuminance(first)
  const secondLuminance = relativeLuminance(second)
  const lighter = Math.max(firstLuminance, secondLuminance)
  const darker = Math.min(firstLuminance, secondLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

const exactLightTokens = {
  canvas: '#d9dadd',
  'canvas-strong': '#e7e7e8',
  surface: '#fdfdfd',
  card: '#fafafa',
  'card-muted': '#e9eaec',
  foreground: '#0f151c',
  'secondary-foreground': '#121d2f',
  'muted-foreground': '#596474',
  primary: '#172237',
  brand: '#6d0615',
  border: '#d9dce1',
  ring: '#6d0615',
} as const

const exactDarkTokens = {
  canvas: '#0e1116',
  'canvas-strong': '#24272a',
  surface: '#151920',
  card: '#1c2129',
  'card-muted': '#272d36',
  foreground: '#f5f6f8',
  'secondary-foreground': '#d7dce5',
  'muted-foreground': '#a6afbc',
  primary: '#a8b5c9',
  brand: '#e37b91',
  border: '#343b45',
  ring: '#e37b91',
} as const

describe('zinc, midnight, and burgundy theme contract', () => {
  it('keeps the approved foundational values exact in both themes', () => {
    expect(light).toMatchObject(exactLightTokens)
    expect(dark).toMatchObject(exactDarkTokens)
  })

  it('keeps headings, body copy, metadata, links, placeholders, and alerts at AA contrast', () => {
    const semanticPairs = [
      [light.foreground, light.surface],
      [light['secondary-foreground'], light.surface],
      [light['muted-foreground'], light.surface],
      [light.primary, light.surface],
      [light.brand, light.surface],
      [light['muted-foreground'], light.card],
      [light.warning, light['warning-soft']],
      [light.danger, light['danger-soft']],
      [light.success, light['success-soft']],
      [light['destructive-foreground'], light['destructive-background']],
      [dark.foreground, dark.surface],
      [dark['secondary-foreground'], dark.surface],
      [dark['muted-foreground'], dark.surface],
      [dark.primary, dark.surface],
      [dark.brand, dark.surface],
      [dark['muted-foreground'], dark.card],
      [dark.warning, dark['warning-soft']],
      [dark.danger, dark['danger-soft']],
      [dark.success, dark['success-soft']],
      [dark['destructive-foreground'], dark['destructive-background']],
    ]

    for (const [foreground, background] of semanticPairs) {
      expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps white primary-action text accessible at every gradient stop', () => {
    const gradientStops = ['#37445b', '#29354c', '#172237', '#52617a', '#3b4860', '#29354c']
    for (const stop of gradientStops) {
      expect(contrast('#ffffff', stop)).toBeGreaterThanOrEqual(4.5)
    }
    expect(light['primary-gradient']).toBe(
      'linear-gradient(135deg, #37445b 0%, #29354c 45%, #172237 100%)',
    )
    expect(dark['primary-gradient']).toBe(
      'linear-gradient(135deg, #52617a 0%, #3b4860 45%, #29354c 100%)',
    )
  })
})
