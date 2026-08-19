import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemePreference = 'system' | 'light' | 'dark'

interface UiState {
  themePreference: ThemePreference
  setThemePreference: (themePreference: ThemePreference) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      setThemePreference: (themePreference) => set({ themePreference }),
    }),
    { name: 'skyvault-ui-preferences' },
  ),
)
