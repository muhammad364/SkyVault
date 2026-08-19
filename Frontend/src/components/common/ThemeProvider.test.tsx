import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import { useUiStore } from '@/store/ui.store'

describe('ThemeProvider', () => {
  afterEach(() => {
    act(() => {
      useUiStore.setState({ themePreference: 'system' })
    })
    document.documentElement.className = ''
  })

  it('applies a persisted dark preference to the document element', () => {
    act(() => {
      useUiStore.setState({ themePreference: 'dark' })
    })
    render(
      <ThemeProvider>
        <div>SkyVault</div>
      </ThemeProvider>,
    )
    expect(document.documentElement).toHaveClass('dark', 'bg-canvas')
  })
})
