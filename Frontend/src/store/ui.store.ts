import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemePreference = 'system' | 'light' | 'dark'
export type FileViewMode = 'grid' | 'list'

interface UiState {
  themePreference: ThemePreference
  fileViewMode: FileViewMode
  setThemePreference: (themePreference: ThemePreference) => void
  setFileViewMode: (fileViewMode: FileViewMode) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      fileViewMode: 'grid',
      setThemePreference: (themePreference) => set({ themePreference }),
      setFileViewMode: (fileViewMode) => set({ fileViewMode }),
    }),
    { name: 'skyvault-ui-preferences' },
  ),
)
